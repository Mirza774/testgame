type IconName =
  | "book"
  | "sound"
  | "mute"
  | "hand"
  | "globe"
  | "copy"
  | "back"
  | "close"
  | "check"
  | "arrow"
  | "eye"
  | "key";

const paths: Record<IconName, React.ReactNode> = {
  book: (
    <>
      <path d="M4 6.2A2.7 2.7 0 0 1 6.7 3.5H20v17H6.7A2.7 2.7 0 0 0 4 23.2Z" />
      <path d="M4 6.2v14.3M8 3.5v17" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9.2v5.6h3.4L12 18.6V5.4L7.4 9.2Z" />
      <path d="M15.5 8.8a4.6 4.6 0 0 1 0 6.4M18.4 6a8.6 8.6 0 0 1 0 12" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.2v5.6h3.4L12 18.6V5.4L7.4 9.2Z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </>
  ),
  hand: (
    <>
      <path d="M8.5 21v-5.4L6 13.2c-.8-1 .4-2.3 1.4-1.4L9.5 14V6.4c0-1.2 1.8-1.2 1.8 0v5.4" />
      <path d="M11.3 11.2V4.6c0-1.2 1.8-1.2 1.8 0v6.4M13.1 11.2V5.3c0-1.2 1.8-1.2 1.8 0v6.6M14.9 12V7.6c0-1.2 1.8-1.2 1.8 0V15c0 3.5-2 6-5 6Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1" />
      <path d="M15 9V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4" />
    </>
  ),
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m4.5 12.5 4.5 4.5L19.5 6.5" />,
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  eye: (
    <>
      <path d="M2.5 12S6.5 6 12 6s9.5 6 9.5 6-4 6-9.5 6S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="3.6" />
      <path d="m10.6 10.6 9.4 9.4M16.2 16.2l2-2M18.4 18.4l2-2" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
