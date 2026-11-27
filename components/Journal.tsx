"use client";

import { t } from "@/lib/i18n";
import { HIDDEN, journalEntries, say } from "@/lib/story";
import { partnerOf } from "@/lib/game";
import { Icon } from "./ui/Icon";
import { useGame } from "./GameContext";

export function Journal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, role, lang } = useGame();
  if (!open) return null;

  const entries = journalEntries(lang, role, state);
  const recordings = HIDDEN.filter((item) => item.kind === "recording");
  const optionals = HIDDEN.filter((item) => item.kind === "optional");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[86dvh] w-full max-w-md overflow-y-auto border border-bone/15 bg-soot p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, "journal.title")}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="kicker">{t(lang, "hud.journal")}</div>
            <h2 className="mt-1 font-display text-2xl text-bone">
              {t(lang, "journal.title")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label={t(lang, "hud.close")}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="mt-4 border border-amber/20 bg-amber/[0.03] px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-amber/65">
          {t(lang, "journal.secretProgress")}: {state.secret.recordings.length}/
          {recordings.length} · {state.secret.optional.length}/{optionals.length}
        </div>

        <div className="mt-5 space-y-5">
          {entries.length === 0 && (
            <p className="text-sm text-bone/40">{t(lang, "journal.empty")}</p>
          )}

          {entries.map((entry) => (
            <div key={entry.chapter} className="border-l border-amber/25 pl-3.5">
              <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber/50">
                {String(entry.chapter).padStart(2, "0")}
              </div>
              <div className="mt-0.5 font-display text-lg leading-snug text-bone/85">
                {entry.title}
              </div>
              <div className="mt-1.5 space-y-1.5 text-[12.5px] leading-relaxed text-bone/55">
                {entry.lines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              {entry.result && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-amber/70">
                  {t(lang, "journal.result")}: {entry.result}
                </p>
              )}
            </div>
          ))}

          {HIDDEN.some(
            (item) =>
              state.found[role].includes(item.id) ||
              state.found[partnerOf(role)].includes(item.id),
          ) && (
            <div className="border-t border-bone/10 pt-4">
              <div className="kicker">{t(lang, "journal.hidden")}</div>
              <div className="mt-3 space-y-3">
                {HIDDEN.filter(
                  (item) =>
                    state.found[role].includes(item.id) ||
                    state.found[partnerOf(role)].includes(item.id),
                ).map((item) => (
                  <div key={item.id} className="text-[12.5px]">
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber/45">
                      {item.kind === "recording"
                        ? t(lang, "journal.recordings")
                        : t(lang, "journal.optionals")}
                    </div>
                    <p className="mt-1 leading-relaxed text-bone/60">
                      {say(role === "A" ? item.revealA : item.revealB, lang)}
                    </p>
                    {!state.secret[
                      item.kind === "recording" ? "recordings" : "optional"
                    ].includes(item.id) && (
                      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-blood/60">
                        {t(lang, "hud.waitingCheck")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
