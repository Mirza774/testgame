"use client";

import { audio } from "@/lib/audio";
import { t } from "@/lib/i18n";
import { PainterlyScene } from "../PainterlyScene";
import { useGame } from "../GameContext";

export function Prologue() {
  const { state, role, patch, lang, notify } = useGame();
  const mine = state.ready[role] === true;
  const theirs = state.ready[role === "A" ? "B" : "A"] === true;

  function answer() {
    if (mine) return;
    audio.init();
    audio.startAmbient();
    audio.static(0.7);
    patch(["ready", role], true);
    notify(
      theirs
        ? t(lang, "prologue.ready")
        : t(lang, "prologue.waiting"),
    );
  }

  return (
    <div className="space-y-5">
      <PainterlyScene scene="letter" era={role === "A" ? "past" : "present"}>
        <div className="flex h-64 flex-col justify-end p-5 sm:h-80">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber/55">
            {t(lang, "prologue.kicker")}
          </div>
          <h1 className="mt-2 font-display text-3xl leading-tight text-bone text-shadow-soft sm:text-4xl">
            {t(lang, "prologue.title")}
          </h1>
        </div>
      </PainterlyScene>

      <div className="paper border-l-2 border-amber/40 px-4 py-4">
        <p className="font-display text-lg italic leading-relaxed text-bone/75">
          “{t(lang, "prologue.letter")}”
        </p>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-bone/30">
          — {role === "A" ? "NORA / 1958" : "CALEB / 1998"}
        </p>
      </div>

      <p className="text-[13.5px] leading-relaxed text-bone/60">
        {role === "A"
          ? lang === "id"
            ? "Kau berdiri di ruang tamu yang masih hangat. Di luar, hujan belum turun. Radio di meja berderak, dan suara itu bukan suara ibumu."
            : "You stand in a living room that is still warm. Outside, the rain has not fallen yet. The radio on the table crackles, and the voice is not your mother's."
          : lang === "id"
            ? "Kau berdiri di ruang yang sama, empat puluh tahun kemudian. Atapnya bocor. Radio itu seharusnya sudah mati — tapi berderak juga di tanganmu."
            : "You stand in the same room, forty years later. The roof leaks. That radio should be dead — yet it crackles in your hands too."}
      </p>

      <button
        type="button"
        onClick={answer}
        disabled={mine}
        className="btn btn-primary w-full py-4"
      >
        {mine ? t(lang, "prologue.waiting") : t(lang, "prologue.cta")}
      </button>

      <div className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-bone/40">
        <span
          className={`h-1.5 w-1.5 rounded-full ${mine && theirs ? "bg-moss" : "animate-pulse bg-amber"}`}
        />
        {mine && theirs
          ? t(lang, "prologue.ready")
          : mine
            ? t(lang, "prologue.partnerWaiting")
            : t(lang, "prologue.waiting")}
      </div>
    </div>
  );
}
