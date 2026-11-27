"use client";

import { audio } from "@/lib/audio";
import { t } from "@/lib/i18n";
import { FINAL_CHOICES, finalePrompt, say } from "@/lib/story";
import { cn } from "@/lib/utils";
import { PainterlyScene } from "../PainterlyScene";
import { useGame } from "../GameContext";

export function FinaleChapter() {
  const { state, role, patch, lang, notify } = useGame();
  const mine = state.finale.choice?.[role];
  const theirs = state.finale.choice?.[role === "A" ? "B" : "A"];

  return (
    <div className="space-y-5">
      <PainterlyScene
        scene="core"
        era="memory"
        intensity={3}
        className="h-56 rounded-sm sm:h-72"
      >
        <div className="flex h-full flex-col justify-end p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-blood/70">
            {t(lang, "finale.kicker")}
          </div>
          <h1 className="mt-1 font-display text-3xl leading-tight text-bone text-shadow-soft sm:text-4xl">
            {t(lang, "finale.title")}
          </h1>
        </div>
      </PainterlyScene>

      <div className="paper border-l-2 border-blood/40 px-4 py-4">
        <p className="text-[13.5px] leading-relaxed text-bone/70">
          {say(finalePrompt(role), lang)}
        </p>
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/35">
        {t(lang, "finale.prompt")}
      </p>

      <div className="space-y-3">
        {FINAL_CHOICES.map((choice) => {
          const selected = mine === choice.value;
          return (
            <button
              key={choice.value}
              type="button"
              disabled={Boolean(mine)}
              onClick={() => {
                audio.reveal();
                patch(["finale", "choice", role], choice.value);
                notify(
                  theirs
                    ? t(lang, "finale.reveal")
                    : t(lang, "finale.chosen"),
                );
              }}
              className={cn(
                "panel w-full p-4 text-left transition duration-300",
                selected
                  ? "border-amber/60 bg-amber/[0.07]"
                  : mine
                    ? "opacity-35"
                    : "hover:border-amber/45 hover:bg-amber/[0.03]",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-xl tracking-[0.08em] text-bone">
                  {say(choice.label, lang)}
                </span>
                {selected && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber/70">
                    ✓
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-bone/50">
                {say(choice.description, lang)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-bone/40">
        <span className={mine && theirs ? "bg-moss" : "animate-pulse bg-amber"} />
        {mine && theirs
          ? t(lang, "finale.reveal")
          : mine
            ? t(lang, "finale.chosen")
            : t(lang, "finale.waiting")}
      </div>
    </div>
  );
}
