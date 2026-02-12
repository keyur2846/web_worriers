# AGENTS.md

Guide for AI coding agents in the **Mission Intelligence** repo. This is an Indian Armed Forces themed interactive site (React + GSAP + Tailwind v4). No backend; auth and data live in `localStorage`.

---

## Commands (run from `app/`)

```bash
cd app

npm run dev        # Vite dev server (port 5173, HMR)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint flat config (TS + React hooks + refresh)
npm run preview    # Serve built assets locally
```

Tests are not configured. **Single-test execution:** not available.

---

## Tech Stack & Tooling

- React 19 + TypeScript (strict, `moduleResolution: bundler`)
- Vite 7, `@vitejs/plugin-react`, `@tailwindcss/vite`
- Tailwind CSS v4 with design system in `src/index.css` (`@theme`, custom utilities)
- GSAP + `@gsap/react` (useGSAP) with ScrollTrigger bridged to Lenis
- Lenis smooth scrolling (`SmoothScrollProvider`)
- Framer Motion for transitions and micro-animations
- Zustand stores: auth, theme, scroll
- React Router DOM v7
- Path alias: `@/*` → `./src/*` (see `vite.config.ts`, `tsconfig.app.json`)
- Linting: `eslint.config.js` flat config using `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks` recommended, `eslint-plugin-react-refresh` Vite config; ignores `dist`.
- Formatting: use TypeScript + JSX style consistent with ESLint; no Prettier config present.

---

## Repository Layout (key paths)

```
app/src/
├── App.tsx                # Router shell (landing uses its own layout)
├── main.tsx               # Entry point
├── index.css              # Themes, custom utilities, animations (Tailwind v4)
├── providers/             # smooth-scroll-provider.tsx (Lenis <-> ScrollTrigger)
├── stores/                # auth-store, theme-store, scroll-store (Zustand)
├── pages/                 # landing, login, signup, profile, about, contact
├── components/
│   ├── layout/            # page-layout, navbar, footer
│   ├── sections/          # landing sections (10 parallax scenes)
│   ├── parallax/          # ParallaxSection/Layer/Image
│   ├── hud/               # HUDOverlay, CinematicEffects
│   └── ui/                # ThemeSwitcher, MissionCard, ScrollReveal, etc.
└── hooks/                 # use-parallax
```

Public assets: `app/public/images/` (optimized PNGs), `public/models/` (unused .glb), `public/draco/` decoders.

---

## Code Style Guidelines

### Imports & Order

1) External libs (React, router, framer-motion, gsap, lenis, zustand)  
2) Internal alias `@/...` (stores, hooks, components, pages)  
3) Relative paths (avoid; prefer alias)  

Example:
```ts
import { useMemo, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { useThemeStore } from "@/stores/theme-store";
import { ParallaxSection } from "@/components/parallax/parallax-section";
```

### File Naming

- Components: PascalCase `.tsx` matching export (`ThemeSwitcher.tsx` → `export function ThemeSwitcher()`)
- Hooks: kebab-case `.ts` (`use-parallax.ts`)
- Stores: kebab-case `.ts` (`auth-store.ts` → `useAuthStore`)
- Pages: kebab-case `.tsx` (`landing.tsx` → `LandingPage`)

### TypeScript

- Strict mode on; avoid `any`. Prefer `unknown` + narrowing.
- Explicit return types for exported functions/hooks/components.
- Use discriminated unions for variants (themes, scenes).
- Prefer `type` for unions/aliases, `interface` for object contracts (stores, props when shared).
- Use `as const` for literal maps and arrays that drive UI.
- Use generics for reusable helpers; keep type parameters constrained.
- Avoid optional chaining inside tight animation loops—cache values locally.

### React Patterns

- Functional components only; prefer named exports.
- Destructure props and hook return values.
- Early returns to keep components flat.
- Keep render output small; extract subcomponents for repeated UI blocks.
- Avoid state for high-frequency animation values—use refs (`useRef`) with GSAP.
- `useGSAP` should specify `scope` and `dependencies` to avoid stale closures.
- Clean up ScrollTriggers/animations via `context` or return callbacks.
- For forms, type events (`FormEvent<HTMLFormElement>`), prevent default, and do local validation.

