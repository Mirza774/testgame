"use client";

import { useState } from "react";
import { audio } from "@/lib/audio";
import { normaliseAnswer, partnerOf } from "@/lib/game";
import { t } from "@/lib/i18n";
import {
  buildStages,
  chapterInfo,
  hiddenForChapter,
  say,
  type Stage,
} from "@/lib/story";
import { cn } from "@/lib/utils";
import { PainterlyScene, type SceneKey } from "../PainterlyScene";
import { useGame } from "../GameContext";

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const { state, role, patch, lang, notify } = useGame();
  const [value, setValue] = useState("");
  const entry = state.puzzles[stage.id];
  const mine = entry?.[role];
  const theirs = entry?.[partnerOf(role)];
  const solved = entry?.solved === true;
  const attempts = entry?.attempts ?? 0;
  const locked = index > 0 && !state.puzzles[buildStages(state).filter((s) => s.chapter === stage.chapter)[index - 1]?.id ?? ""]?.solved;

  const clue = role === "A" ? stage.clueA : stage.clueB;
  const hint = role === "A" ? stage.hintA : stage.hintB;
  const label = role === "A" ? stage.labelA : stage.labelB;
  const options = role === "A" ? stage.optionsA : stage.optionsB;
  const accepted = role === "A" ? stage.answerA : stage.answerB;

  function submit() {
    if (solved || !value.trim()) return;
    const cleaned = normaliseAnswer(value);
    if (accepted.includes(cleaned)) {
      patch(["puzzles", stage.id, role], cleaned);
      audio.tick();
      notify(t(lang, "hud.partnerDone"));
      return;
    }

    const next = attempts + 1;
    patch(["puzzles", stage.id, "attempts"], next);
    audio.wrong();
    if (stage.consequence && next >= 2 && !state.flags[stage.consequence]) {
      patch(["flags", stage.consequence], true);
      audio.crack();
      notify(t(lang, "hud.crack"));
      return;
    }
    notify(t(lang, "hud.wrong"));
  }

  return (
    <section
      className={cn(
        "panel relative overflow-hidden p-4 transition duration-700 sm:p-5",
        locked && "pointer-events-none opacity-35 blur-[1px]",
        solved && "border-moss/30 bg-moss/[0.025]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-amber/45">
            {String(index + 1).padStart(2, "0")} / {stage.chapter}
          </div>
          <h3 className="mt-1 font-display text-xl leading-tight text-bone/90">
            {say(stage.title, lang)}
          </h3>
        </div>
        {solved && (
          <span className="shrink-0 border border-moss/40 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-moss/80">
            {t(lang, "hud.solved")}
          </span>
        )}
      </div>

      {!locked && (
        <>
          <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-bone/65">
            {stage.introA.length > 0 && role === "A" && say(stage.introA[0], lang)}
            {stage.introB.length > 0 && role === "B" && say(stage.introB[0], lang)}
          </div>

          <div className="paper mt-4 border-l-2 border-amber/35 px-3.5 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber/50">
              {t(lang, "hud.clues")}
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-bone/75">
              {say(clue, lang)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em]">
            <span className={mine ? "text-moss/75" : "text-bone/35"}>
              {t(lang, "hud.yourPart")}: {mine ?? "···"}
            </span>
            <span className="h-1 w-1 rounded-full bg-bone/20" />
            <span className={theirs ? "text-moss/75" : "text-bone/35"}>
              {t(lang, "hud.partnerPart")}: {theirs ? "✓" : "···"}
            </span>
            {attempts > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-bone/20" />
                <span className="text-blood/70">
                  {t(lang, "hud.attempts")}: {attempts}
                </span>
              </>
            )}
          </div>

          {!solved && (
            <div className="mt-4">
              <label className="kicker mb-2 block text-left">
                {say(label, lang)}
              </label>

              {options ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setValue(option.value);
                        audio.click();
                      }}
                      className={cn(
                        "border px-3 py-2.5 text-left text-[12.5px] transition",
                        normaliseAnswer(value) === option.value
                          ? "border-amber/60 bg-amber/[0.08] text-amber"
                          : "border-bone/15 text-bone/60 hover:border-amber/35",
                      )}
                    >
                      {say(option.label, lang)}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submit();
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="····"
                  className="w-full border border-bone/15 bg-black/30 px-3 py-2.5 font-mono text-[13px] tracking-[0.14em] text-bone placeholder:text-bone/20 focus:border-amber/50 focus:outline-none"
                />
              )}

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={submit}
                  disabled={!value.trim()}
                  className="btn btn-primary flex-1 py-2.5"
                >
                  {t(lang, "hud.submit")}
                </button>
                {attempts >= 2 && hint && (
                  <button
                    type="button"
                    onClick={() => {
                      audio.static();
                      notify(say(hint, lang));
                    }}
                    className="btn shrink-0 px-3 py-2.5"
                    title={t(lang, "hud.hint")}
                  >
                    ?
                  </button>
                )}
              </div>
            </div>
          )}

          {solved && (
            <p className="mt-4 border-t border-bone/10 pt-3 font-display text-[15px] italic leading-relaxed text-bone/60">
              {say(stage.solved, lang)}
            </p>
          )}
        </>
      )}
    </section>
  );
}

