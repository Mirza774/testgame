"use client";

import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { resolveEnding, say } from "@/lib/story";
import { PainterlyScene, type SceneKey } from "../PainterlyScene";
import { useGame } from "../GameContext";

export function EndingChapter() {
  const { code, state, role, lang } = useGame();
  const router = useRouter();
  const ending = resolveEnding(state);
  const secret =
    state.secret.recordings.length === 5 && state.secret.optional.length === 3;

  const art: SceneKey =
    ending.id === "one-remains"
      ? role === "A"
        ? "ending-burning"
        : "ending-whole"
      : ending.art === "sunrise"
        ? "sunrise"
        : "memory";

  return (
    <div className="space-y-5">
      <PainterlyScene scene={art} era={ending.art === "sunrise" ? "past" : "memory"}>
        <div className="flex h-64 flex-col justify-end p-5 sm:h-80">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber/55">
            {t(lang, "ending.kicker")}
          </div>
          <h1 className="mt-1 font-display text-3xl leading-tight text-bone text-shadow-soft sm:text-4xl">
            {say(ending.title, lang)}
          </h1>
          {secret && (
            <div className="mt-3 inline-flex w-fit border border-amber/40 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-amber/75">
              {t(lang, "ending.secret")}
            </div>
          )}
        </div>
      </PainterlyScene>

      <div className="space-y-3">
        {ending.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="font-display text-[17px] leading-relaxed text-bone/70"
          >
            {say(paragraph, lang)}
          </p>
        ))}
      </div>

      <div className="rule" />

      <div className="text-center">
        <div className="font-display text-xl tracking-[0.18em] text-bone/75">
          {t(lang, "ending.credits")}
        </div>
        <p className="mt-2 text-[12.5px] italic text-bone/40">
          {t(lang, "ending.creditsBody")}
        </p>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-bone/30">
          {t(lang, "ending.playedAs")}: {role === "A" ? "NORA" : "CALEB"} ·{" "}
          {t(lang, "ending.room")} {code}
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="btn btn-primary w-full py-4"
      >
        {t(lang, "ending.again")}
      </button>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="btn w-full"
      >
        {t(lang, "ending.home")}
      </button>
    </div>
  );
}
