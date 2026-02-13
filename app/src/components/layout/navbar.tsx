import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { useScrollStore } from "@/stores/scroll-store";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Subscribe to scroll store with threshold to avoid re-renders on every tick
  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      const scrolled = state.globalProgress > 0.02;
      setIsScrolled((prev) => {
        if (prev !== scrolled) return scrolled;
        return prev;
      });
    });
    return unsub;
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-40">
      {/* Tricolor accent line */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, #ff9933 0%, #ff9933 30%, #c4a35a 50%, #138808 70%, #138808 100%)",
        }}
      />

      <div
        className="transition-all duration-300 ease-out"
        style={
          isScrolled
            ? {
                background: "color-mix(in oklab, var(--color-surface) 70%, transparent)",
                backdropFilter: "blur(20px) saturate(1.3)",
                borderBottom: "1px solid color-mix(in oklab, var(--color-border) 40%, transparent)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              }
            : {
                background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
                backdropFilter: "blur(4px)",
                borderBottom: "1px solid transparent",
                boxShadow: "none",
              }
        }
      >
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-1 h-5 bg-[var(--color-accent)]" />
            <div className="flex flex-col">
              <span
                className="text-sm font-bold tracking-[0.15em] leading-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
              >
                DEFENSE COMMAND
              </span>
              <span
                className="text-[0.5rem] tracking-[0.2em] uppercase opacity-40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Mission Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {link.label}
                {/* Hover underline */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-3/4 bg-[var(--color-accent)] transition-all duration-300" />
              </Link>
            ))}

            <div className="ml-2 h-4 w-px bg-[var(--color-border)]" />

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="ml-2 px-4 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase btn-tactical"
              >
                Profile
              </Link>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  to="/login"
                  className="relative px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Login
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-3/4 bg-[var(--color-accent)] transition-all duration-300" />
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase btn-tactical"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Divider before ThemeSwitcher */}
            <div className="ml-2 h-4 w-px bg-[var(--color-border)]" />
            <div className="ml-2">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-0.5 bg-[var(--color-text)] transition-transform"
              style={menuOpen ? { transform: "translateY(3px) rotate(45deg)" } : {}}
            />
            <span
              className="block w-5 h-0.5 bg-[var(--color-text)] transition-opacity"
              style={menuOpen ? { opacity: 0 } : {}}
            />
            <span
              className="block w-5 h-0.5 bg-[var(--color-text)] transition-transform"
              style={menuOpen ? { transform: "translateY(-3px) rotate(-45deg)" } : {}}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{
              background: "color-mix(in oklab, var(--color-surface) 85%, transparent)",
              backdropFilter: "blur(20px) saturate(1.3)",
              borderBottom: "1px solid color-mix(in oklab, var(--color-border) 40%, transparent)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-60" />
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-[var(--color-border)] my-1" />
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  Profile
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-60" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-accent)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    Sign Up
                  </Link>
                </>
              )}
              <div className="h-px bg-[var(--color-border)] my-1" />
              <div className="py-2">
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
