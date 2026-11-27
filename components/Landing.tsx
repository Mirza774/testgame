"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { audio } from "@/lib/audio";
import { createRoomState, randomRoomCode } from "@/lib/game";
import { t } from "@/lib/i18n";
import { store, storeMode } from "@/lib/store";
import type { Lang } from "@/lib/types";
import { langKey } from "@/lib/utils";
import { Fog, Grain, Vignette } from "./Atmosphere";
import { PainterlyScene } from "./PainterlyScene";
import { Icon } from "./ui/Icon";
import { LangToggle } from "./ui/LangToggle";

const MUTE_KEY = "rc:muted";

export function Landing() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("id");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);

  useEffect(() => {
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
  }, []);

  function changeLang(next: Lang) {
    setLang(next);
    window.localStorage.setItem(langKey(), next);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    audio.setMuted(next);
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    if (!next) {
      audio.init();
      audio.startAmbient();
      audio.click();
    }
  }

  async function createRoom() {
    setBusy("create");
    setError("");
    audio.init();
    audio.startAmbient();
    audio.click();

    try {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const roomCode = randomRoomCode();
        const created = await store.createRoom(roomCode, createRoomState());
        if (created) {
          router.push(`/room/${roomCode}`);
          return;
        }
      }
      setError(t(lang, "landing.createError"));
    } catch {
      setError(t(lang, "landing.connectionError"));
    } finally {
      setBusy(null);
    }
  }

  async function joinRoom() {
    const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (normalized.length !== 5) {
      setError(t(lang, "landing.invalidCode"));
      return;
    }

    setBusy("join");
    setError("");
    audio.click();

    try {
      const room = await store.getRoom(normalized);
      if (!room) {
        setError(t(lang, "room.missingBody"));
        return;
      }
      router.push(`/room/${normalized}`);
    } catch {
      setError(t(lang, "landing.connectionError"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <Fog />
      <Vignette />
      <Grain />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 pb-10 pt-5">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/25">
            {storeMode === "local" ? t(lang, "room.local") : t(lang, "room.connected")}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="icon-btn"
              aria-label={t(lang, muted ? "hud.unmute" : "hud.mute")}
              title={t(lang, muted ? "hud.unmute" : "hud.mute")}
            >
              <Icon name={muted ? "mute" : "sound"} />
            </button>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <PainterlyScene
            scene="hall"
            era="past"
            className="mb-6 h-40 w-full rounded-sm sm:h-48"
          >
            <div className="flex h-full items-end justify-center p-4">
              <div className="kicker text-amber/55">
                {t(lang, "landing.eyebrow")}
              </div>
            </div>
          </PainterlyScene>

          <h1 className="font-display text-[40px] font-medium leading-none tracking-[0.12em] text-bone text-shadow-soft sm:text-6xl">
            {t(lang, "landing.title")}
          </h1>
          <p className="mt-2 font-display text-lg italic text-bone/40">
            {t(lang, "landing.subtitle")}
          </p>

          <div className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-amber/50 to-transparent" />

          <p className="max-w-sm text-balance text-[15px] leading-relaxed text-bone/60">
            {t(lang, "landing.tagline")}
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={createRoom}
            disabled={busy !== null}
            className="btn btn-primary w-full py-4"
          >
            {busy === "create"
              ? t(lang, "landing.loading")
              : t(lang, "landing.create")}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </button>

          <div className="panel p-3">
            <label
              htmlFor="room-code"
              className="kicker mb-2 block text-left"
            >
              {t(lang, "landing.codeLabel")}
            </label>
            <div className="flex gap-2">
              <input
                id="room-code"
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 5),
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") void joinRoom();
                }}
                maxLength={5}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="·····"
                className="min-w-0 flex-1 border border-bone/15 bg-black/30 px-3 py-2.5 text-center font-mono text-lg tracking-[0.38em] text-bone placeholder:text-bone/20 focus:border-amber/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={joinRoom}
                disabled={busy !== null}
                className="btn shrink-0"
              >
                {t(lang, "landing.joinBtn")}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-left text-[11.5px] leading-relaxed text-[#d98b7f]">
                {error}
              </p>
            )}
          </div>

          {storeMode === "local" && (
            <p className="border border-amber/20 bg-amber/[0.04] px-3 py-2.5 text-[11px] leading-relaxed text-amber/65">
              {t(lang, "landing.localMode")}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-2.5 border-t border-bone/10 pt-5">
          <div className="kicker">{t(lang, "landing.how")}</div>
          <ol className="space-y-1.5 text-[12.5px] leading-relaxed text-bone/50">
            {[
              t(lang, "landing.how1"),
              t(lang, "landing.how2"),
              t(lang, "landing.how3"),
            ].map((line, index) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 font-mono text-[10px] text-amber/55">
                  {["I.", "II.", "III."][index]}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 text-center font-display text-[12px] italic leading-relaxed text-bone/25">
          {t(lang, "landing.footer")}
        </p>
      </div>
    </main>
  );
}
