"use client";

import { audio } from "@/lib/audio";
import { buildStages, chapterInfo, say } from "@/lib/story";
import { partnerOf } from "@/lib/game";
import { t } from "@/lib/i18n";
import { useGame } from "../GameContext";

export function ChapterSolved() {
  const { state, role, patch, lang } = useGame();
  const iReady = state.advance[role] === state.chapter;
  const partnerReady = state.advance[partnerOf(role)] === state.chapter;
  const info = chapterInfo(state.chapter);
  const stages = buildStages(state).filter((s) => s.chapter === state.chapter);
  const lastSolved = [...stages]
    .reverse()
    .find((stage) => state.puzzles[stage.id]?.solved);

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-ink/95 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md animate-rise text-center">
        <div className="kicker text-amber/60">
          {t(lang, "hud.solved")} · {info ? say(info.title, lang) : ""}
        </div>
        <div className="mx-auto my-5 h-px w-16 bg-amber/40" />
        <p className="font-display text-[20px] leading-relaxed text-bone/85">
          {lastSolved ? say(lastSolved.solved, lang) : t(lang, "hud.correct")}
        </p>

        <button
          type="button"
          disabled={iReady}
          onClick={() => {
            patch(["advance", role], state.chapter);
            audio.click();
          }}
          className="btn btn-primary mt-8 w-full py-4"
        >
          {iReady ? t(lang, "hud.waitingPartner") : t(lang, "hud.continue")}
        </button>

        {iReady && partnerReady && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/35">
            {t(lang, "finale.reveal")}
          </p>
        )}
      </div>
    </div>
  );
}
