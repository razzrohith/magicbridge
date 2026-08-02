# MagicBridge site — build plan

Immersive, cinematic marketing site for MagicBridge ($549 stealth remote-control box).
Built locally, hosted later. Research digest: `docs/research-digest.md`.

## Locked decisions
- **Accent:** brand cyan `#12c6e6` (matches logo + deck)
- **Product visual:** procedural 3D render for now (captioned "product rendering"); real photos at Phase 7
- **Framework:** Next.js 16 (App Router, static-first)
- **Location:** this repo, `E:\Startup\magicbridge-site` (separate from the Pi firmware repo)

## Stack (all free for commercial use)
Next.js 16 · React 19.2 · TypeScript · Tailwind v4 · shadcn/ui ·
R3F 9 + drei 10 + postprocessing 3 (three r185) · GSAP 3.15 (ScrollTrigger, SplitText) +
Lenis · maath · Biome · pnpm. Fonts: Space Grotesk + Inter + JetBrains Mono (OFL).

## Scroll storyboard (9 beats, ~9 viewport-heights)
1. Hero — box in the void, cursor parallax, "Full control … Invisible."
2. Problem — kinetic text, no imagery
3. **The Reveal** ⭐ (40% of effort) — pinned: what the target sees → "just a monitor and a keyboard"
4. How it works — 3 sticky steps
5. Features — hover-lit bento grid
6. One deep-dive spec (stealth or latency), pinned
7. Trust — plain, "for hardware you own"
8. Comparison — factual table (stealth is the only column we win alone)
9. $549. Once. — box fades out, final CTA

## Phases
- **0 — Foundation** ✅ dark grained typographic holding page; theme tokens; fonts; Biome; CLAUDE.md; MCP install pending
- **1 — Static skeleton** all 9 sections, real copy, no motion (= the reduced-motion/mobile fallback)
- **2 — Scroll + motion** Lenis + ScrollTrigger, kinetic headlines, pinned steps (no 3D yet)
- **3 — Hero 3D box** RoundedBoxGeometry + MeshPhysicalMaterial + CC0 HDRI, cursor-reactive
- **4 — The Reveal ⭐** headless Blender render → scroll-scrubbed WebP sequence + flashlight cursor
- **5 — Cursor + polish** custom cursor, magnetic CTAs, radar-ping; touch/keyboard fallbacks
- **6 — Perf hardening** throttled Lighthouse green; mobile video fallback
- **7 — Truth + trust + SEO** real photos, metadata, OG image, real favicon
- **8 — Ship (later)** domain + hosting

Rule: a working, shippable site at the end of every phase.

## To install when their phase arrives
- Blender (free) — Phase 4 headless render
- KTX-Software (MSI, on PATH) — Phase 6 texture compression (only if GLBs ship)
- MCP servers: `@playwright/mcp`, `chrome-devtools-mcp`

## Manual (system settings — owner does these)
- Windows Defender exclusion for `E:\Startup\magicbridge-site` (HMR speedup)
- `git config core.autocrlf input`
