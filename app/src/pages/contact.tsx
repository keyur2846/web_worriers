import { useState } from "react";
import { motion } from "framer-motion";

const CONTACT_INFO = [
  { label: "Base of Operations", value: "Mumbai, Maharashtra, India", code: "LOC" },
  { label: "Communication", value: "contact@missionintel.in", code: "COM" },
  { label: "Status", value: "Operational 24/7", code: "STS" },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-12 bg-[var(--color-accent)] opacity-40" />
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase opacity-50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Secure Channel
          </span>
          <div className="h-px w-12 bg-[var(--color-accent)] opacity-40" />
        </div>
        <h1
          className="text-3xl md:text-4xl tracking-[0.08em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CONTACT US
        </h1>
        <p className="text-text-muted mt-3 max-w-lg mx-auto text-sm leading-relaxed">
          Have feedback, suggestions, or questions? Send us a message through
          the secure channel below.
        </p>
        <div className="divider-mil mt-4 max-w-xs mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          {CONTACT_INFO.map((item) => (
            <div
              key={item.label}
              className="glass-panel corner-brackets relative p-4"
            >
              <div className="cb-inner" />
              <div className="flex items-start gap-3">
                <span
                  className="text-[0.6rem] tracking-[0.15em] text-[var(--color-accent)] opacity-60 pt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  [{item.code}]
                </span>
                <div>
                  <span className="mono-readout text-text-muted block mb-1">
                    {item.label}
                  </span>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-2"
        >
          <div className="glass-panel corner-brackets relative p-6 md:p-8">
            <div className="cb-inner" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div
                  className="text-4xl mb-4 text-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &#x2713;
                </div>
                <h3
                  className="text-xl tracking-[0.08em] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  MESSAGE RECEIVED
                </h3>
                <p className="mono-readout text-text-muted">
                  Your transmission has been logged. We will respond shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="mono-readout text-text-muted block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-bg border border-border px-4 py-2.5 text-sm text-text focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mono-readout text-text-muted block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-bg border border-border px-4 py-2.5 text-sm text-text focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="mono-readout text-text-muted block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-bg border border-border px-4 py-2.5 text-sm text-text focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="mono-readout text-text-muted block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-bg border border-border px-4 py-2.5 text-sm text-text focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-tactical cursor-pointer"
                >
                  Transmit Message
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
