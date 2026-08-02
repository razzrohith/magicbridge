==========================================================================================
## 3D/WebGL rendering layer for a cinematic marketing website (2026)

RECOMMENDATION:
Use React Three Fiber 9.7 (@react-three/fiber) + @react-three/drei 10.7 + @react-three/postprocessing 3.0 on top of three r185 (npm three@0.185.1), inside Next.js or Vite+React. This is what the solo-dev tier of award-winning sites actually ships, it is the stack AI coding agents know best (massive training data, declarative JSX scenes are easy for an agent to iterate on), and drei gives you the cinematic look for free: Environment (HDRI lighting), ContactShadows, Float, ScrollControls, MeshTransmissionMaterial, plus Bloom/DOF/Noise/Vignette from postprocessing — that combination is 90% of the 'premium' aesthetic with zero modelling. For the product model: your product is a small box — the single easiest shape in 3D. Either export the enclosure CAD (STL/STEP → Blender import → GLB, pure conversion, no modelling) or pay one month of Spline Professional ($25) to model a beveled box with materials and export GLB, then cancel — but render that GLB in R3F yourself; do NOT embed the Spline runtime (581 KB gz + 1–2 s init will wreck Lighthouse on a marketing page). Ship the stock WebGLRenderer now; treat WebGPU as a later toggle, not a requirement.

KEY FACTS:
  - Verified from npm registry (2026-08-02): three@0.185.1 (r185, MIT), @react-three/fiber@9.7.0 (MIT), @react-three/drei@10.7.7 (MIT), @react-three/postprocessing@3.0.4 (MIT), @babylonjs/core@9.19.0 (Apache-2.0), @splinetool/runtime@1.12.98 (NO license field)
  - Measured bundle costs: three full build 182.4 KB gz (726 KB min, bundlephobia); R3F +51.8 KB gz; Spline runtime.js 2.05 MB min / ~581 KB gz + physics.js ~726 KB gz (measured from the actual npm tarball); Unicorn Studio SDK v1.4.32 156 KB min / ~39 KB gz (measured from CDN)
  - R3F v9 requires React 19 and is compatible with React 19.0–19.2 (reconciler version coupling)
  - WebGPU ships by default in all major engines: Chrome 113+ (Apr 2023), Safari 26 (macOS/iOS 26, 2025), Firefox on Windows (147 by Jan 2026); ~84.7% global support claimed by 2026 trackers; Firefox Linux/Android still pending
  - three.js r171 (Sept 2025) made WebGPURenderer production-ready with automatic WebGL2 fallback; TSL compiles one shader source to WGSL and GLSL
  - Spline pricing (spline.design/pricing): Free $0 (watermarked web export), Starter $12/mo annual ($15 monthly, removes watermark), Professional $20/mo annual ($25 monthly) — GLTF/GLB/USDZ/STL export is Professional-only
  - Unicorn Studio: free tier non-commercial; Legend $14/mo annual ($20 monthly) for commercial use + SDK JSON export
  - Documented Spline embed behavior: 1–2 s init even for near-empty scenes; real case of Lighthouse 30/100 fixed to 90 only via lazy-loading
  - Free asset pipeline confirmed alive in 2026: Poly Haven is CC0 (GLB + 8K textures + HDRIs, no signup); Sketchfab free/CC downloads remain up post-Fab migration but licenses are per-model
  - Performance budget reality: an R3F scene (three 182 KB + R3F 52 KB + drei picks + one 2–5 MB Draco/meshopt-compressed GLB + one HDRI) comfortably beats a single default Spline embed

GOTCHAS:
  ! Embedding Spline scenes (iframe or @splinetool/react-spline) is the #1 way solo devs ruin a premium site: ~581 KB gz runtime + scene payload + 1–2 s init + layout shift = failed Core Web Vitals. Use Spline as an EDITOR, export GLB (needs Professional for one month), render in R3F.
  ! R3F + Next.js: the Canvas must be client-only (dynamic import, ssr:false) and R3F v9 only supports React 19.0–19.2 — a casual React/Next upgrade can silently break the reconciler. Pin versions.
  ! In R3F, never drive animation with React state — setState per frame collapses FPS. Use useFrame + refs, and lerp toward mouse/scroll targets (also gives you the smoothed 'cinematic' feel for free).
  ! GLB size is your real payload: run every model through gltf-transform (Draco or meshopt + KTX2 texture compression) or gltfjsx. An unoptimized Sketchfab download is routinely 30–80 MB.
  ! drei's ScrollControls fights GSAP ScrollTrigger if the rest of the page uses GSAP — pick ONE scroll owner. Common pattern: GSAP ScrollTrigger owns the page, drives R3F camera/values via a shared progress ref.
  ! Don't start with WebGPURenderer: drei/postprocessing still have WebGL-first corners, and debugging an agent-generated TSL shader is much harder than GLSL with the existing ecosystem. WebGL now, WebGPU later is a one-import swap.
  ! The 'no modelling' trap that isn't: a stealth box product means you likely already have enclosure CAD. STL/STEP → Blender (free) → export GLB is file conversion, not modelling. Ten minutes of YouTube, not a 3D course.
  ! Fully zero-WebGL fallback exists and is Apple's own trick: render the product turntable to a JPEG/WebP frame sequence (even from Spline free tier via video/image export) and scrub it with scroll on a <canvas>. If WebGL work stalls, this ships.
  ! npm blocks generic fetchers (403) — when verifying versions, hit registry.npmjs.org directly.
  ! Laptop test lies: integrated-GPU Windows machines (your dev box may be fine, buyers' may not) can take 6+ s to first frame on heavy scenes — test with Chrome DevTools GPU throttling and a real mid-tier laptop before launch.

COST/LICENSING: Recommended stack is entirely free/MIT: three.js (MIT), @react-three/fiber, drei, @react-three/postprocessing (all MIT); Babylon.js is Apache-2.0 if ever used; Blender is GPL (tool only — its GLB output is yours). Free CC0 assets: Poly Haven (models/HDRIs/textures, no attribution). Sketchfab free downloads: check per-model license, keep a screenshot. Only optional costs: Spline Professional $20/mo annual or $25 for a single month (needed once, only for GLTF/GLB export — the modelling itself is free tier); Unicorn Studio Legend $14/mo annual if you want its shader-effect embeds commercially (free tier is non-commercial). @splinetool/runtime ships with no OSS license (proprietary) — another reason to export GLB rather than depend on it.
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] React Three Fiber 9.7 + drei 10.7 + @react-three/postprocessing 3.0
  [CONSIDER] Raw three.js r185 (0.185.1)
  [AVOID   ] Babylon.js 9 (@babylonjs/core 9.19.0)
  [CONSIDER] Spline (spline.design)
  [CONSIDER] Unicorn Studio
  [CONSIDER] WebGPU (three WebGPURenderer + TSL)

