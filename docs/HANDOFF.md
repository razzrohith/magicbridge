# Kickoff prompt for the website session

Open a new Claude Code session with the working directory set to `E:\Startup\magicbridge-site`,
then paste the block below.

---

We're building the immersive, cinematic marketing website for MagicBridge (a $549 stealth
remote-control box). This repo is the website only. Before doing anything, read these in order:

1. `CLAUDE.md` — the stack, hard rules, design system, and copy rules (read every line; the hard
   rules are traps that waste days).
2. `docs/PLAN.md` — the locked decisions, the 9-beat scroll storyboard, and the phase plan.
3. `docs/content.md` — all finalized copy (from the approved deck; no em dashes; sealed box).
4. `docs/research-digest.md` — the full stack research (skim; reference when choosing an approach).

Current state: **Phase 0 is done** — Next 16 + R3F/GSAP/Lenis installed and pinned, dark
tech-noir theme (`#050507`, brand cyan `#12c6e6`, film grain, Space Grotesk/Inter/JetBrains Mono),
a holding hero at `app/page.tsx`, and a cursor-reactive glow. Run it with `pnpm dev` (already
scaffolded; localhost:3000).

Locked decisions: accent = brand cyan `#12c6e6`; product visual = procedural 3D render for now
(real photos at Phase 7); framework = Next.js 16.

**Start Phase 1: build all 9 sections as static DOM** (hero → problem → reveal → how-it-works →
features → deep-dive spec → trust → comparison → $549 close) using the copy in `docs/content.md`,
correct type scale, dark palette, cyan sparingly. No motion yet — this static version is the
reduced-motion / mobile fallback, so it must read well and pass Lighthouse on its own. Motion
(Phase 2), the 3D hero box (Phase 3), and the reveal moment (Phase 4) build on top of it.

Follow every hard rule in CLAUDE.md. Keep a working, shippable site at the end of each phase.
To preview a running page, screenshot it with Playwright (the in-app browser pane may not
composite) at 1440×900, dark color scheme, against `http://localhost:3000`.

---

## Files this repo already contains (self-contained; needs nothing from the firmware repo)
- `CLAUDE.md`, `docs/PLAN.md`, `docs/content.md`, `docs/research-digest.md`
- The scaffolded Next app: `app/`, `components/Logo.tsx`, `components/CursorGlow.tsx`, `biome.json`

## Optional, when their phase arrives
- Phase 4: install Blender (free) for a headless product render → scroll-scrubbed image sequence.
- Phase 6: install KTX-Software (MSI, on PATH) if any GLB ships.
- MCP servers (nice for the visual loop): `@playwright/mcp`, `chrome-devtools-mcp`.

## Manual, owner-only (system settings)
- Windows Defender exclusion for `E:\Startup\magicbridge-site`.
- `git config core.autocrlf input` (run once in this folder).
