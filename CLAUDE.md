# CLAUDE.md — MagicBridge marketing site

Cinematic, immersive single-product marketing site for **MagicBridge**: a small box
you plug into a second computer to see and control it from any browser, invisibly.
$549, one-time. Built locally now, hosted later. Sibling product repo lives at
`E:\Startup\magicbridge-diy` (the Pi firmware) — this repo is the website only.

## Stack (pinned — do NOT upgrade majors mid-build)
- **Next.js 16** App Router, static-first · React **19.2** · TypeScript strict
- **Tailwind v4** (CSS-first via `@theme` in `app/globals.css` — there is **NO** `tailwind.config.js`)
- **React Three Fiber 9** + `@react-three/drei` 10 + `@react-three/postprocessing` 3 · three r185
- **GSAP 3.15** (ScrollTrigger, SplitText) + `@gsap/react` + **Lenis** for smooth scroll
- **maath** for framerate-independent damping · **Biome** for lint+format · **pnpm**

## Hard rules (these are the traps that waste days)
1. **R3F `<Canvas>` is client-only.** Wrap in `"use client"` + `next/dynamic({ ssr:false })`. Never import a scene into a server component.
2. **Never `setState` per frame or per pointer move.** Drive animation with refs + `useFrame`, or GSAP/Lenis writing to refs, then `invalidate()`. Per-frame React state destroys INP/FPS.
3. **Always use the `useGSAP()` hook** (`@gsap/react`) for ScrollTrigger/tweens — auto-cleanup. Raw `useEffect` leaks triggers under StrictMode/fast-refresh.
4. **One scroll owner.** Lenis owns smooth scroll; GSAP ScrollTrigger reads it. Do not add ScrollSmoother too, and don't let drei `ScrollControls` fight ScrollTrigger — ScrollTrigger drives the R3F camera via a shared progress ref.
5. **Tailwind v4 is CSS-first.** No `tailwind.config.js`, no `content` array. Tokens live in `@theme`. Don't invent v3 config.
6. **Framerate-independent motion only.** Use `maath` `easing.damp3/dampE` or GSAP springs — never naive `lerp(a,b,0.1)` per frame (feels 2× fast on 144Hz).
7. **LCP must be real DOM** (headline/poster), not `<canvas>`. Reserve the canvas box (fixed aspect) so CLS stays < 0.1. Fade 3D in behind the headline.
8. **Gate cursor effects** behind `matchMedia('(hover:hover) and (pointer:fine)')` and honor `prefers-reduced-motion`. Every hover reveal needs a scroll/`:focus-visible` fallback — touch + keyboard users see the same content.
9. **Self-host env maps** (gainmap JPEG), never drei's `preset` CDN in production. Run any GLB through `gltf-transform` (meshopt + KTX2), not Draco (mesh is tiny).

## Design system
- Stage `#050507` (never pure `#000`), film grain overlay. **One accent: brand cyan `#12c6e6`**, on < 5% of pixels (CTA, status dots, one keyword/section). No second accent, no purple-blue AI-gradient.
- Type: **Space Grotesk** (display 72–140px) · **Inter** (body) · **JetBrains Mono** (11–12px uppercase eyebrows/labels). Self-hosted via `next/font`.
- Motion: entrances 0.6–1.0s `cubic-bezier(0.16,1,0.3,1)`; scrubbed scenes no easing, ~0.8s smoothing; cursor parallax ±2–6px, damp 0.06–0.1. Restraint > effects.

## Content = the deck (already written)
Copy, comparison table, "$549 once", the stealth story, "even when it's stuck", and the
sealed-box framing all come from `E:\Startup\magicbridge-diy\docs\presentation`. **Never
name the internals** (no Raspberry Pi / capture board / SD card) — the box is a sealed product.

## Tone / safety
"A box that controls a computer undetected" reads as spyware to cold visitors and payment
processors. Keep **"for hardware you own"** in the hero + a dedicated Trust section. Renders
are captioned "product rendering"; real photos slot in near the price at Phase 7.

## Testing
Your dev box is an RTX 4060 — it lies. Test scroll/3D with Chrome DevTools **CPU 4×/6× + GPU throttle**
and a mid-tier profile before calling anything done. Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.

## Commands
- `pnpm dev` (Turbopack) · `pnpm build` · `pnpm lint` (Biome) · `pnpm format` · `pnpm typecheck`
