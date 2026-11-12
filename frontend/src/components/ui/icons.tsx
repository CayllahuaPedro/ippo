type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconClose({ className }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className} {...stroke}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

export function IconArrowUp({ className }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className} {...stroke}>
      <path d="M10 16V4M5 9l5-5 5 5" />
    </svg>
  );
}

export function IconChat({ className }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className} {...stroke}>
      <path d="M4 4.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className} {...stroke}>
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1.06 1.06M14.24 14.24l1.06 1.06M4.7 15.3l1.06-1.06M14.24 5.76l1.06-1.06" />
    </svg>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className} {...stroke}>
      <path d="M16.5 12.2A6.75 6.75 0 0 1 7.8 3.5a6.75 6.75 0 1 0 8.7 8.7z" />
    </svg>
  );
}
