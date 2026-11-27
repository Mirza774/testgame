"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { Icon } from "./Icon";

export function CodeCard({ code, lang }: { code: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="panel px-4 py-4 text-center">
      <div className="kicker">{t(lang, "room.code")}</div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <span className="font-mono text-3xl tracking-[0.32em] text-amber">
          {code}
        </span>
        <button
          type="button"
          onClick={copy}
          className="icon-btn"
          aria-label={t(lang, "room.copy")}
          title={t(lang, "room.copy")}
        >
          <Icon name={copied ? "check" : "copy"} />
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-bone/40">
        {copied ? t(lang, "room.copied") : t(lang, "room.share")}
      </p>
    </div>
  );
}