export function ChapterView() {
  const { state, role, patch, lang, notify } = useGame();
  const chapter = state.chapter;
  const info = chapterInfo(chapter);
  const stages = buildStages(state).filter((stage) => stage.chapter === chapter);
  const hidden = hiddenForChapter(chapter);
  const solvedCount = stages.filter(
    (stage) => state.puzzles[stage.id]?.solved,
  ).length;

  if (!info) return null;

  const era = chapter === 5 ? "memory" : role === "A" ? "past" : "present";
  const intensity = Math.min(
    3,
    (state.flags.crack ? 1 : 0) + (state.flags.fakeRadio ? 1 : 0),
  );
  const paragraphs = role === "A" ? info.paragraphsA : info.paragraphsB;
  const anySolved = solvedCount > 0;

  function collect(id: string) {
    if (state.found[role].includes(id)) return;
    const partnerFound = state.found[partnerOf(role)].includes(id);
    patch(["found", role], [...state.found[role], id]);
    audio.whisper();
    notify(t(lang, partnerFound ? "hud.hiddenBoth" : "hud.hiddenFound"));
  }

  return (
    <div className="space-y-5">
      <PainterlyScene
        scene={info.scene as SceneKey}
        era={era}
        intensity={intensity}
        className="h-52 rounded-sm sm:h-64"
      >
        <div className="flex h-full flex-col justify-end p-5">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber/55">
            {say(info.kicker, lang)} · {role === "A" ? "1958" : "1998"}
          </div>
          <h1 className="mt-1 font-display text-3xl leading-tight text-bone text-shadow-soft sm:text-4xl">
            {say(info.title, lang)}
          </h1>
        </div>
      </PainterlyScene>

      <div className="space-y-2.5">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={cn(
              "text-[13.5px] leading-relaxed text-bone/60",
              index === 0 && "dropcap",
            )}
          >
            {say(paragraph, lang)}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-bone/10" />
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-bone/35">
          {t(lang, "hud.solveProgress")}: {solvedCount}/{stages.length}
        </span>
        <div className="h-px flex-1 bg-bone/10" />
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <StageCard key={stage.id} stage={stage} index={index} />
        ))}
      </div>

      {hidden.length > 0 && (
        <div className="space-y-2 pt-2">
          {hidden.map((item) => {
            const mine = state.found[role].includes(item.id);
            const theirs = state.found[partnerOf(role)].includes(item.id);
            const both = mine && theirs;
            const label = role === "A" ? item.labelA : item.labelB;
            const reveal = role === "A" ? item.revealA : item.revealB;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => collect(item.id)}
                disabled={mine}
                className={cn(
                  "w-full border border-dashed px-3.5 py-3 text-left transition",
                  mine
                    ? "cursor-default border-bone/10 text-bone/25"
                    : anySolved
                      ? "border-amber/25 text-amber/55 hover:border-amber/50 hover:bg-amber/[0.03]"
                      : "border-bone/10 text-bone/25 hover:border-bone/25",
                )}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.2em]">
                  {t(lang, "hud.hidden")}
                </div>
                <div className="mt-1 text-[12.5px]">{say(label, lang)}</div>
                {both && (
                  <p className="mt-2 border-t border-bone/10 pt-2 font-display text-[13px] italic leading-relaxed text-bone/55">
                    {say(reveal, lang)}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
