import { create } from "zustand";

/* ─── Theme Types ─── */

export const THEMES = ["day-ops", "night-ops", "tactical"] as const;
export type Theme = (typeof THEMES)[number];

export interface ThemeConfig {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}

export const THEME_META: Record<Theme, ThemeConfig> = {
  "day-ops": {
    label: "Day Ops",
    description: "Light tactical - olive, khaki, sand",
    icon: "sun",
  },
  "night-ops": {
    label: "Night Ops",
    description: "Dark stealth - navy, charcoal, muted greens",
    icon: "moon",
  },
  tactical: {
    label: "Tactical",
    description: "HUD mode - high contrast green/amber on black",
    icon: "crosshair",
  },
} as const;

/* ─── Store ─── */

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const STORAGE_KEY = "mission-intel-theme";

function isValidTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.includes(value as Theme);
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isValidTheme(stored)) return stored;
  } catch {
    // localStorage may be unavailable (SSR, privacy mode)
  }
  return "day-ops";
}

function applyThemeToDOM(theme: Theme): void {
  const root = document.documentElement;

  if (theme === "day-ops") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => {
  const initial = getStoredTheme();
  applyThemeToDOM(initial);

  return {
    theme: initial,

    setTheme: (theme) => {
      if (!isValidTheme(theme)) return;
      applyThemeToDOM(theme);
      set({ theme });
    },

    cycleTheme: () => {
      const currentIndex = THEMES.indexOf(get().theme);
      const next = THEMES[(currentIndex + 1) % THEMES.length];
      applyThemeToDOM(next);
      set({ theme: next });
    },
  };
});
