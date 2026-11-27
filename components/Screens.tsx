"use client";

import type { Lang } from "@/lib/types";
import { Fog, Grain, Vignette } from "./Atmosphere";
import { HouseMark } from "./art/HouseMark";
import { Icon } from "./ui/Icon";
import { LangToggle } from "./ui/LangToggle";

export function MessageScreen({
  lang,
  onChangeLang,
  kicker,
  title,
  body,
  action,
  secondary,
  loading,
}: {
  lang: Lang;
  onChangeLang?: (lang: Lang) => void;
  kicker?: string;
  title: string;
  body?: string;
  action?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  loading?: boolean;
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <Fog />
      <Vignette />
      <Grain />
      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center text-amber/55">
          <HouseMark className={loading ? "h-16 w-16 animate-pulse" : "h-16 w-16"} />
        </div>
        {kicker && <div className="kicker mb-3">{kicker}</div>}
        <h1 className="font-display text-3xl leading-tight tracking-[0.04em] text-bone">
          {title}
        </h1>
        {body && (
          <p className="mt-4 text-[13.5px] leading-relaxed text-bone/50">{body}</p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="btn btn-primary mt-7 w-full"
          >
            {action.label}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </button>
        )}
        {secondary && (
          <button
            type="button"
            onClick={secondary.onClick}
            className="btn mt-3 w-full"
          >
            {secondary.label}
          </button>
        )}
        {onChangeLang && (
          <div className="mt-7 flex justify-center">
            <LangToggle lang={lang} onChange={onChangeLang} />
          </div>
        )}
      </div>
    </main>
  );
}