==========================================================================================
## Scroll-driven animation for a cinematic website (2026)

RECOMMENDATION:
Build on GSAP 3.15 + ScrollTrigger + SplitText, with Lenis 1.3 for the smooth-scroll feel — this is the exact stack behind most Awwwards-grade product pages and it is now entirely free: since April 2025 (post-Webflow-acquisition, GSAP 3.13) every formerly-paid plugin including ScrollTrigger, ScrollSmoother and SplitText ships free for commercial use under the "Standard 'No Charge' GSAP License" (free but proprietary/revocable; only real restriction is not building a competing no-code animation tool — irrelevant here). ScrollTrigger's pin+scrub on a GSAP timeline is the one-config-object answer to Apple-style pinned narratives, and it's the same mechanism you'll use to scrub a canvas image-sequence or three.js camera when the 3D dimension lands, which Motion and pure CSS cannot do. Add Motion 12 (MIT) only if the site is React-based and only for UI-level micro-interactions (buttons, menus, presence) — never let two systems fight over the same scroll scenes. Use native CSS scroll-driven animations purely as progressive enhancement behind @supports (Firefox stable is still flag-gated in Aug 2026, so they can't be the backbone), and skip Theatre.js entirely — its public repo is dormant. This pairing is realistically maintainable by one person plus an AI agent because GSAP's documentation footprint means the agent generates correct code on the first pass.

KEY FACTS:
  - GSAP is now 100% free including ALL formerly-paid Club plugins (ScrollTrigger, ScrollSmoother, SplitText, MorphSVG, DrawSVG...) — made free in April 2025 (GSAP 3.13) after Webflow acquired GreenSock on Oct 15, 2024. Current npm version: gsap 3.15.0. License field on npm: "Standard 'no charge' license: https://gsap.com/standard-license".
  - GSAP Standard License key terms (verified at gsap.com/community/standard-license): free for commercial use ('Can I really use GSAP in commercial projects without paying anything? Yes, really!'); non-exclusive worldwide grant; Webflow retains all IP; prohibition on using GSAP in competing no-code visual animation tools and on reverse-engineering to create competitive products; revocable for non-compliance. It is free-of-charge proprietary, not OSS.
  - Native CSS scroll-driven animations (animation-timeline: scroll()/view()): Chrome/Edge 115+, Safari 26+ (shipped Sept 2025, with a full WebKit guide), Firefox NOT yet on by default in stable as of Aug 2026 — behind a flag, with caniuse showing default support slated for Firefox 156; ~83.7% global support.
  - View Transitions API: same-document supported in Chrome 111+, Safari 18+, Firefox 144+ (all majors); cross-document only Chrome/Edge 126+ and Safari 18.2+ — Firefox cross-document still missing. Relevant for page-to-page polish, not for scroll narratives.
  - Motion (formerly Framer Motion, renamed when it went independent from Framer): npm package 'motion' v12.43.0, MIT. React-centric; scroll() helper uses native ScrollTimeline where available.
  - Lenis (darkroom.engineering): v1.3.25, MIT, ~1 line to enable inertia smooth scroll on native scroll position; the de-facto award-site standard pairing with ScrollTrigger.
  - Theatre.js: @theatre/core 0.7.2 (Apache-2.0; studio editor AGPL-3.0), 12.6k stars, public development suspended with a long-stale 'moved to a private repo, 1.0 soon' notice — effectively dormant.
  - Apple-style pinned scroll narrative = ScrollTrigger with pin: true + scrub: true driving a GSAP timeline (or scrubbing a canvas image-sequence / three.js camera) — this exact pattern is what ScrollTrigger was built for and is one config object, vs. hand-rolling pin spacers with any other option.

