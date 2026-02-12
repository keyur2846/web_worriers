# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mission Intelligence** — An Indian Armed Forces themed interactive website for the Web Worriers frontend competition. The app features a cinematic scroll-driven landing page with parallax sections (Army, Navy, Air Force), plus standard pages (Login, Signup, About, Contact, Profile). No backend — all auth and data use localStorage.

**Deadline:** 12 February 2026, 6:00 PM. Deployed on Vercel.

## Commands

All commands run from the `app/` directory:

```bash
cd app

npm run dev        # Vite dev server (hot reload)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint (flat config, TS + React hooks + refresh)
npm run preview    # Preview production build locally
```

There are no tests configured.

## Tech Stack

- **React 19** + **TypeScript** (strict mode) with **Vite 7**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js`, config lives in `index.css` `@theme` block)
- **GSAP** + `@gsap/react` (useGSAP hook) for scroll-driven animations
- **Lenis** for smooth scroll (`SmoothScrollProvider` wraps the app)
- **Framer Motion** for page transitions and UI micro-animations
- **Zustand** for state management (3 stores)
- **React Router DOM v7** for client-side routing

## Architecture

### Directory Structure (`app/src/`)

```
src/
├── App.tsx              # Router: "/" = LandingPage (own layout), all others use PageLayout
├── main.tsx             # Entry point
├── index.css            # Design system: themes, custom colors, @utility classes, animations
├── stores/              # Zustand stores
│   ├── auth-store.ts    # Auth + user profiles (localStorage-backed)
│   ├── theme-store.ts   # 3-theme system (day-ops/night-ops/tactical)
│   └── scroll-store.ts  # Global scroll progress + active scene tracking
├── providers/
│   └── smooth-scroll-provider.tsx  # Lenis + GSAP ScrollTrigger bridge
├── pages/               # Route-level page components
│   ├── landing.tsx      # Cinematic scroll canvas (10 parallax sections)
│   ├── login.tsx
│   ├── signup.tsx
│   ├── profile.tsx
│   ├── about.tsx
│   └── contact.tsx
├── components/
│   ├── layout/page-layout.tsx      # Nav + footer shell for non-landing pages
│   ├── sections/                   # Landing page scroll sections (each = 1 viewport)
│   ├── parallax/                   # ParallaxSection, ParallaxLayer, ParallaxImage
│   ├── hud/                        # HUDOverlay (fixed), CinematicEffects
│   └── ui/                         # Reusable: ThemeSwitcher, ScrollReveal, MissionCard, etc.
└── hooks/
    └── use-parallax.ts  # ScrollTrigger-based progress tracking per section
```

### Key Architecture Patterns

**Landing Page Scroll System:** The landing page (`pages/landing.tsx`) is a sequence of 10 full-viewport sections. A master `ScrollTrigger` on the container tracks global progress (0→1) and feeds it into `scroll-store`. Each section uses `useParallax()` or its own ScrollTrigger for local progress. The `HUDOverlay` reads scroll state to show tricolor progress bar and scene indicators.

**Theme System:** Three themes — `day-ops` (default/light), `night-ops` (dark), `tactical` (HUD green-on-black). Themes work via `data-theme` attribute on `<html>`. CSS custom properties (`--mil-*`) swap all colors. Tailwind v4 custom variants `night-ops:` and `tactical:` enable per-theme utility classes. The `tactical` mode adds scanlines, crosshair cursor, and a green overlay.

**Auth Simulation:** `auth-store` stores users in localStorage under `mission-intel-users` (keyed by email) and current session under `mission-intel-session`. Passwords stored in plaintext (acceptable — no backend). Profile updates sync to both session and user registry.

**Two Layout Modes:**
- Landing page (`/`): No nav/footer, fullscreen scroll canvas with fixed HUD overlay
- All other pages: `PageLayout` wrapper with glass-panel nav, animated page title, footer

### Path Alias

`@/*` maps to `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Design System (index.css)

The design system is entirely in `src/index.css` — no separate Tailwind config file.

**Custom Tailwind utilities** (use directly in className):
- Typography: `display-hero`, `display-section`, `display-text`, `heading-text`, `slab-text`, `stencil-text`, `mono-readout`, `mono-label`
- Colors: `text-gold`, `text-cream`, `text-muted-sand`, `text-warm`
- Panels: `glass-panel`, `bracket-corners`, `hud-border`
- Decorative: `gold-divider`, `divider-mil`, `hash-pattern`, `btn-tactical`, `classification-stamp`, `tactical-glow`, `vignette-overlay`
- Layout: `scene-container`

**Font families** (via CSS variables):
- `--font-heading`: Rajdhani (nav, headings)
- `--font-display`: Oswald (hero text, section titles)
- `--font-body`: Inter (body text)
- `--font-slab`: Bitter (emphasis)
- `--font-mono`: JetBrains Mono (labels, readouts, inputs)
- `--font-stencil`: Black Ops One (stamps, classification marks)

**Color palette variables**: `--color-olive-*`, `--color-khaki-*`, `--color-sand-*`, `--color-navy-*`, `--color-charcoal-*`, `--color-hud-*`, plus Indian flag colors (`--color-saffron`, `--color-flag-green`, `--color-navy-chakra`).

## Deployment

Hosted on **Vercel**. `vercel.json` has a catch-all rewrite for SPA routing. Build output goes to `app/dist/`.

## Important Notes

- Images in `public/images/` are pre-optimized PNG assets for parallax scenes. Additional reference PNGs sit in the repo root (used during design, not served).
- 3D models (`.glb`) in `public/models/` are not currently used in the app but are available.
- The `gemini_iamges_w0_bg/`, `hal_tejas/`, `indian_soldier_at_work/`, `uss_nimitz_class_aircraft_carrier/` directories at repo root contain source/reference images, not app assets.
- GSAP ScrollTrigger is bridged with Lenis in `smooth-scroll-provider.tsx` — the bridge calls `ScrollTrigger.update()` on every Lenis scroll event to keep them in sync.
- All competition requirements (mandatory pages, profile features, theme switcher) are documented in `IMPLEMENTATION_PLAN.md`.
