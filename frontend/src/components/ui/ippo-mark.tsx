export function IppoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g stroke="currentColor">
        <path d="M24 10 V50" />
        <path d="M24 28 H36" />
        <path d="M10 32 V50" />
        <path d="M5 50 H34" />
      </g>
      <path d="M34 50 H45 V37 H59" stroke="var(--color-accent)" />
    </svg>
  );
}
