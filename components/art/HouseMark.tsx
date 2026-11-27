export function HouseMark({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 9 105 45v66H60Z" fill="rgba(201,162,39,0.05)" stroke="none" />
      <path d="M60 9 15 45v66h45" />
      <path d="M60 9v102" strokeDasharray="2 5" opacity={0.5} />
      <path d="M60 9 105 45v66H60" opacity={0.7} />
      <path d="M27 50h22v18H27Z" opacity={0.55} />
      <path d="M71 50h22v18H71Z" opacity={0.55} />
      <path d="M38 50v18M82 50v18" opacity={0.35} />
      <path d="M27 80h22v22H27Z" opacity={0.35} />
      <path d="M71 80h22v22H71Z" opacity={0.35} />
      <path d="M52 62c4-5 12-5 16 0-4 5-12 5-16 0Z" />
      <circle cx="60" cy="62" r="2.2" fill="currentColor" stroke="none" />
      <path d="M60 104v8" opacity={0.4} />
    </svg>
  );
}
