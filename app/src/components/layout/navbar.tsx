import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="glass-panel border-t-0 border-x-0">
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
                className="px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {link.label}
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
                  className="px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase btn-tactical"
                >
                  Sign Up
                </Link>
              </div>
            )}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-panel border-t-0 border-x-0"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-[var(--color-border)] my-1" />
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Profile
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-accent)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
