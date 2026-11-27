"use client";

import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(lang === "id" ? "en" : "id")}
      className="icon-btn"
      aria-label={t(lang, "hud.lang")}
      title={t(lang, "hud.lang")}
    >
      <span className="font-mono text-[10px] tracking-[0.12em]">
        {lang === "id" ? "EN" : "ID"}
      </span>
    </button>
  );
}
