export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MagicBridge"
      className={className}
    >
      <defs>
        <linearGradient id="mb-lg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8beefc" />
          <stop offset="55%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0b7a94" />
        </linearGradient>
      </defs>
      <path
        d="M15 40 C15 25 30 20 50 20 C70 20 85 25 85 40 C85 55 72 58 50 58 C28 58 15 55 15 40 Z"
        fill="none"
        stroke="url(#mb-lg)"
        strokeWidth="5"
      />
      <path d="M50 20 L50 58" stroke="url(#mb-lg)" strokeWidth="3.4" opacity="0.4" />
      <circle cx="32" cy="40" r="3.4" fill="url(#mb-lg)" />
      <circle cx="68" cy="40" r="3.4" fill="url(#mb-lg)" />
      <path d="M22 66 Q50 78 78 66" stroke="url(#mb-lg)" strokeWidth="4.2" fill="none" opacity="0.5" />
      <path d="M28 74 Q50 84 72 74" stroke="url(#mb-lg)" strokeWidth="3.4" fill="none" opacity="0.3" />
    </svg>
  );
}
