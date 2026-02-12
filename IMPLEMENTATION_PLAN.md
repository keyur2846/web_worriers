# Premium 2.5D Multi-Layer Parallax Landing Page

## Context

The current landing page uses Three.js 3D models (soldier.glb, tejas.glb, carrier.glb) rendered via `@react-three/fiber` across a 10-scene scroll narrative. The models don't look polished enough. Deadline is **today, 6 PM**.

**Solution:** Replace 3D models with **PNG cutout images** layered in a **5-10 layer parallax depth system** per section, with **CSS 3D perspective transforms** driven by **GSAP ScrollTrigger scrub**. Same 10-scene narrative, same content, but images + atmospheric CSS effects instead of WebGL.

**Research sources:**
- [Firewatch Parallax](https://sam.beckham.io/wrote/css-parallax-effect/) — 6-9 layers, `translateZ` + scale compensation, `perspective: 1000px`
- [Codrops Layered Zoom (2025)](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/) — 7 layers, progressive scale, CSS variable animation for perf, pin+scrub
- [Builder.io Parallax 2026](https://www.builder.io/blog/parallax-scrolling-effect) — 3+ transparent PNG layers, `will-change: transform`, compositor-thread GPU acceleration
- [GSAP ScrollTrigger Docs](https://gsap.com/scroll/) — `scrub: true`, `useGSAP` hook, `gsap.context()` cleanup, `matchMedia()` responsive
- [Awwwards Parallax Collection](https://www.awwwards.com/websites/parallax/) — Premium multi-layer depth examples

**Why this is better than Three.js:**
- ~800KB smaller bundle (removing three + fiber + drei + postprocessing)
- Instant loading (no GLTF parsing, no Draco WASM, no WebGL context)
- CSS transforms are GPU-accelerated compositor-thread only — buttery 60fps
- Images look photorealistic vs low-poly models
- Existing CSS design system perfectly suited

---

## Architecture

**Current:** Fixed fullscreen `<Canvas>` + 2000vh invisible scroll spacer → 10 Three.js scenes
**New:** 10 real `100vh` sections, each with 5-10 layered elements + GSAP ScrollTrigger + CSS 3D perspective

```
LandingPage
  ├── <main id="parallax-container">
  │   ├── HeroSection           (Scene 0 — 7 layers, SVG Chakra + stars + god rays)
  │   ├── FlagSection           (Scene 1 — 8 layers, flag zoom + fabric + clouds)
  │   ├── SoldierSection        (Scene 2 — 8 layers, soldier reveal + desert depth)
  │   ├── CombinedArmsSection   (Scene 3 — 9 layers, tank entry + heat haze + dust)
  │   ├── ScopeSection          (Scene 4 — 6 layers, scope FPV + crosshair + breathing)
  │   ├── EyeTransitionSection  (Scene 5 — 7 layers, CSS eye morph + iris color shift)
  │   ├── AirForceSection       (Scene 6 — 9 layers, Tejas flight + 3-cloud-depth + vapor)
  │   ├── CarrierLandingSection (Scene 7 — 8 layers, approach + touchdown + shake)
  │   ├── VikrantSection        (Scene 8 — 8 layers, aerial zoom-out + wake + escorts)
  │   └── MissionSelectSection  (Scene 9 — 5 layers, cards + particles + terrain)
  ├── HUDOverlay               (fixed: corners, tricolor progress bar, stamp)
  └── ThemeSwitcher            (fixed: top-right)
```

### How Parallax Depth Works

Each section: `100vh`, `overflow: hidden`, `perspective: 1200px`, `transform-style: preserve-3d`.

**Layer speed convention:**
| Speed | Role | Perceived Depth |
|-------|------|----------------|
| -0.5 | Deep background | Very far |
| -0.4 | Atmospheric BG (haze, stars) | Far |
| -0.3 | Far environment (terrain, clouds) | Mid-far |
| -0.2 | Mid environment | Mid |
| -0.1 | Ground/terrain plane | Mid-close |
| 0 | Main subject (soldier, jet) | Focal plane |
| +0.05 | Secondary subject | Slightly forward |
| +0.1 | Foreground (sand, debris) | Close |
| +0.15 | Atmospheric overlay (dust, smoke) | Very close |
| 0 (fixed) | HUD/content (text, panels) | Screen plane |

Speed × 200px = total Y travel distance per viewport height.

---

## Scene Layer Stacks (5-10 Layers Each)

### Scene 0: HERO — 7 Layers
| # | Layer | Speed | Source |
|---|-------|-------|--------|
| 1 | Deep BG gradient | -0.5 | CSS radial-gradient |
| 2 | Star field | -0.4 | CSS dots + twinkle keyframe |
| 3 | Atmospheric haze | -0.3 | CSS warm gold glow |
| 4 | Ashoka Chakra (SVG) | 0 | SVG component |
| 5 | Title text | +0.05 | DOM |
| 6 | God ray overlay | -0.05 | CSS conic-gradient |
| 7 | Vignette + grade | 0 | CSS |

**Images needed:** NONE (fully CSS/SVG)

### Scene 1: FLAG — 8 Layers
Images: `flag-waving.png`, `clouds-distant.png`, `fabric-texture.png`

### Scene 2: SOLDIER REVEAL — 8 Layers
Images: `soldier.png`, `desert-terrain.png`, `desert-rocks.png`, `sand-foreground.png`

### Scene 3: COMBINED ARMS — 9 Layers
Images: `tank-arjun.png`, `dust-cloud.png` (+ reuses soldier, desert-terrain)

### Scene 4: SCOPE VIEW — 6 Layers
Images: `scope-view-bg.png`

### Scene 5: EYE TRANSITION — 7 Layers
Images: NONE (fully CSS/SVG)

### Scene 6: AIR FORCE — 9 Layers
Images: `tejas.png`, `clouds-high.png`, `clouds-mid.png`, `clouds-foreground.png`

### Scene 7: CARRIER LANDING — 8 Layers
Images: `carrier-deck.png`, `ocean-surface.png` (+ reuses tejas)

### Scene 8: VIKRANT REVEAL — 8 Layers
Images: `vikrant-aerial.png`, `escort-ships.png` (+ reuses ocean-surface)

### Scene 9: MISSION SELECT — 5 Layers
Images: `terrain-silhouette.png` (optional)

---

## Image Asset Summary

**Total: 19 images (7 HIGH, 7 MEDIUM, 5 LOW priority)**

See `IMAGE_GENERATION_GUIDE.md` for detailed prompts and specs.

---

## Files to Create

### Parallax Infrastructure
- `src/hooks/use-parallax.ts`
- `src/hooks/use-parallax-layer.ts`
- `src/components/parallax/parallax-section.tsx`
- `src/components/parallax/parallax-layer.tsx`
- `src/components/parallax/parallax-image.tsx`

### 10 Section Components
- `src/components/sections/hero-section.tsx` — 7 layers
- `src/components/sections/flag-section.tsx` — 8 layers
- `src/components/sections/soldier-section.tsx` — 8 layers
- `src/components/sections/combined-arms-section.tsx` — 9 layers
- `src/components/sections/scope-section.tsx` — 6 layers
- `src/components/sections/eye-transition-section.tsx` — 7 layers
- `src/components/sections/airforce-section.tsx` — 9 layers
- `src/components/sections/carrier-landing-section.tsx` — 8 layers
- `src/components/sections/vikrant-section.tsx` — 8 layers
- `src/components/sections/mission-select-section.tsx` — 5 layers

### Extracted UI Components
- `src/components/ui/ashoka-chakra.tsx`
- `src/components/ui/info-panel.tsx`
- `src/components/ui/info-row.tsx`
- `src/components/ui/section-label.tsx`
- `src/components/ui/mission-card.tsx`
- `src/components/ui/equipment-label-dom.tsx`

### HUD
- `src/components/hud/hud-overlay.tsx`
- `src/components/hud/cinematic-effects.tsx`

## Files to Modify
- `src/pages/landing.tsx` — Complete rewrite
- `src/index.css` — Add parallax utilities, keyframes, theme filters
- `package.json` — Remove Three.js deps

## Files to Delete
- All `src/components/scenes/*`
- `src/components/scroll/*`
- `src/components/camera/*`
- `src/components/effects/*`
- `src/components/models/*`
- `src/components/ui/equipment-label.tsx`
- `src/hooks/use-typing-effect.ts`

## Files to Keep As-Is
- `App.tsx`, `main.tsx`, `smooth-scroll-provider.tsx`, `scroll-store.ts`, `theme-store.ts`, `auth-store.ts`, `theme-switcher.tsx`, `page-layout.tsx`, all pages

---

## Implementation Sequence

| Phase | Task |
|-------|------|
| **1** | Parallax infrastructure (hooks + wrapper components) |
| **2** | Extract shared UI from scroll-overlay.tsx |
| **3** | HUD overlay |
| **4** | CSS additions (keyframes, theme filters, parallax utilities) |
| **5** | Landing shell (rewrite landing.tsx) |
| **6** | Build all 10 sections |
| **7** | Cleanup (delete Three.js files, remove deps) |
| **8** | Polish (responsive, themes, build verification) |

---

## Verification Plan

1. Scroll through all 10 sections — verify parallax depth
2. Confirm 5-10 layers per section
3. Cycle all 3 themes — verify image filters adapt
4. Test responsive: 375px, 768px, 1440px
5. Confirm 60fps scrolling
6. Verify placeholder fallbacks work
7. All routes work
8. `npm run build` — zero errors
9. Deploy to Vercel
