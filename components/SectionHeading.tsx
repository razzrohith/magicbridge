export function SectionHeading({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <p
      data-reveal
      className={`font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:text-[11px] sm:tracking-[0.3em] ${className ?? ""}`}
    >
      <span className="mr-3 text-cyan/70">{index}</span>
      {label}
    </p>
  );
}
