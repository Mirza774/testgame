"use client";

import { cn } from "@/lib/utils";

export type SceneKey =
  | "letter"
  | "living"
  | "hall"
  | "portrait"
  | "child"
  | "lab"
  | "memory"
  | "core"
  | "sunrise"
  | "the-other"
  | "caretaker"
  | "radio"
  | "ending-burning"
  | "ending-whole";

const FALLBACKS: Record<SceneKey, string> = {
  letter:
    "radial-gradient(120% 90% at 50% 20%, rgba(180,142,62,0.28), transparent 60%), linear-gradient(160deg, #2b2117, #0a0908 70%)",
  living:
    "radial-gradient(120% 90% at 28% 30%, rgba(196,148,62,0.22), transparent 55%), radial-gradient(110% 90% at 82% 78%, rgba(86,112,130,0.16), transparent 58%), linear-gradient(160deg, #1c1712, #08090a 75%)",
  hall:
    "radial-gradient(100% 80% at 50% 16%, rgba(196,148,62,0.20), transparent 55%), linear-gradient(170deg, #1b1510, #070807 78%)",
  portrait:
    "radial-gradient(100% 80% at 48% 32%, rgba(174,138,72,0.22), transparent 58%), linear-gradient(155deg, #211a13, #080807 76%)",
  child:
    "radial-gradient(100% 85% at 32% 24%, rgba(186,146,72,0.20), transparent 55%), radial-gradient(90% 80% at 78% 82%, rgba(90,110,124,0.12), transparent 60%), linear-gradient(160deg, #1a1510, #08090a 76%)",
  lab:
    "radial-gradient(100% 80% at 30% 34%, rgba(174,132,58,0.18), transparent 52%), radial-gradient(90% 80% at 76% 76%, rgba(72,110,104,0.16), transparent 60%), linear-gradient(160deg, #141714, #060807 78%)",
  memory:
    "radial-gradient(100% 90% at 62% 28%, rgba(126,54,54,0.18), transparent 58%), linear-gradient(150deg, #14141a, #07070a 76%)",
  core:
    "radial-gradient(80% 70% at 50% 52%, rgba(150,38,38,0.24), transparent 58%), linear-gradient(160deg, #17100f, #060607 78%)",
  sunrise:
    "radial-gradient(120% 90% at 50% 78%, rgba(206,164,92,0.30), transparent 62%), linear-gradient(170deg, #191715, #0a0a0a 76%)",
  "the-other":
    "radial-gradient(80% 80% at 50% 38%, rgba(120,40,44,0.18), transparent 58%), linear-gradient(160deg, #101014, #050507 78%)",
  caretaker:
    "radial-gradient(100% 80% at 50% 28%, rgba(180,140,64,0.16), transparent 55%), linear-gradient(170deg, #17120e, #070707 78%)",
  radio:
    "radial-gradient(90% 80% at 46% 42%, rgba(186,146,72,0.24), transparent 58%), linear-gradient(160deg, #1b150f, #070706 78%)",
  "ending-burning":
    "radial-gradient(110% 85% at 46% 70%, rgba(158,74,42,0.28), transparent 60%), linear-gradient(170deg, #171210, #070707 78%)",
  "ending-whole":
    "radial-gradient(110% 85% at 48% 34%, rgba(188,148,72,0.24), transparent 58%), linear-gradient(170deg, #1a1410, #070707 78%)",
};

export function PainterlyScene({
  scene,
  era = "past",
  intensity = 0,
  className,
  children,
}: {
  scene: SceneKey;
  era?: "past" | "present" | "memory";
  intensity?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const warmth =
    era === "past"
      ? "sepia(0.18) saturate(0.92) contrast(1.04)"
      : era === "present"
        ? "saturate(0.52) contrast(1.12) brightness(0.86)"
        : "saturate(0.68) contrast(1.16) hue-rotate(-8deg)";
  const distortion =
    intensity > 0
      ? `contrast(${1 + intensity * 0.18}) saturate(${1 - intensity * 0.35})`
      : "";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-bone/10 bg-soot",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center transition-[filter,transform] duration-1000"
        style={{
          backgroundImage: `url('/art/${scene}.jpg'), ${FALLBACKS[scene]}`,
          filter: `${warmth} ${distortion}`.trim(),
          transform: `scale(${1 + intensity * 0.025})`,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 90% at 50% 38%, transparent 36%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay opacity-[0.16]"
      >
        <filter id={`scene-grain-${scene}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#scene-grain-${scene})`} />
      </svg>

      {intensity >= 2 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-flicker bg-blood/20 blur-sm"
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
