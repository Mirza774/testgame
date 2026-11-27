"use client";

import { useEffect, useRef, useState } from "react";
import { audio } from "@/lib/audio";
import { accepted, chapterSolved, partnerOf } from "@/lib/game";
import { t } from "@/lib/i18n";
import { buildStages, HIDDEN } from "@/lib/story";
import { cn, romanize } from "@/lib/utils";
import { Fog, Grain, Vignette } from "./Atmosphere";
import { useGame } from "./GameContext";
import { Journal } from "./Journal";
import { ChapterSolved } from "./chapters/ChapterSolved";
import { ChapterView } from "./chapters/ChapterView";
import { EndingChapter } from "./chapters/EndingChapter";
import { FinaleChapter } from "./chapters/FinaleChapter";
import { Prologue } from "./chapters/Prologue";
import { Icon } from "./ui/Icon";
import { LangToggle } from "./ui/LangToggle";

export function Game() {
  const {
    code,
    state,
    role,
    patch,
    lang,
    setLang,
    muted,
    toggleMute,
    notify,
    partnerOnline,
  } = useGame();
  const [journalOpen, setJournalOpen] = useState(false);
  const lastKnock = useRef(0);
  const prevKnock = useRef(state.knock);
  const chimed = useRef<Set<string>>(new Set());
  const mimicSeen = useRef(false);

  useEffect(() => {
    if (state.chapter === 0 && state.ready.A && state.ready.B) {
      patch(["chapter"], 1);
      audio.shift();
    }
  }, [state.chapter, state.ready, patch]);

  useEffect(() => {
    for (const stage of buildStages(state)) {
      const entry = state.puzzles[stage.id];
      if (
        entry &&
        !entry.solved &&
        accepted(entry.A, stage.answerA) &&
        accepted(entry.B, stage.answerB)
      ) {
        patch(["puzzles", stage.id, "solved"], true);
        if (!chimed.current.has(stage.id)) {
          chimed.current.add(stage.id);
          audio.chime();
        }
      }
    }
  }, [state, patch]);

  useEffect(() => {
    const pendingRecordings = HIDDEN.filter(
      (item) =>
        item.kind === "recording" &&
        state.found.A.includes(item.id) &&
        state.found.B.includes(item.id) &&
        !state.secret.recordings.includes(item.id),
    ).map((item) => item.id);
    const pendingOptional = HIDDEN.filter(
      (item) =>
        item.kind === "optional" &&
        state.found.A.includes(item.id) &&
        state.found.B.includes(item.id) &&
        !state.secret.optional.includes(item.id),
    ).map((item) => item.id);

    if (pendingRecordings.length > 0) {
      patch(
        ["secret", "recordings"],
        [...state.secret.recordings, ...pendingRecordings],
      );
      audio.whisper();
    }
    if (pendingOptional.length > 0) {
      patch(
        ["secret", "optional"],
        [...state.secret.optional, ...pendingOptional],
      );
    }
  }, [state.found, state.secret, patch]);

  useEffect(() => {
    if (
      state.chapter >= 1 &&
      state.chapter <= 5 &&
      chapterSolved(state, state.chapter) &&
      state.advance.A === state.chapter &&
      state.advance.B === state.chapter
    ) {
      patch(["chapter"], state.chapter + 1);
      audio.shift();
    }
  }, [state.chapter, state.advance, patch]);

  useEffect(() => {
    if (
      state.chapter === 6 &&
      state.finale.choice?.A &&
      state.finale.choice?.B
    ) {
      const a = state.finale.choice.A;
      const b = state.finale.choice.B;
      if (a === "split" || b === "split") {
        const stay = a === "preserve" ? "A" : b === "preserve" ? "B" : "A";
        patch(["finale", "stay"], stay);
      }
      patch(["chapter"], 7);
      audio.reveal();
    }
  }, [state.chapter, state.finale, patch]);

  useEffect(() => {
    if (state.flags.fakeRadio && !mimicSeen.current) {
      mimicSeen.current = true;
      audio.mimic();
      notify(t(lang, "hud.radioFake"));
    }
  }, [state.flags.fakeRadio, lang, notify]);

  useEffect(() => {
    if (
      state.knock > prevKnock.current &&
      state.knock !== lastKnock.current
    ) {
      notify(t(lang, "hud.knockToast"));
      audio.knock();
    }
    prevKnock.current = state.knock;
  }, [state.knock, notify, lang]);

  function knock() {
    const now = Date.now();
    lastKnock.current = now;
    patch(["knock"], now);
    audio.click();
  }

  const roleName = t(lang, role === "A" ? "room.roleA" : "room.roleB");
  const chapterLabel =
    state.chapter === 0
      ? t(lang, "hud.prologue")
      : state.chapter === 6
        ? t(lang, "hud.finale")
        : state.chapter === 7
          ? t(lang, "hud.ending")
          : `${t(lang, "hud.chapter")} ${romanize(state.chapter)}`;

  return (
    <div className="relative min-h-dvh">
      <Fog />
      <Vignette />
      <Grain />

      <header className="sticky top-0 z-40 border-b border-bone/10 bg-ink/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-2xl px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-bone/30">
                {chapterLabel}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.22em] text-amber/65">
                  {code}
                </span>
                <span className="h-1 w-1 rounded-full bg-bone/20" />
                <span className="truncate text-[11px] text-bone/40">
                  {roleName}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setJournalOpen(true);
                  audio.click();
                }}
                className="icon-btn"
                aria-label={t(lang, "hud.journal")}
                title={t(lang, "hud.journal")}
              >
                <Icon name="book" />
              </button>
              <button
                type="button"
                onClick={knock}
                className="icon-btn"
                aria-label={t(lang, "hud.knock")}
                title={t(lang, "hud.knock")}
              >
                <Icon name="hand" />
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="icon-btn"
                aria-label={t(lang, muted ? "hud.unmute" : "hud.mute")}
                title={t(lang, muted ? "hud.unmute" : "hud.mute")}
              >
                <Icon name={muted ? "mute" : "sound"} />
              </button>
              <LangToggle lang={lang} onChange={setLang} />
            </div>
          </div>

          <div className="mt-2.5 flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((chapter) => (
              <span
                key={chapter}
                className={cn(
                  "h-[2px] flex-1 transition-colors duration-700",
                  state.chapter >= chapter ? "bg-amber/55" : "bg-bone/10",
                )}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-28 pt-6">
        {state.chapter === 0 && <Prologue />}
        {state.chapter >= 1 && state.chapter <= 5 && <ChapterView />}
        {state.chapter === 6 && <FinaleChapter />}
        {state.chapter === 7 && <EndingChapter />}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/10 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-bone/30">
          <span>
            {t(lang, "hud.you")} · {roleName}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                partnerOnline ? "bg-moss" : "bg-blood/80",
              )}
            />
            {t(lang, partnerOnline ? "hud.online" : "hud.offline")}
          </span>
        </div>
      </div>

      {state.chapter >= 1 &&
        state.chapter <= 5 &&
        chapterSolved(state, state.chapter) && <ChapterSolved />}

      <Journal open={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
}
