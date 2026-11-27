"use client";

import { t } from "@/lib/i18n";
import type { Lang, Role, RoomState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Fog, Grain, Vignette } from "./Atmosphere";
import { CodeCard } from "./ui/CodeCard";
import { Icon } from "./ui/Icon";
import { LangToggle } from "./ui/LangToggle";

export function Lobby({
  code,
  state,
  lang,
  onPick,
  onLang,
  onLeave,
}: {
  code: string;
  state: RoomState;
  lang: Lang;
  onPick: (role: Role) => void;
  onLang: (lang: Lang) => void;
  onLeave: () => void;
}) {
  const both = Boolean(state.players.A && state.players.B);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <Fog />
      <Vignette />
      <Grain />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onLeave}
            className="icon-btn"
            aria-label={t(lang, "room.back")}
            title={t(lang, "room.back")}
          >
            <Icon name="back" />
          </button>
          <LangToggle lang={lang} onChange={onLang} />
        </div>

        <div className="mt-7 text-center">
          <div className="kicker">{t(lang, "room.choose")}</div>
          <h1 className="mt-2 font-display text-4xl tracking-[0.1em] text-bone">
            {t(lang, "landing.title")}
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-bone/45">
            {t(lang, "landing.tagline")}
          </p>
        </div>

        <div className="mt-7">
          <CodeCard code={code} lang={lang} />
        </div>

        <div className="mt-4 grid gap-3">
          {(["A", "B"] as Role[]).map((role) => {
            const taken = Boolean(state.players[role]);
            return (
              <button
                key={role}
                type="button"
                onClick={() => onPick(role)}
                disabled={taken}
                className={cn(
                  "panel group relative overflow-hidden p-4 text-left transition duration-300",
                  taken
                    ? "opacity-45"
                    : "hover:border-amber/45 hover:bg-amber/[0.03]",
                )}
              >
                <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-amber/60 to-transparent opacity-60" />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl tracking-[0.14em] text-bone">
                    {t(lang, role === "A" ? "room.roleA" : "room.roleB")}
                  </span>
                  <span className="kicker">
                    {taken ? t(lang, "room.taken") : t(lang, "room.pick")}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-bone/50">
                  {t(lang, role === "A" ? "room.roleADesc" : "room.roleBDesc")}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              both ? "bg-amber" : "bg-bone/25",
            )}
          />
          {both ? t(lang, "room.partnerIn") : t(lang, "room.waiting")}
        </div>

        <p className="mt-auto pt-8 text-center text-[11px] leading-relaxed text-bone/30">
          {t(lang, "room.share")}
        </p>
      </div>
    </main>
  );
}
