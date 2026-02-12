import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const NAV_LINKS = [
  { path: "/", label: "Home", code: "HQ" },
  { path: "/about", label: "About", code: "ABT" },
  { path: "/contact", label: "Contact", code: "COM" },
  { path: "/login", label: "Login", code: "AUTH" },
  { path: "/profile", label: "Profile", code: "OPS" },
] as const;

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
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
                  MISSION INTEL
                </span>
                <span
                  className="text-[0.5rem] tracking-[0.2em] uppercase opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Defense Systems
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase transition-all ${
                      isActive
                        ? "text-[var(--color-accent)]"
                        : "text-text-muted hover:text-text"
                    }`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="hidden md:inline">{link.label}</span>
                    <span className="md:hidden">{link.code}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-px bg-[var(--color-accent)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              <div className="ml-2 border-l border-border pl-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="pt-20 pb-16 px-6">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-[var(--color-accent)]" />
              <h1
                className="text-2xl md:text-3xl font-bold tracking-[0.1em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h1>
            </div>
            <div className="ml-[1.125rem] divider-mil" />
          </motion.div>
        )}
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[var(--color-accent)] opacity-40" />
              <p className="mono-readout text-text-muted text-[0.6rem]">
                &copy; 2026 Mission Intelligence &middot; Web Worriers
              </p>
            </div>

            <div className="flex gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mono-readout text-text-muted hover:text-[var(--color-accent)] transition-colors text-[0.6rem]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Classification marking */}
          <div className="mt-4 text-center">
            <span className="classification-stamp opacity-20">For Educational Purposes Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
