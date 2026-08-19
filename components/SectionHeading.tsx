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
      className={`font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint ${className ?? ""}`}
    >
      <span className="mr-3 text-cyan/70">{index}</span>
      {label}
    </p>
  );
}
