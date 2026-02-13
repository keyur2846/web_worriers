import { motion } from "framer-motion";

const TIMELINE = [
  { year: "1947", event: "Indian Armed Forces established post-independence" },
  { year: "1962", event: "Sino-Indian War — lessons in mountain warfare" },
  { year: "1965", event: "Indo-Pakistani War — Battle of Asal Uttar" },
  { year: "1971", event: "Liberation of Bangladesh — Operation Trident at sea" },
  { year: "1984", event: "Operation Meghdoot — securing the Siachen Glacier" },
  { year: "1999", event: "Kargil War — recapturing peaks at 16,000+ feet" },
  { year: "2016", event: "Surgical Strikes across the Line of Control" },
  { year: "2019", event: "Balakot airstrike — IAF Mirage 2000 precision strike" },
  { year: "2022", event: "INS Vikrant commissioned — India's indigenous carrier" },
];

const TECH_STACK = [
  { name: "React 19", code: "RCTX" },
  { name: "TypeScript", code: "TSCP" },
  { name: "CSS 3D Parallax", code: "3DPX" },
  { name: "GSAP", code: "GSAP" },
  { name: "Framer Motion", code: "FMOT" },
  { name: "TailwindCSS v4", code: "TWND" },
  { name: "Lenis Scroll", code: "LENS" },
  { name: "Zustand", code: "ZSTN" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function AboutPage() {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-12 bg-[var(--color-accent)] opacity-40" />
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase opacity-50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Dossier
          </span>
          <div className="h-px w-12 bg-[var(--color-accent)] opacity-40" />
        </div>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl tracking-[0.08em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          MISSION INTELLIGENCE
        </h1>
        <p className="text-text-muted mt-4 max-w-2xl mx-auto leading-relaxed text-sm">
          An interactive exploration of Indian Armed Forces — their equipment,
          capabilities, and historical operations. Built with cutting-edge web
          technologies to honor those who serve.
        </p>
        <div className="divider-mil mt-5 max-w-sm mx-auto" />
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel corner-brackets relative p-6 md:p-8 mb-8"
      >
        <div className="cb-inner" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 bg-[var(--color-accent)]" />
          <h2
            className="text-lg tracking-[0.08em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WHY THIS PROJECT?
          </h2>
        </div>
        <div className="space-y-4 text-sm text-text-muted leading-relaxed pl-4 border-l border-border">
          <p>
            The Indian Armed Forces represent one of the most capable and
            diverse military organizations in the world. With over 1.4 million
            active personnel in the Army alone, plus a 4th-ranked Air Force and
            a growing blue-water Navy, India&apos;s defense capability is both
            vast and technologically advancing.
          </p>
          <p>
            This project aims to make that information accessible and engaging
            through interactive parallax experiences, detailed equipment
            specifications, and historical operation timelines. Rather than
            static text, we believe in learning through exploration.
          </p>
          <p>
            Every piece of equipment showcased — from the T-90S Bhishma to the HAL
            Tejas to INS Vikrant — represents India&apos;s journey toward
            self-reliance in defense manufacturing (Atmanirbhar Bharat).
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel corner-brackets relative p-6 md:p-8 mb-8"
      >
        <div className="cb-inner" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 bg-[var(--color-accent)]" />
          <h2
            className="text-lg tracking-[0.08em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KEY MILESTONES
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-0"
        >
          {TIMELINE.map((item, index) => (
            <motion.div
              key={item.year}
              variants={fadeUp}
              className="flex gap-4 items-start group py-3 border-b border-border/30 last:border-b-0"
            >
              <span
                className="text-[var(--color-accent)] font-bold min-w-[4rem] text-right"
                style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem" }}
              >
                {item.year}
              </span>
              <div className="relative flex items-center">
                <div className="w-1.5 h-1.5 bg-[var(--color-accent)] opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-text-muted group-hover:text-text transition-colors flex-1">
                <span
                  className="text-[0.55rem] opacity-30 mr-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.event}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel corner-brackets relative p-6 md:p-8"
      >
        <div className="cb-inner" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-[var(--color-accent)]" />
          <h2
            className="text-lg tracking-[0.08em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BUILT WITH
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="bg-bg border border-border p-3 text-center group hover:border-[var(--color-accent)] transition-colors"
            >
              <span
                className="text-[0.5rem] text-[var(--color-accent)] opacity-40 group-hover:opacity-70 block mb-1 tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                [{tech.code}]
              </span>
              <span className="mono-readout">{tech.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Developer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel corner-brackets relative p-6 md:p-8 mt-8"
      >
        <div className="cb-inner" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-[var(--color-accent)]" />
          <h2
            className="text-lg tracking-[0.08em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            DEVELOPER
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--color-accent)] bg-opacity-20 border border-[var(--color-accent)] flex items-center justify-center">
                <span
                  className="text-[var(--color-accent)] text-lg font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  KP
                </span>
              </div>
              <div>
                <h3
                  className="text-base tracking-[0.05em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  KEYUR PARMAR
                </h3>
                <span className="mono-readout text-text-muted text-[0.65rem]">
                  Full-Stack Developer
                </span>
              </div>
            </div>

            <div className="space-y-2 pl-4 border-l border-border">
              <div className="flex justify-between items-baseline gap-4">
                <span className="mono-readout text-text-muted text-[0.65rem]">University</span>
                <span className="mono-readout text-[0.7rem]">Parul University</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <span className="mono-readout text-text-muted text-[0.65rem]">Enrollment</span>
                <span className="mono-readout text-[0.7rem]">2303051051122</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <span className="mono-readout text-text-muted text-[0.65rem]">Email</span>
                <a
                  href="mailto:keyur2846@gmail.com"
                  className="mono-readout text-[0.7rem] text-[var(--color-accent)] hover:underline"
                >
                  keyur2846@gmail.com
                </a>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <span className="mono-readout text-text-muted text-[0.65rem]">GitHub</span>
                <a
                  href="https://github.com/keyur2846"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-readout text-[0.7rem] text-[var(--color-accent)] hover:underline"
                >
                  github.com/keyur2846
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
