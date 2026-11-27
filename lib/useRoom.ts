"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { store } from "./store";
import type { RoomState } from "./types";
import { applyPath, type Path } from "./utils";

export type RoomStatus = "loading" | "ready" | "missing" | "error";

export function useRoom(code: string) {
  const [state, setState] = useState<RoomState | null>(null);
  const [status, setStatus] = useState<RoomStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setStatus("loading");
    setError(null);

    store
      .getRoom(code)
      .then((room) => {
        if (!mounted.current) return;
        if (room) {
          setState(room);
          setStatus("ready");
        } else {
          setStatus("missing");
        }
      })
      .catch((err: unknown) => {
        if (!mounted.current) return;
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      });

    const unsubscribe = store.subscribe(code, (next) => {
      if (!mounted.current) return;
      setState(next);
      setStatus("ready");
    });

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      store
        .getRoom(code)
        .then((room) => {
          if (mounted.current && room) setState(room);
        })
        .catch(() => undefined);
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted.current = false;
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [code]);

  const patch = useCallback(
    (path: Path, value: unknown) => {
      setState((prev) => (prev ? applyPath(prev, path, value) : prev));
      store.patch(code, path, value).catch((err: unknown) => {
        console.error("room patch failed", err);
      });
    },
    [code],
  );

  return { state, status, error, patch };
}