GOTCHAS:
  ! GSAP's license is free but proprietary and revocable — do not vendor it into any product that is itself an animation-building tool; for a marketing site this is a non-issue, but it's not MIT, so don't describe the stack as 'all open source'.
  ! Do NOT run ScrollSmoother and Lenis together — they both hijack scroll and will fight. Pick one. ScrollSmoother requires a #smooth-wrapper/#smooth-content DOM structure and breaks position:fixed elements inside the content (they must be moved outside the wrapper); Lenis preserves native scroll and position:fixed, which is why most award-site studios pair Lenis + ScrollTrigger instead.
  ! Lenis + ScrollTrigger must be explicitly synced or you get jitter: lenis.on('scroll', ScrollTrigger.update), drive lenis.raf() from gsap.ticker, and call gsap.ticker.lagSmoothing(0). This 5-line snippet is in the Lenis README — skipping it wastes a day of 'why is my pin stuttering'.
  ! ScrollTrigger pinning breaks inside ancestors that have a CSS transform (the pin uses position:fixed math). Keep pinned sections out of transformed/filtered wrapper divs, or use ScrollSmoother which handles this case natively.
  ! Native CSS scroll-driven animations cannot be your primary mechanism yet: Firefox stable still ships it behind the layout.css.scroll-driven-animations.enabled flag as of mid-2026 (caniuse lists default-on support arriving in Firefox 156; it's an Interop 2026 priority). Gate everything with @supports (animation-timeline: scroll()) and treat it as progressive enhancement only. Also, CSS timelines cannot scrub a <canvas>/WebGL scene or image-sequence — the moment your cinematic section involves 3D or frame sequences you need JS anyway.
  ! In React/Next.js, use the official @gsap/react useGSAP() hook for automatic cleanup — raw useEffect + ScrollTrigger leaks triggers on fast-refresh and route changes. Also call ScrollTrigger.refresh() after images/fonts load and give media explicit dimensions, or your trigger start/end positions will be computed against a wrong layout.
  ! SplitText re-splits text into spans — set aria-label on the parent (the 2025 SplitText rewrite handles accessibility and re-splitting on resize much better than the old version; make sure you're on GSAP >= 3.13).
  ! iOS Safari: virtual smooth-scrolling on touch is a minefield. Lenis's syncTouch option exists but darkroom.engineering themselves recommend leaving touch scrolling native on mobile — design your pinned scenes to degrade to native scroll on touch devices.
  ! Theatre.js looks perfect for 'cinematic' on paper, but its public repo has been frozen for years behind a stale '1.0 is around the corner, development moved private' notice; latest npm release is @theatre/core 0.7.2. Betting a solo commercial project on it in 2026 is how you inherit an unmaintained dependency.
  ! Motion's scroll() offloads to the browser's ScrollTimeline where available (great for simple scrubs), but for multi-element choreographed pinned scenes GSAP timelines + ScrollTrigger's pin/scrub/snap/pinSpacing machinery is dramatically less code — don't fight Motion into doing Apple-style pinning.

COST/LICENSING: All $0. GSAP 3.15.0 (including ScrollTrigger, ScrollSmoother, SplitText, MorphSVG, etc.) is 100% free for commercial use under the "Standard 'No Charge' GSAP License" — but note it is NOT open source: Webflow retains all IP, the license is revocable for non-compliance, and the one real restriction is you may not use GSAP to build a no-code visual animation tool that competes with Webflow (irrelevant for a product marketing site). Lenis 1.3.25 is MIT. Motion 12.43.0 is MIT (Motion+ is an optional one-time paid bundle of examples/premium components — not needed). Theatre.js is Apache-2.0 (core) / AGPL-3.0 (studio editor). No attribution required for any of them.
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] GSAP 3.15 (ScrollTrigger + SplitText, optionally ScrollSmoother)
  [USE     ] Lenis 1.3 (smooth scroll)
  [CONSIDER] Motion 12 (motion.dev, ex-Framer Motion)
  [CONSIDER] Native CSS scroll-driven animations + View Transitions API
  [AVOID   ] Theatre.js 0.7
  [CONSIDER] GSAP ScrollSmoother (instead of Lenis)

==========================================================================================
## Cursor / pointer-driven interaction techniques for an immersive, stealth-themed premium hardware site

RECOMMENDATION:
Use two thin layers and hand-roll the effects — every one of these is under ~80 lines with the right primitives. For DOM-level effects (custom cursor, magnetic CTAs, spotlight reveal): one global `pointermove` listener feeding `gsap.quickTo()` (GSAP 3.13+, now 100% free including all formerly-paid plugins) — quickTo is a pre-compiled lerp/spring tween that keeps 60fps under fast mouse movement; if the site is React-first with Motion (motion@12, ex-framer-motion, MIT), use `useMotionValue` + `useSpring` instead so you run one animation engine, not two. For 3D (camera-look-at-mouse, mouse parallax, hover displacement): React Three Fiber gives you `state.pointer` already normalized to -1..1 in `useFrame`; smooth it with maath's `easing.damp3`/`dampE` (framerate-independent exponential damping — the correct replacement for naive `lerp(a,b,0.1)`), and write cursor-reactive shaders as a `ShaderMaterial` with a `uMouse` uniform + `smoothstep` falloff (the Codrops pattern). Do NOT use framer-motion-3d (deprecated, no React 19) or 2018-era displacement-hover libraries. Gate the whole cursor layer behind `matchMedia('(hover: hover) and (pointer: fine)')` and design every reveal so scroll/focus triggers it too — touch and keyboard users must see the same content, just driven by scroll position instead of the pointer. The stealth theme is a gift here: the cheapest effect (CSS radial-gradient mask flashlight that reveals the device in a dark hero) is also the most on-brand — concrete effect ideas: (1) flashlight reveal of the device in a black hero ("invisible until you look"), (2) x-ray/thermal hover shader that shows board internals in a smoothstep circle around the cursor, (3) a ghost second cursor that trails yours on a loose spring — literalizing "your hand on a remote machine", (4) crosshair/target-ring cursor morph over CTAs with subtle magnetism, (5) the custom cursor itself cloaking (fading/dithering) over the "what the target sees: nothing" section, (6) click emits a radar-ping ripple ring, (7) ±4° camera look-at-mouse on the 3D product model with damped return-to-center.

KEY FACTS:
  - GSAP 3.13 (April/May 2025, post-Webflow-acquisition): entire ecosystem including all formerly Club-only plugins is 100% free for commercial use; license is proprietary free-to-use, not open source
  - motion (renamed from framer-motion in 2025) is at ~v12.43.0, MIT; upgrade is a package/import-path swap ('motion/react'); framer-motion-3d is deprecated and does not support React 19
  - Motion+ Cursor component (magnetic, state-aware custom cursor) is paid — one-time lifetime membership; price not verified here
  - Cuberto mouse-follower: MIT, requires GSAP, v1.1.2 last published June 2022 (stale)
  - R3F's useFrame state.pointer is pre-normalized to -1..1 (manual form: (e.clientX/innerWidth)*2-1); maath easing.damp3/dampE gives framerate-independent smoothing, unlike naive per-frame lerp
  - drei (MIT) ships useCursor, CameraShake, and MeshDistortMaterial — the relevant pointer-adjacent helpers
  - Capability gating is matchMedia('(hover: hover) and (pointer: fine)') with a change listener (hybrid devices like iPad+trackpad can switch input mid-session) — never user-agent sniffing
  - Reduced motion: gsap.matchMedia('(prefers-reduced-motion: no-preference)') or Motion's useReducedMotion / MotionConfig reducedMotion='user'; the correct response is swapping effects for static/opacity alternatives, not slowing them down
  - Performance rule: one global pointermove listener writing to refs/CSS variables; never React setState per mousemove; move cursor elements with transform:translate3d only, pointer-events:none

GOTCHAS:
  ! setState on mousemove is the classic React perf killer — a 120Hz mouse fires more events than React can reconcile; use motion values, quickTo, or refs read inside one rAF/useFrame loop
  ! cursor:none with no fallback: if JS fails or the custom cursor lags, users have NO cursor. Only hide the native cursor after the custom one is mounted and moving, and only inside (hover:hover) and (pointer:fine)
  ! Hover-revealed content is invisible to keyboard and touch users. Every flashlight/hover reveal needs a second trigger: :focus-visible for keyboard, scroll-into-view for touch. Magnetic buttons must keep normal :focus-visible styles — the magnet is decoration, not the affordance
  ! Naive lerp(current, target, 0.1) per frame is framerate-dependent — feels twice as fast on a 144Hz gaming monitor. Use maath damp functions (they take delta time) or GSAP/Motion springs which are time-based
  ! Cursor-following glow via CSS filter:blur() or big box-shadow repaints constantly and destroys perf on 4K screens — pre-render the glow as a static radial-gradient/PNG and move it with transforms
  ! The WebGL fluid/trail distortion effect (ping-pong FBO) is the single biggest scope-creep trap for a one-person build — timebox it, ship one, or substitute the smoothstep-radius shader which is 10% of the work and 80% of the wow
  ! Magnetic pull greater than ~1/3 of the pointer delta or a too-large activation radius makes buttons feel laggy and hurts click accuracy — keep it subtle and always spring back on pointerleave
  ! Camera look-at-mouse: clamp to a few degrees and damp it; also handle pointerleave of the window (damp back to center) or the model freezes staring off-screen
  ! iPad Pro with trackpad matches (pointer:fine) — that is correct behavior (it HAS a cursor), but it means you must listen for matchMedia change events rather than deciding once at load; on pure touch, drive the same visuals from scroll position instead (skip gyroscope — iOS permission prompts kill the magic)
  ! prefers-reduced-motion must kill: cursor springs/trails, parallax, camera-follow, and shader ripples — swap to instant positioning and static reveals; also add a visible motion toggle since many motion-sensitive users never set the OS flag; keep parallax amplitudes small everywhere to avoid motion sickness
  ! framer-motion-3d looks like the obvious bridge between Motion and R3F and it is a dead end (deprecated, React 18 only) — do springs inside useFrame with maath instead

COST/LICENSING: Essentially all free: GSAP core + all plugins are free for commercial use as of 3.13 (proprietary free-to-use license, not OSS — you cannot fork it or build competing tooling on it, which does not matter for a marketing site). motion, @react-three/fiber, @react-three/drei, maath, three.js are all MIT. The only paid item mentioned is the optional Motion+ Cursor component (one-time lifetime fee, price unverified) — skip it and hand-roll. Codrops tutorial code is free to learn from/adapt (check the individual demo's license file if copying wholesale). No attribution obligations for the MIT stack beyond keeping license text in node_modules.
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] Hand-rolled custom cursor + magnetic buttons with gsap.quickTo()
  [USE     ] Motion (motion@12) useMotionValue + useSpring pointer follow
  [CONSIDER] Motion+ Cursor component
  [AVOID   ] Cuberto mouse-follower
  [USE     ] R3F pointer + maath easing.damp3/dampE for camera-look-at-mouse and parallax
  [USE     ] Custom GLSL hover displacement / scan-reveal shaders (Codrops pattern)
  [USE     ] CSS-only flashlight/spotlight reveal (mask-image + custom properties)
  [AVOID   ] framer-motion-3d / legacy hover-effect libraries

==========================================================================================
## Performance and asset pipeline for a heavy 3D marketing site (GLB/texture optimization, env maps, rendering strategy, CWV targets, mobile fallback, measurement tooling)

RECOMMENDATION:
Build one asset pipeline script around @gltf-transform/cli 4.4.2 (MIT): `gltf-transform optimize hero.glb hero.opt.glb --compress meshopt --texture-compress ktx2`, with UASTC forced for normal maps and ETC1S for everything else, and serve the .glb with Brotli. Pick meshopt over Draco: your product is one small stealth box, geometry will be well under the ~1 MB point where Draco pays off, and meshopt's decoder is ~6 KB gzipped and decodes near-instantly versus ~100 KB and a visible CPU stall for Draco. Replace .hdr/.exr environment maps with a gainmap JPEG via @monogrid/gainmap-js (MIT, already wired into drei's <Environment files="env.jpg">) — hundreds of KB instead of 5-20 MB, self-hosted (never use drei's CDN presets in production). Run the R3F Canvas with frameloop="demand" and call invalidate() from your scroll/cursor handlers (mutate refs, never setState per frame), keep ONE canvas with drei <View> for multiple scenes, dynamic-import the entire 3D bundle (three+r3f+drei ≈ 250-350 KB gz in its own chunk) and mount below-fold scenes on IntersectionObserver. Critically, the LCP element must be real DOM (headline/poster image) painting under 1 s — a <canvas> is never an LCP candidate — with the 3D fading in behind it; on mobile clamp dpr to [1, 1.75], degrade via drei PerformanceMonitor, and serve a pre-rendered WebM/MP4 loop instead of WebGL when WebGL2 is missing, navigator.deviceMemory < 4, or prefers-reduced-motion is set. Budget: initial route JS < 150 KB gz, lazy 3D chunk < 350 KB gz, hero GLB < 3 MB (target 1.5), environment < 500 KB, total first-visit weight < 10 MB with < 3 MB before first interaction; LCP < 2.5 s, INP < 200 ms, CLS < 0.1 (reserve canvas space), first 3D frame < 4 s desktop / < 6 s mid-tier mobile.

KEY FACTS:
  - @gltf-transform/cli is at 4.4.2 (published days ago as of Aug 2026), MIT license verified in the repo LICENSE.md
  - meshopt decoder: 21 KB raw / ~6 KB gzipped, decodes ~1 GB/s with WASM SIMD; Draco decoder WASM+glue ≈ 100 KB gzipped — for geometry < ~1 MB the Draco decoder outweighs the savings
  - three.js supports meshopt (EXT_meshopt_compression) since r122 via GLTFLoader.setMeshoptDecoder; gainmap textures usable directly since r159
  - KTX2/Basis: ETC1S gives JPEG-class file sizes and stays compressed in VRAM (transcoded to BC/ASTC/ETC2) — roughly 4-8x less GPU memory than PNG/JPEG; UASTC for normal maps and hero surfaces
  - Core Web Vitals pass thresholds (2026, p75 of field data): LCP < 2.5 s, INP < 200 ms, CLS < 0.1; INP is the most-failed vital (~43% of sites miss 200 ms)
  - A <canvas> element is NOT an LCP candidate — the LCP element on a 3D hero page will be whatever text/image paints, so ship a DOM headline/poster that paints < 1 s
  - Concrete budget: initial route JS < 150 KB gz; lazy 3D chunk (three+r3f+drei+loaders) < 350 KB gz; hero GLB (meshopt+KTX2) < 3 MB (target 1.5 MB); gainmap environment < 500 KB; total first visit < 10 MB, < 3 MB fetched before first interaction; first rendered 3D frame < 4 s desktop broadband, < 6 s mid-tier mobile
  - Gainmap JPEG environments are the smallest HDR env format — hundreds of KB vs 5-20 MB EXR; @monogrid/gainmap-js is MIT and built into drei <Environment files="*.jpg">
  - drei PerformanceMonitor gives onIncline/onDecline callbacks off average fps — use it to step dpr between 1 and ~1.75 and drop effects on weak devices

GOTCHAS:
  ! Canvas-only hero = LCP disaster: Lighthouse will pick some late-painting text as LCP. Always render a real DOM headline + poster image immediately and fade the canvas in behind it; reserve the canvas's layout box (fixed aspect-ratio) or CLS fails too.
  ! setState inside useFrame or a scroll handler causes a React re-render every frame and destroys INP. Mutate object3D refs directly (GSAP ScrollTrigger / Lenis writing to refs, then invalidate()) — this is the #1 R3F performance mistake an AI agent will happily generate.
  ! meshopt without server compression is half-wasted: the codec pre-conditions data for Brotli/gzip. Many static hosts do NOT compress .glb/.ktx2 by default — check the content-encoding response header on your actual host before trusting file sizes.
  ! drei <Environment preset="..."> downloads HDRs from a third-party CDN at runtime. Fine for prototyping, a hidden multi-MB runtime dependency in production — always self-host env files (as gainmap JPEGs).
  ! ETC1S mangles normal maps (blocky banding on smooth metal — fatal for a premium hardware close-up). Force UASTC for normals/metal-rough on the hero: gltf-transform lets you target texture slots per-mode.
  ! Shader compilation jank: the first frame after mounting a PBR scene can stall 100-500 ms compiling shaders. Warm up with renderer.compileAsync / drei <Preload all /> while your loader overlay is still visible, not after revealing the scene.
  ! Multiple <Canvas> components = multiple WebGL contexts (browsers cap them and each costs real memory). Use one canvas + drei <View> to place several 'scenes' across the page.
  ! frameloop="demand" silently breaks custom cursor-parallax: your pointermove handler mutates the camera outside React, so nothing re-renders until you call invalidate() in the handler. Drei's controls do this for you; hand-rolled code must too.
  ! On Windows, gltf-transform's KTX2 commands (etc1s/uastc) shell out to toktx from KTX-Software — install the KTX-Software release (MSI) and put it on PATH first, or texture compression fails with a confusing error.
  ! iOS Safari memory-kills tabs with big uncompressed textures. Cap textures at 2048px (1024 for env), use KTX2 so they stay compressed in VRAM, and clamp dpr — devicePixelRatio 3 on iPhone means 9x the fragments of dpr 1.
  ! Draco is the default suggestion in most tutorials; for a sub-1 MB product mesh it adds ~100 KB of decoder and a decode stall for near-zero size benefit. Don't let the agent cargo-cult it in.
  ! Test the video fallback path early: capability gates (WebGL2 check, deviceMemory, prefers-reduced-motion) touch layout and asset loading; retrofitting them after the 3D hero is 'done' is a rewrite.

COST/LICENSING: All free and open source: glTF-Transform MIT (verified in repo — no commercial tier despite optional sponsorship), meshoptimizer/gltfpack MIT, Draco Apache-2.0, Basis Universal Apache-2.0, KTX-Software Apache-2.0, @monogrid/gainmap-js MIT, three.js/R3F/drei MIT, r3f-perf MIT, Spector.js MIT, Lighthouse/LHCI Apache-2.0. HDRIs from Poly Haven are CC0. Zero licensing cost; no attribution obligations (attribution for Poly Haven appreciated but not required).
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] glTF-Transform CLI (@gltf-transform/cli 4.4.2)
  [USE     ] meshopt compression (EXT_meshopt_compression)
  [AVOID   ] Draco (KHR_draco_mesh_compression)
  [USE     ] KTX2 / Basis Universal textures (ETC1S + UASTC)
  [USE     ] Gainmap environment maps (@monogrid/gainmap-js, MIT)
  [USE     ] frameloop="demand" + invalidate() (R3F on-demand rendering)
  [CONSIDER] Instancing (drei <Instances>) and LOD (drei <Detailed>)
  [CONSIDER] gltfpack (meshoptimizer's CLI)
  [USE     ] r3f-perf (dev overlay) + Spector.js (extension) + Chrome DevTools
  [CONSIDER] Lighthouse CI (@lhci/cli)
  [USE     ] Mobile video fallback (pre-rendered WebM/MP4 loop + poster)

==========================================================================================
## Local development tooling on Windows 11: framework choice (Vite+React vs Next.js App Router vs Astro), supporting toolchain, and MCP/AI-agent tooling for a 3D-heavy cinematic marketing site

RECOMMENDATION:
Build with Next.js 16.2 (App Router) treated as a static-first site generator: every page statically generated, all 3D/motion code in "use client" components, and you get the Metadata API, sitemap/robots conventions, next/og image generation, and one-command hosting (Vercel or static export) exactly when the SEO phase arrives — and Next is the framework AI coding agents are most fluent in, which matters more for a solo build than raw HMR speed. Pair it with TypeScript 6.0 (strict), Tailwind CSS v4.3 (CSS-first config, no tailwind.config.js), shadcn/ui only for the handful of real UI controls (nav, buy CTA, FAQ accordion, spec table), Biome for lint+format in one fast tool the agent runs after every edit, and pnpm 10 as the package manager on Windows. The motion layer (@react-three/fiber 9.7 + drei + GSAP ScrollTrigger — all free now) plugs into well-worn Next+R3F patterns the agent has seen thousands of times. For agent tooling, install exactly two MCP servers: Microsoft's @playwright/mcp for the screenshot→tweak→screenshot loop, and Google's chrome-devtools-mcp for performance traces and console/network debugging (a 60fps scroll budget is your real constraint); skip Figma MCP unless you genuinely design in Figma first, and treat Blender MCP as a narrow asset-pipeline helper, not a modeling copilot. Vite+React is the defensible runner-up if RSC friction proves intolerable, but you would hand-roll prerendering, metadata, and OG images that Next gives you for free.

KEY FACTS:
  - Next.js 16.2.x is current stable (mid-2026): Turbopack default for dev+build, React 19.2, caching now opt-in (Cache Components); Pages Router in maintenance mode
  - Vite is at 8.2 (Rolldown/Oxc replace Rollup/esbuild); Vite 7+ requires Node 20.19+/22.12+
  - Astro 7.1.6 (July 2026): Vite 8, Rust compiler, requires Node 22+
  - TypeScript 6.0 GA March 2026 (last JS-based compiler); TypeScript 7 native Go port at RC June 2026, ~10x faster — wait for stable
  - @react-three/fiber 9.7.0 pairs with React 19.0-19.2; R3F v10 + drei 11 exist only as alphas
  - Tailwind CSS v4 current at ~4.3.3; CSS-first @theme config, no tailwind.config.js; first-party @tailwindcss/vite plugin; 5x faster full builds
  - shadcn/ui fully supports Tailwind v4 + React 19; new projects get OKLCH colors, data-slot attributes, no forwardRef
  - pnpm 10.x: ~70% less disk via global store; Bun installs 3-5x faster but ~95% Node compat and no node-gyp native addons
  - Biome is ~25x faster than Prettier at formatting, ~20x faster than ESLint at linting, single binary, one config; biome migrate converts existing configs
  - GSAP core + ALL formerly-paid Club plugins (ScrollTrigger, ScrollSmoother, SplitText, MorphSVG, DrawSVG) 100% free for commercial use since April 30, 2025 (Webflow acquisition)
  - @playwright/mcp (Microsoft) exposes ~34 browser tools; chrome-devtools-mcp (Google) adds performance_start_trace / performance_analyze_insight with LCP/TBT extraction
  - Figma Dev Mode MCP requires a paid Dev or Full seat; free during beta with usage-based pricing announced

GOTCHAS:
  ! Next + R3F: the <Canvas> must never render on the server. In Next 15+/16, next/dynamic with ssr:false is only allowed inside a client component — a 'use client' wrapper file that dynamically imports the scene is the standard pattern; agents frequently put it in a server component and hit a build error or hydration mismatch.
  ! React StrictMode double-invokes effects in dev: raw gsap.to()/ScrollTrigger.create() in useEffect duplicates triggers and leaks tweens. Mandate @gsap/react's useGSAP hook (auto-cleanup) in your CLAUDE.md or the agent will write leaky animation code all day.
  ! Version-pairing trap: R3F v9 requires React 19. If the agent installs an older drei or copies a React-18-era tutorial, you get silent peer-dep chaos. Pin @react-three/fiber@^9 and a matching @react-three/drei in package.json before the agent starts.
  ! Tailwind v4 hallucination: agents trained on v3 will invent tailwind.config.js, content arrays, and postcss plugin chains. State explicitly in project instructions: config is CSS-first via @theme in globals.css, packages are tailwindcss + @tailwindcss/postcss (Next) or @tailwindcss/vite (Vite).
  ! If you choose Next static export (output:'export') for cheap hosting, next/image optimization is disabled — pre-generate AVIF/WebP renders with sharp or use a custom loader, or LCP suffers on your hero imagery.
  ! Windows dev-speed killer: Microsoft Defender real-time scanning of node_modules slows installs and HMR dramatically. Adding a Defender exclusion for the project folder is a system security setting — do it yourself manually, don't have the agent touch it. Also set git core.autocrlf=input to stop CRLF churn.
  ! MCP sprawl eats the agent's context window: every connected server's tool schemas cost tokens on each turn. Two browser-ish servers max; if forced to one, chrome-devtools-mcp covers screenshots AND perf traces.
  ! Screenshot-driven iteration lies about motion: a static capture can't show scrub jank or a mistimed ScrollTrigger. Prompt the agent to scroll in increments and capture at each position, and to run a DevTools performance trace when anything 'feels off'.
  ! Don't let the agent 'upgrade everything': jumping to the TypeScript 7 RC, R3F v10 alpha, or drei 11 alpha mid-project trades a working stack for triage. Freeze majors until launch.

COST/LICENSING: Entire recommended stack is free for commercial use. MIT: Next.js, Vite, Astro, React, Tailwind CSS v4, shadcn/ui (code is copied into your repo, no attribution required), three.js, @react-three/fiber, drei, pnpm, Biome (MIT/Apache dual). Apache-2.0: TypeScript, @playwright/mcp, chrome-devtools-mcp. GSAP (core + all former Club plugins) is free for commercial use since April 30, 2025 under its no-charge Standard License — note it is source-available, not OSS (you can't redistribute it inside a competing animation tool; irrelevant for a website). Exceptions: Figma Dev Mode MCP needs a paid Figma Dev/Full seat (~$15+/editor/mo) and will move from free-beta to usage-based pricing; Blender is GPL but that covers only the tool, never your exported assets.
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] Next.js 16 (App Router)
  [CONSIDER] Vite 8 + React 19 (SPA)
  [AVOID   ] Astro 7
  [USE     ] TypeScript 6.0 (strict)
  [USE     ] Tailwind CSS v4 (v4.3.x)
  [USE     ] shadcn/ui
  [USE     ] Biome (lint + format)
  [CONSIDER] ESLint 9 + Prettier
  [USE     ] pnpm 10
  [AVOID   ] Bun (as package manager/runtime)
  [USE     ] Playwright MCP (@playwright/mcp)
  [USE     ] Chrome DevTools MCP (chrome-devtools-mcp)
  [CONSIDER] Figma Dev Mode MCP
  [CONSIDER] Blender MCP
  [AVOID   ] AI 3D-generation MCPs (Hyper3D Rodin, text-to-3D)

==========================================================================================
## Design language and narrative structure for a premium, cinematic single-product hardware website (stealth KVM box, $549)

RECOMMENDATION:
Build a dark tech-noir single page: near-black stage (#050507 base, never pure #000) with film grain, ONE accent color (a phosphor green ~#4AF626 or signal amber — pick one, use it on under 5% of pixels: CTA, live-status dots, one keyword per section), and the device as the only lit object. Type: Space Grotesk 500/700 for display (72–140px hero), Inter for body (16–18px, ~65ch max), JetBrains Mono 11–12px uppercase +0.08em tracking for eyebrows/spec labels — all free OFL, self-hosted woff2. Storyboard (≈9 beats, ~8–10 viewport-heights total): (1) HERO — device floating in void, slow idle rotation + cursor parallax (±4px, lerp 0.08), one line like "Full control of your machine. From anywhere. Invisible.", mono sub-eyebrow "FOR HARDWARE YOU OWN", quiet CTA; (2) PROBLEM — kinetic text over black: remote software dies when the OS dies, gets seen, gets blocked — short scrubbed text reveals, no imagery; (3) THE REVEAL (the signature moment, spend 40% of your effort here) — a pinned 200–300vh canvas image-sequence: what the target computer "sees" (a plain monitor + keyboard icon set) push-in, then an exploded/x-ray pass of the real internals, payoff line "To your computer, it's just a monitor and a keyboard."; (4) HOW IT WORKS — 3 sticky steps (plug in → it disguises itself → control from your browser); (5) FEATURES — bento grid, hover-lit cells (1080p50 video, BIOS-level control, zero software on the target, RAM-only logs, identity cloaking); (6) ONE deep-dive pinned vignette for the strongest spec (latency or stealth), not five; (7) TRUST — plain 1Password/Tailscale-style section, white-ish text, no effects: what it's for, what it never does; (8) COMPARISON — factual table vs TinyPilot/PiKVM/remote-desktop software (price, subscription, detectable, works pre-boot); (9) PRICE + CLOSE — single centered card, "$549. Once.", device fading back into darkness, final CTA. Use expo-out entrances (0.6–1.0s), raw scrub with ~0.8s smoothing for pinned scenes, and design the static reduced-motion/mobile fallback per beat from day one. What makes it feel expensive is restraint: one signature moment, huge type-scale contrast, generous black space, and a single consistent easing system — not more effects.

KEY FACTS:
  - Igloo Inc (abeto.co) won Awwwards Site of the Year 2024 — the current benchmark for cinematic scroll-driven WebGL, but it was built by a whole studio; treat it as a ceiling, not a target.
  - Apple's AirPods Pro-style pages are technically: a <canvas> image-sequence scrubbed by scroll position + sticky text blocks that fade in/out — a pattern one developer CAN reproduce (CSS-Tricks has a full walkthrough).
  - Teenage Engineering's site uses Univers with a near-monochrome palette (#ffffff/#d8d8d8/#a8a8a8) and extreme reduction — few elements per viewport; its 'expensive' feel is restraint, not effects.
  - Nothing's brand uses custom Colophon Foundry typefaces (NDot, NType 82) paired with LL Lettera Mono; Rabbit r1 uses Power Grotesk + Archivo — the common premium-hardware pattern is [characterful display grotesk] + [neutral body] + [mono for technical labels].
  - Recommended free stack: Space Grotesk (display, OFL, Google Fonts, 5 weights) + Inter (body, OFL) + JetBrains Mono or IBM Plex Mono (spec labels, OFL). Alternative: Clash Display + General Sans from Fontshare (free commercial, ITF FFL). Optional serif accent: Instrument Serif (OFL, display-only, use 64px+).
  - Motion conventions that read as premium: entrances 0.6–1.0s with expo-out easing cubic-bezier(0.16,1,0.3,1); scroll-scrubbed scenes use NO easing curve but ~0.5–1s scrub smoothing; staggers 40–80ms; pinned scenes 150–300vh each; cursor parallax ±2–6px with lerp factor 0.06–0.1 — never 1:1 mouse tracking.
  - Typographic scale contrast is the core luxury signal: 11–12px uppercase letter-spaced mono eyebrows/labels against 72–140px display headlines, with very little in between.
  - Daylight Computer (daylightcomputer.com) is the best solo-scale reference: long-scroll single page, dark sections, restrained motion, preorder-deposit CTA — repeatedly awarded (One Page Love, ecom design awards) without heavy WebGL.

GOTCHAS:
  ! Never use pure #000000 as the page background — it causes gradient banding and makes cheap 3D obvious. Use #050507–#0B0B0E with a 2-3% film-grain overlay (tiny tiled noise PNG or shader); grain is the single cheapest 'expensive' trick and also hides gradient banding.
  ! The reveal moment lives or dies on asset quality. One beautifully lit render/photo sequence of the real device (studio HDRI, rim light, shallow DOF) beats five mediocre WebGL scenes. If the 3D model looks like a gray blob, the whole 'premium' framing collapses — budget more time for the asset than for the scroll code.
  ! Scroll-jacking fatigue: cap total pinned scroll distance. Apple pins 2-4 scenes per page, not ten. If the page needs more than ~10 viewport-heights of scrubbing, users bail. Every pinned scene needs a reason; static sections between pins are the rest beats that make the pins land.
  ! FOUT kills the cinematic open. Self-host and preload the hero display font (woff2, font-display: block for the hero only, swap elsewhere) or the first frame flashes system-ui and the spell breaks.
  ! Tone risk specific to THIS product: 'stealth box that controls a computer undetected' reads as spyware to a cold visitor (and to payment processors). The trust section is not optional — put 'for hardware you own' language in the hero subline AND a dedicated section, borrowing 1Password/Tailscale plain-clarity tone. This is a conversion issue, not just ethics.
  ! Design the prefers-reduced-motion and mobile fallback per scene from day one (static keyframe image + fade). Retrofitting it after building scrub animations roughly doubles the work.
  ! One accent color only. Two accents plus gradients is the fastest way to look like a template. Also avoid the purple-blue 'AI startup' gradient cliché — it instantly cheapens dark sites in 2025-26.
  ! Comparison section: stick to factual, verifiable spec rows (price, subscription, needs software on target, works at BIOS level). Editorialized competitor claims are a legal and credibility trap.
  ! Do not imitate Nothing's dot-matrix identity or Apple's exact layouts — pastiche of a famous design system reads as knockoff, the opposite of premium. Steal structure and restraint, not identity.

COST/LICENSING: All recommended fonts are free for commercial use: Space Grotesk, Inter, JetBrains Mono/IBM Plex Mono, and Instrument Serif are SIL OFL (Google Fonts self-hostable); Clash Display / General Sans / Clash Grotesk from Fontshare are free for personal AND commercial use under ITF's Free Font License (no attribution required) or OFL. Optional paid upgrade: PP Neue Montreal (Pangram Pangram) — free for personal trial only, commercial licenses start at $40. Reference sites (Apple, Teenage Engineering, Nothing, Rabbit, Igloo Inc) are inspiration only — do not reuse their imagery, custom typefaces (NDot/NType are Nothing's proprietary brand fonts), or copy. No other costs for the design layer.
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] Dark tech-noir cinematic (RECOMMENDED direction)
  [USE     ] Apple-style canvas scrollytelling technique
  [AVOID   ] Full real-time WebGL everything (Igloo Inc tier)
  [CONSIDER] Teenage Engineering Swiss-utilitarian white
  [AVOID   ] Nothing-style dot-matrix retro-tech identity
  [USE     ] Type stack A: Space Grotesk + Inter + JetBrains Mono (all free/OFL)
  [CONSIDER] Type stack B: Clash Display + General Sans (Fontshare) + IBM Plex Mono, optional Instrument Serif italic accents
  [CONSIDER] Paid upgrade: PP Neue Montreal (Pangram Pangram)

