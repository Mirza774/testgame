"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { audio } from "@/lib/audio";
import { t } from "@/lib/i18n";
import type { Lang, Role } from "@/lib/types";
import { useRoom } from "@/lib/useRoom";
import { storeMode } from "@/lib/store";
import { langKey, roleKey } from "@/lib/utils";
import { Game } from "./Game";
import { GameProvider } from "./GameContext";
import { Lobby } from "./Lobby";
import { MessageScreen } from "./Screens";
import { WaitingRoom } from "./WaitingRoom";

const MUTE_KEY = "rc:muted";

function roleStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  // In local mode two tabs share localStorage, so each tab needs its own role.
  return storeMode === "local" ? window.sessionStorage : window.localStorage;
}

function readStoredRole(code: string): Role | null {
  const value = roleStorage()?.getItem(roleKey(code));
  return value === "A" || value === "B" ? value : null;
}

function writeStoredRole(code: string, role: Role) {
  roleStorage()?.setItem(roleKey(code), role);
}

function clearStoredRole(code: string) {
  roleStorage()?.removeItem(roleKey(code));
}

export default function RoomClient({ code }: { code: string }) {
  const router = useRouter();
  const { state, status, patch } = useRoom(code);
  const [role, setRole] = useState<Role | null>(null);
  const [lang, setLang] = useState<Lang>("id");
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const savedRole = readStoredRole(code);
    if (savedRole) setRole(savedRole);

    const savedLang = window.localStorage.getItem(langKey());
    if (savedLang === "id" || savedLang === "en") setLang(savedLang);

    const savedMute = window.localStorage.getItem(MUTE_KEY);
    if (savedMute === "1") {
      setMuted(true);
      audio.setMuted(true);
    }

    const onFirst = () => {
      audio.init();
      audio.startAmbient();
      window.removeEventListener("pointerdown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst);
    return () => window.removeEventListener("pointerdown", onFirst);
  }, [code]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  }, []);

  // Re-register the player after a reload, or if the room state lost them.
  useEffect(() => {
    if (!state || !role) return;
    if (!state.players[role]) {
      patch(["players", role], {
        role,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
      });
    }
  }, [state, role, patch]);

  useEffect(() => {
    if (!role) return;
    const id = window.setInterval(() => {
      patch(["players", role, "lastSeen"], Date.now());
    }, 25000);
    return () => window.clearInterval(id);
  }, [role, patch]);

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    window.localStorage.setItem(langKey(), next);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      audio.setMuted(next);
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      if (!next) {
        audio.init();
        audio.startAmbient();
        audio.click();
      }
      return next;
    });
  }, []);

  const pickRole = useCallback(
    (picked: Role) => {
      if (!state || state.players[picked]) return;
      audio.init();
      audio.startAmbient();
      audio.click();
      writeStoredRole(code, picked);
      setRole(picked);
      patch(["players", picked], {
        role: picked,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
      });
    },
    [state, code, patch],
  );

  const leaveRole = useCallback(() => {
    if (!role) return;
    patch(["players", role], null);
    clearStoredRole(code);
    setRole(null);
  }, [role, patch, code]);

  if (status === "loading") {
    return (
      <MessageScreen
        lang={lang}
        onChangeLang={changeLang}
        loading
        title={t(lang, "landing.loading")}
      />
    );
  }

  if (status === "missing") {
    return (
      <MessageScreen
        lang={lang}
        onChangeLang={changeLang}
        kicker={t(lang, "room.code") + " " + code}
        title={t(lang, "room.missing")}
        body={t(lang, "room.missingBody")}
        action={{ label: t(lang, "room.back"), onClick: () => router.push("/") }}
      />
    );
  }

  if (status === "error" || !state) {
    return (
      <MessageScreen
        lang={lang}
        onChangeLang={changeLang}
        title={t(lang, "room.errorTitle")}
        body={t(lang, "room.errorBody")}
        action={{ label: t(lang, "hud.retry"), onClick: () => window.location.reload() }}
        secondary={{ label: t(lang, "room.back"), onClick: () => router.push("/") }}
      />
    );
  }

  const both = Boolean(state.players.A && state.players.B);

  if (!role) {
    if (both) {
      return (
        <MessageScreen
          lang={lang}
          onChangeLang={changeLang}
          kicker={t(lang, "room.code") + " " + code}
          title={t(lang, "room.full")}
          body={t(lang, "room.fullBody")}
          action={{ label: t(lang, "room.back"), onClick: () => router.push("/") }}
        />
      );
    }

    return (
      <Lobby
        code={code}
        state={state}
        lang={lang}
        onPick={pickRole}
        onLang={changeLang}
        onLeave={() => router.push("/")}
      />
    );
  }

  if (!both && state.chapter === 0) {
    return (
      <WaitingRoom
        code={code}
        role={role}
        lang={lang}
        onLang={changeLang}
        onLeaveRole={leaveRole}
      />
    );
  }

  const partner = role === "A" ? "B" : "A";
  const partnerPlayer = state.players[partner];
  const partnerSeen = partnerPlayer?.lastSeen ?? partnerPlayer?.joinedAt ?? 0;
  const partnerOnline = partnerSeen > 0 && Date.now() - partnerSeen < 65000;

  return (
    <GameProvider
      value={{
        code,
        state,
        role,
        patch,
        lang,
        setLang: changeLang,
        muted,
        toggleMute,
        notify,
        partnerOnline,
      }}
    >
      <Game />
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-16 z-[85] flex justify-center px-6">
          <div className="panel animate-rise px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-amber/85">
            {toast}
          </div>
        </div>
      )}
    </GameProvider>
  );
}
