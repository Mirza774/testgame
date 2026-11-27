import { normalizeState } from "./game";
import { supabase } from "./supabase";
import type { RoomState } from "./types";
import { applyPath, codeKey, type Path } from "./utils";

export type StoreMode = "supabase" | "local";

export interface RoomStore {
  mode: StoreMode;
  getRoom(code: string): Promise<RoomState | null>;
  createRoom(code: string, state: RoomState): Promise<boolean>;
  patch(code: string, path: Path, value: unknown): Promise<void>;
  subscribe(code: string, cb: (state: RoomState) => void): () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 Supabase                                   */
/* -------------------------------------------------------------------------- */

const supabaseStore: RoomStore = {
  mode: "supabase",

  async getRoom(code) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("rooms")
      .select("state")
      .eq("id", code)
      .maybeSingle();

    if (error) throw error;
    return normalizeState(data?.state);
  },

  async createRoom(code, state) {
    if (!supabase) return false;
    const { error } = await supabase.from("rooms").insert({ id: code, state });

    if (!error) return true;
    if (error.code === "23505") return false;
    throw error;
  },

  async patch(code, path, value) {
    if (!supabase) return;
    const { error } = await supabase.rpc("room_set_path", {
      p_id: code,
      p_path: path,
      p_value: value,
    });
    if (error) throw error;
  },

  subscribe(code, cb) {
    const client = supabase;
    if (!client) return () => undefined;

    const channel = client
      .channel(`room:${code}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${code}`,
        },
        (payload) => {
          const next = normalizeState(
            (payload.new as { state?: unknown } | null)?.state,
          );
          if (next) cb(next);
        },
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  },
};

/* -------------------------------------------------------------------------- */
/*                              Local fallback                                */
/* -------------------------------------------------------------------------- */

const channels = new Map<string, BroadcastChannel>();

function getChannel(code: string): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }
  let channel = channels.get(code);
  if (!channel) {
    channel = new BroadcastChannel(`rc-room-${code}`);
    channels.set(code, channel);
  }
  return channel;
}

function readLocal(code: string): RoomState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(codeKey(code));
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeLocal(code: string, state: RoomState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(codeKey(code), JSON.stringify(state));
  } catch {
    /* storage might be full or blocked */
  }
  getChannel(code)?.postMessage({ type: "state", state });
}

const localStore: RoomStore = {
  mode: "local",

  async getRoom(code) {
    return readLocal(code);
  },

  async createRoom(code, state) {
    if (readLocal(code)) return false;
    writeLocal(code, state);
    return true;
  },

  async patch(code, path, value) {
    const current = readLocal(code);
    if (!current) return;
    writeLocal(code, applyPath(current, path, value));
  },

  subscribe(code, cb) {
    if (typeof window === "undefined") return () => undefined;

    const channel = getChannel(code);
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; state?: unknown };
      const next = normalizeState(data?.state);
      if (data?.type === "state" && next) cb(next);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== codeKey(code) || !event.newValue) return;
      try {
        const next = normalizeState(JSON.parse(event.newValue));
        if (next) cb(next);
      } catch {
        /* ignore malformed */
      }
    };

    channel?.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);

    return () => {
      channel?.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  },
};

export const store: RoomStore = supabase ? supabaseStore : localStore;
export const storeMode: StoreMode = store.mode;