==========================================================================================
## 3D/visual asset sourcing, AI 3D generation, and no-model alternatives for a premium hardware marketing site

RECOMMENDATION:
Do not source or AI-generate the hero product at all — a small matte-black electronic box is the one object a non-modeler can own procedurally. Track 1 (live 3D): three.js RoundedBoxGeometry (examples/jsm addons) + MeshPhysicalMaterial (matte black, roughness ~0.7, subtle clearcoat), lit by a Poly Haven 1K studio HDRI (CC0, no attribution), with an emissive LED dot and normal-map port decals; your AI agent writes and iterates all of it in code. Track 2 (cinematic sections): have the agent write a Blender bpy script (Blender is free, renders headless on Windows via `blender -b -P script.py`) that builds the same box with bevel modifiers and real port cutouts, then render a ~120-frame Cycles turntable and scroll-scrub it as a WebP sequence on canvas — the Apple AirPods technique, within a ~10-15MB budget. Fill the rest of the 'premium' feel with ShaderGradient-style animated gradients, a GPU particle field, and one or two abstract accent meshes — no marketplace models needed; if you want AI props anyway, pay Meshy Pro $20 for one month so outputs are owned, and skip Hunyuan3D (license void in EU/UK/KR). Hard rule on licensing: only CC0 (Poly Haven, ambientCG) ships to the browser as raw files; anything CC-BY or Fab-licensed only appears baked into rendered frames, with a /licenses page for any CC-BY you do use. On honesty: renders are fine and industry-standard for a hardware hero as long as they match the shipping device exactly — caption them 'product rendering', never depict ports/features it lacks, and put a few real photos near the specs and buy button, because at $549 an all-render site pattern-matches to vaporware.

