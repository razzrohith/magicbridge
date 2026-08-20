import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Chrome for the content pages (setup, FAQ). Deliberately plainer than the
 * landing page: no 3D, no scroll choreography, no pinned scenes. Somebody
 * reading these has already bought or is about to, and they need to find an
 * answer fast.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh">
      <SiteHeader />

      <main className="relative mx-auto max-w-3xl px-8 py-20 sm:px-14 sm:py-28">
        <Link
          href="/"
          className="u-link font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint"
        >
          ← Back to MagicBridge
        </Link>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
          {title}
        </h1>
        {intro && <p className="mt-6 text-lg leading-relaxed text-ink-dim">{intro}</p>}

        <div className="prose-mb mt-14">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}
