import { useThemeStore, THEMES, THEME_META, type Theme } from "@/stores/theme-store";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  "day-ops": (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
    </svg>
  ),
  "night-ops": (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13.5 8.5a5.5 5.5 0 1 1-6-6 4.5 4.5 0 0 0 6 6Z" />
    </svg>
  ),
  tactical: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3" />
    </svg>
  ),
};

export function ThemeSwitcher() {
  const { theme, cycleTheme } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const meta = THEME_META[theme];

  return (
    <div className="relative">
      <motion.button
        onClick={() => {
          if (isExpanded) {
            setIsExpanded(false);
          } else {
            cycleTheme();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="border border-border hover:border-[var(--color-accent)] px-3 py-1.5 flex items-center gap-2 cursor-pointer bg-bg-alt transition-colors"
        title={`${meta.label} — Click to cycle, right-click to expand`}
      >
        <span className="text-[var(--color-accent)]">{THEME_ICONS[theme]}</span>
        <span
          className="text-[0.6rem] tracking-[0.1em] uppercase text-text"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {meta.label}
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 border border-border bg-surface p-1 space-y-0.5 min-w-[180px] z-50"
          >
            {THEMES.map((t) => (
              <ThemeOption
                key={t}
                theme={t}
                isActive={theme === t}
                onClick={() => {
                  useThemeStore.getState().setTheme(t);
                  setIsExpanded(false);
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeOption({
  theme,
  isActive,
  onClick,
}: {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}) {
  const meta = THEME_META[theme];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
        isActive
          ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-l-2 border-[var(--color-accent)]"
          : "hover:bg-surface-alt text-text border-l-2 border-transparent"
      }`}
    >
      <span className={isActive ? "text-[var(--color-accent)]" : "text-text-muted"}>
        {THEME_ICONS[theme]}
      </span>
      <div>
        <span
          className="block text-[0.65rem] tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {meta.label}
        </span>
        <span
          className="text-[0.55rem] text-text-muted leading-tight block"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {meta.description}
        </span>
      </div>
    </button>
  );
}