KEY FACTS:
  - Poly Haven: ALL assets (HDRIs, textures, models) are CC0 — commercial use, no attribution, verified at polyhaven.com/license; HDRIs downloadable at 1K-8K+ (use 1K-2K for web lighting).
  - Sketchfab still serves free CC-licensed downloads in 2026 (glTF/USDZ via site and Download API); default license is CC-BY (credit author + link, everywhere the asset appears); store closed and migration to Epic's Fab ongoing — CC-BY-SA/Editorial models were excluded from migration.
  - Khronos glTF-Sample-Assets: per-model licensing (mix of CC0, CC-BY, others) documented in Models.md — great for testing a viewer pipeline, mostly not for production art.
  - Quaternius: CC0, but stylized low-poly game art — wrong aesthetic for a premium hardware brand.
  - Meshy: Free = 100 credits/mo, ~10 downloads/mo, outputs licensed CC BY 4.0 (credit Meshy on commercial pages); Pro $20/mo, Premium $40/mo, Ultra $100/mo — all paid tiers grant full ownership/commercial rights.
  - Microsoft TRELLIS.2: MIT license for code AND weights, 4B-param image-to-3D, outputs GLB with PBR (base color/roughness/metallic/opacity); requires 24GB-VRAM NVIDIA GPU, Linux, CUDA 12.4 — hosted use is the practical route. Note: dependencies nvdiffrast/nvdiffrec carry separate NVIDIA license terms (check before commercial self-hosting; generated assets themselves are not encumbered by MIT).
  - Hunyuan3D 2.1: Tencent Community License — 'DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA'; outputs/use excluded outside the defined Territory.
  - Tripo AI: free tier is personal/non-commercial; Pro $19.90/mo (~$11.94 annual) adds commercial rights.
  - Spline: free tier watermarks web exports; Starter $12/mo (annual) removes watermark; runtime is heavier than hand-rolled three.js.
  - Transparent video support: Safari = HEVC+alpha (MP4/MOV) only; Chrome/Firefox = VP9 alpha in WebM only; no single standard file works everywhere without the WebGL luma-matte workaround.
  - three.js ships RoundedBoxGeometry in examples/jsm (addons) — a filleted-edge box in ~5 lines; MeshPhysicalMaterial gives matte-black + clearcoat sheen; drei's Environment/ContactShadows (R3F) or equivalent handle studio lighting.
  - Blender renders headlessly on Windows: `blender -b -P script.py` — an AI coding agent can write the whole bpy scene (box, bevel modifier, port cutouts, HDRI, camera orbit) and emit a 120-frame turntable PNG/WebP sequence with zero manual modeling.

