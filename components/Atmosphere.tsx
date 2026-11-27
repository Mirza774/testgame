export function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full opacity-[0.05] mix-blend-overlay"
    >
      <filter id="rc-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.86"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#rc-grain)" />
    </svg>
  );
}

export function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[65]"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  );
}

export function Fog() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-40 top-1/4 h-[420px] w-[620px] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(232,224,207,0.045),transparent)] blur-2xl" />
      <div
        className="absolute -right-32 bottom-1/4 h-[380px] w-[560px] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(201,162,39,0.04),transparent)] blur-2xl"
        style={{ animationDelay: "-4s" }}
      />
    </div>
  );
}
