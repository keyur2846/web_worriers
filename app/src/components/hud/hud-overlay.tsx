import { motion } from "framer-motion";
import { useScrollStore } from "@/stores/scroll-store";

/**
 * Fixed HUD overlay visible throughout the landing page scroll.
 * Contains corner brackets, tricolor progress bar, scroll indicator, and classification stamp.
 */
export function HUDOverlay() {
  const activeSceneIndex = useScrollStore((s) => s.activeSceneIndex);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* HUD Corner Brackets */}
      <HUDCorners />

      {/* Tricolor progress bar */}
      <ProgressBar />

      {/* Scroll indicator */}
      {activeSceneIndex < 4 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className="text-[0.6rem] tracking-[0.3em] uppercase opacity-50"
              style={{ fontFamily: "var(--font-mono)", color: "#c8c0b0" }}
            >
              Scroll
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="#c8c0b0"
              strokeWidth="1"
              opacity="0.4"
            >
              <path d="M7 2 L7 12 M3 8 L7 12 L11 8" />
            </svg>
          </motion.div>
        </div>
      )}

      {/* Classification stamp */}
      <div className="absolute bottom-4 left-6">
        <span className="classification-stamp opacity-40">Restricted</span>
      </div>
    </div>
  );
}

function HUDCorners() {
  const cornerStyle = "absolute w-6 h-6 pointer-events-none opacity-40";
  const borderColor = "border-[#c4a35a]";
  const glowStyle = { filter: "drop-shadow(0 0 4px rgba(196,163,90,0.4))" };

  return (
    <>
      <div className={`${cornerStyle} top-4 left-4 border-t-2 border-l-2 ${borderColor}`} style={glowStyle} />
      <div className={`${cornerStyle} top-4 right-4 border-t-2 border-r-2 ${borderColor}`} style={glowStyle} />
      <div className={`${cornerStyle} bottom-4 left-4 border-b-2 border-l-2 ${borderColor}`} style={glowStyle} />
      <div className={`${cornerStyle} bottom-4 right-4 border-b-2 border-r-2 ${borderColor}`} style={glowStyle} />
      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none opacity-20">
        <div className="w-3 h-px bg-[#c4a35a]" />
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none opacity-20">
        <div className="w-3 h-px bg-[#c4a35a]" />
      </div>
    </>
  );
}

function ProgressBar() {
  const globalProgress = useScrollStore((s) => s.globalProgress);

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 h-[35%] w-[3px] overflow-hidden bg-white/5 rounded-full">
      <div
        className="w-full transition-[height] duration-150"
        style={{
          height: `${globalProgress * 100}%`,
          background: "linear-gradient(to bottom, #ff9933, #ffffff, #138808)",
          boxShadow: "0 0 8px rgba(255,153,51,0.5), 0 0 16px rgba(19,136,8,0.3)",
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-between py-px pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-1.5 h-px bg-white/10" />
        ))}
      </div>
    </div>
  );
}