GOTCHAS:
  ! Your product IS a rounded box — the one shape you never need a modeler or a marketplace for. Weeks spent evaluating AI 3D tools or hunting Sketchfab for 'generic black device' is wasted; RoundedBoxGeometry + MeshPhysicalMaterial (roughness ~0.6-0.8, tiny clearcoat) + a 1K studio HDRI looks like a $10k render out of the box.
  ! Anything you ship to the browser is redistributed: a GLB/HDRI on a website is a raw downloadable file. CC-BY is workable (credit page), but Fab Standard License, TurboSquid-style licenses, and Meshy-free CC-BY-with-credit get legally murky for browser-shipped assets. Rule: only CC0 goes in the bundle; licensed assets are OK baked into pre-rendered images/video where the asset can't be extracted.
  ! Sketchfab 'Downloadable' is not a license — check the per-model badge. CC-BY-NC kills a commercial site outright; CC-BY-ND forbids the edits you'll inevitably make. Also Sketchfab is mid-migration to Epic's Fab (store already closed, downloads still live in 2026 but not guaranteed forever) — download and archive anything you use locally NOW; don't hotlink or plan to re-fetch.
  ! AI image-to-3D is at its absolute worst on crisp hard-surface products: blobby edges, melted ports, baked-in fake lighting, triangle-soup topology, one giant texture. It's fine for background props, terrible for the hero shot of a precision device someone pays $549 for. Same for AI image generators: they'll hallucinate wrong port counts between shots — a geometric model stays consistent.
  ! Running TRELLIS.2 locally means 24GB VRAM, NVIDIA, Linux-only, CUDA 12.4 — do not fight this on a Windows dev laptop; use the Hugging Face Space or a hosted endpoint (fal.ai/Replicate) for the handful of generations you'd ever need. And Hunyuan3D's license is territorially void in EU/UK/South Korea — with MIT-licensed TRELLIS.2 available there is no reason to touch it.
  ! Transparent video is a two-codec mess: Safari only plays HEVC+alpha, Chrome/Firefox only VP9-alpha WebM — and encoding HEVC-with-alpha essentially requires Apple's toolchain, which is painful on a Windows-only machine. Either use Jake Archibald's single-file WebGL trick (alpha encoded as a grayscale strip, recombined in a shader) or just skip alpha video in favor of image sequences.
  ! Image-sequence scroll scrubbing (the Apple AirPods technique) is the highest premium-per-effort trick but a payload bomb if careless: 150 frames of sloppy JPEG is 30-50MB. Budget it: ~100-160 frames, ≤1600px wide, WebP q~70, lazy/progressive preload, draw to <canvas>. Don't scrub a <video> element's currentTime — frame-seek is janky, especially on mobile; everyone who ships this uses canvas + frames.
  ! Don't ship an 8K .hdr for lighting — Poly Haven offers 1K/2K downloads; 1K is plenty when the HDRI is only an environment/light source and not the visible background (blur it or use a gradient backdrop).
  ! Render-vs-photo ethics: the FTC deception standard is about material misleading, not medium. A render is fine if it accurately shows what ships (size, ports, finish) — caption hero art 'product rendering' as cheap insurance, never render features the device lacks, and at $549 include a few honest real photos (even phone photos on a clean background) near specs/checkout; a site that is 100% renders reads as vaporware to hardware buyers.

