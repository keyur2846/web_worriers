import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const success = signIn(email, password);
    if (success) {
      navigate("/profile");
    } else {
      setError("Invalid credentials. Check your email and password.");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel corner-brackets relative p-8"
      >
        <div className="cb-inner" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-[var(--color-accent)] opacity-40" />
            <span
              className="text-[0.6rem] tracking-[0.2em] uppercase opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Secure Access
            </span>
            <div className="h-px w-8 bg-[var(--color-accent)] opacity-40" />
          </div>
          <h2
            className="text-2xl tracking-[0.08em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
          >
            AUTHENTICATION
          </h2>
          <div className="divider-mil mt-3" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 border border-danger/30 bg-danger/5 text-danger text-xs tracking-wide"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="font-bold">[ERROR]</span> {error}
            </motion.div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mono-readout text-text-muted block mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="operative@mission.in"
              className="w-full bg-bg-alt border border-border px-4 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mono-readout text-text-muted block mb-2"
            >
              Access Code
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-bg-alt border border-border px-4 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none transition-colors"
            />
          </div>

          <button type="submit" className="w-full btn-tactical cursor-pointer">
            Authorize
          </button>
        </form>

        <div className="mt-6 pt-4 text-center">
          <div className="divider-mil mb-4" />
          <p className="mono-readout text-text-muted">
            No account?{" "}
            <Link
              to="/signup"
              className="text-[var(--color-accent)] hover:underline underline-offset-2"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
