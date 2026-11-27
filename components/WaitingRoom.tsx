"use client";

import { t } from "@/lib/i18n";
import type { Lang, Role } from "@/lib/types";
import { Fog, Grain, Vignette } from "./Atmosphere";
import { HouseMark } from "./art/HouseMark";
import { CodeCard } from "./ui/CodeCard";
import { LangToggle } from "./ui/LangToggle";

export function WaitingRoom({
  code,
  role,
  lang,
  onLang,
  onLeaveRole,
}: {
  code: string;
  role: Role;
  lang: Lang;
  onLang: (lang: Lang) => void;
  onLeaveRole: () => void;
}) {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <Fog />
      <Vignette />
      <Grain />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-5">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/25">
            {t(lang, "room.connected")}
          </div>
          <LangToggle lang={lang} onChange={onLang} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="mb-5 animate-flicker text-amber/55">
            <HouseMark className="h-16 w-16" />
          </div>
          <div className="kicker">{t(lang, "room.youAre")}</div>
          <h1 className="mt-2 font-display text-5xl tracking-[0.14em] text-bone">
            {t(lang, role === "A" ? "room.roleA" : "room.roleB")}
          </h1>
          <p className="mt-2 text-[13px] text-bone/45">
            {t(lang, role === "A" ? "room.roleADesc" : "room.roleBDesc")}
          </p>

          <div className="mt-8 w-full">
            <CodeCard code={code} lang={lang} />
          </div>

          <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
            {t(lang, "room.waiting")}
          </div>
        </div>

        <button type="button" onClick={onLeaveRole} className="btn w-full">
          {t(lang, "room.leaveRole")}
        </button>
      </div>
    </main>
  );
}