COST/LICENSING: Core path is $0: Poly Haven and ambientCG are CC0 (no attribution, commercial OK, cannot re-license/claim authorship), Blender is free (GPL — outputs are yours), three.js is MIT, ShaderGradient is open source on GitHub. Optional spends: Meshy Pro $20/mo (one month is enough; paid plans = you own outputs, free tier outputs are CC BY 4.0 requiring Meshy credit), Tripo Pro ~$19.90/mo (~$11.94/mo annual) for commercial rights (free tier is non-commercial), Spline Starter $12/mo annual to remove the web-export watermark. Sketchfab CC-BY models are free but attribution (author + link) must follow the asset everywhere — keep a /licenses page. Fab free Megascans use the Fab Standard License (commercial use OK, but NOT CC0 and no raw-asset redistribution — risky for GLBs shipped to the browser). TRELLIS.2 code+weights are MIT; Hunyuan3D 2.1 is under the Tencent Community License which is explicitly void in the EU, UK, and South Korea.
CONFIDENCE: high

OPTIONS (verdicts):
  [USE     ] Poly Haven (HDRIs, textures, some models)
  [USE     ] ambientCG
  [USE     ] Procedural hero product in code (three.js RoundedBoxGeometry + MeshPhysicalMaterial + CC0 HDRI)
  [USE     ] AI-agent-scripted Blender render → scroll-scrubbed image sequence
  [USE     ] Shader gradients / particle fields / ray-marched fog / abstract geometry (ShaderGradient, custom GLSL)
  [CONSIDER] Sketchfab CC0/CC-BY downloads
  [CONSIDER] Fab free assets / Quixel Megascans
  [CONSIDER] Meshy AI (image/text-to-3D SaaS)
  [CONSIDER] Microsoft TRELLIS.2 (hosted)
  [CONSIDER] Spline (no-code 3D editor)
  [AVOID   ] Video-with-alpha (HEVC+alpha / VP9 WebM)
  [AVOID   ] Hunyuan3D 2.x (Tencent)
  [AVOID   ] Quaternius / Kenney packs (CC0)
  [AVOID   ] Luma Genie (text-to-3D)