### Zustand Stores

- Define a store interface; expose minimal selectors.
- Use functional updates when derived from previous state.
- Keep persistence logic (localStorage) try-catch wrapped; return safe defaults on error.
- Derive computed values with selectors instead of recomputing in components.

### Styling & Design System

- Use Tailwind utilities directly; avoid CSS-in-JS.
- Custom utilities live in `index.css` (e.g., `glass-panel`, `btn-tactical`, `display-hero`, `mono-readout`, `divider-mil`).
- Themes via `data-theme` on `<html>`: `day-ops` (light), `night-ops` (dark), `tactical` (HUD green). Ensure new UI honors contrast in all three.
- Prefer CSS variables for dynamic values (`style={{ fontFamily: "var(--font-mono)" }}`).
- Respect motion: big animations with GSAP/Framer; avoid heavy layout thrash during scroll.

### Naming Conventions

- Components/Types/Interfaces: PascalCase (`HUDOverlay`, `Theme`)
- Functions/hooks/handlers: camelCase (`handleSubmit`, `useParallax`)
- Constants: UPPER_SNAKE_CASE (`THEMES`, `SESSION_KEY`)
- CSS classes: kebab-case (`glass-panel`, `btn-tactical`)

### Error Handling

- Wrap `localStorage` access in try-catch; fall back silently to defaults.
- Auth flows return booleans/status objects rather than throwing; user-facing flows should not surface stack traces.
- Guard external data (e.g., JSON parse) with safe fallbacks.
- Validate inputs before setting state; short-circuit early.

### Formatting & Misc

- Semicolons enabled (default TS/ES build); keep consistent.
- Use double quotes in TS/JS for consistency with existing files.
- Prefer `const` over `let`; use `let` only when reassignment is necessary.
- Keep JSX attributes ordered: conditional className logic near the end.
- Avoid unused vars/params; lint enforces `noUnusedLocals`/`noUnusedParameters`.

---

## Animation & Scroll Guidance

- GSAP + ScrollTrigger: created inside `useGSAP` with `scope` tied to refs; ensure cleanup.
- Lenis bridge lives in `smooth-scroll-provider.tsx`; do not remove the `ScrollTrigger.update()` bridge.
- Track global scroll via `scroll-store`; per-section progress via `useParallax`.
- Use refs for progress storage to prevent React re-render storms during scroll.
- Keep heavy computations outside scroll handlers; precompute data.

---

## Theming & Accessibility

- Ensure new components render correctly in `day-ops`, `night-ops`, and `tactical` themes.
- Maintain sufficient contrast, especially in `night-ops` and `tactical` overlays.
- Provide focus states for interactive elements; rely on Tailwind focus utilities.
- Respect reduced-motion when adding new animations (GSAP `preferReducedMotion` checks where applicable).

---

## Common Workflows

- **Add a page:** create `pages/new-page.tsx` exporting `NewPage`; wrap in `PageLayout` in `App.tsx`; add nav link in `components/layout/navbar.tsx` if needed.
- **Add a store:** create `stores/feature-store.ts`, define interface, export `useFeatureStore = create<FeatureStore>(...)`, import via `@/stores/feature-store`.
- **Add a utility class:** edit `src/index.css` under `@layer utilities`; then use class in JSX.
- **Debug ScrollTrigger:** enable `markers: true` temporarily and check trigger positions.

---

## Constraints & Reminders

- Work from `app/`; outputs build to `app/dist/`.
- No tests exist—avoid adding test-only commands unless required.
- Keep scroll performance high; avoid expensive calculations in render/scroll paths.
- Assets in root (e.g., reference images) are not served; actual public assets live under `app/public/`.
- Deadline noted in CLAUDE.md: 12 February 2026, 6:00 PM (Vercel deploy).

---

## Version

- Generated: 2026-02-12
