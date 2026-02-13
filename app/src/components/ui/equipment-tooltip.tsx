import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EquipmentSpec {
  spec: string;
  value: string;
}

interface EquipmentTooltipProps {
  label: string;
  details: EquipmentSpec[];
  position?: "left" | "right";
  /** Length of the dashed leader line in px (default 24) */
  connectorWidth?: number;
  /** Branch accent color (default: var(--branch-army)) */
  accentColor?: string;
  /** Branch accent glow color */
  accentGlow?: string;
}

/**
 * Hover-to-reveal equipment tooltip. Shows a radar-ping marker + label by default,
 * and expands into a glass-panel spec card that follows the mouse cursor.
 */
export function EquipmentTooltip({
  label,
  details,
  position = "right",
  connectorWidth = 24,
  accentColor = "var(--branch-army)",
  accentGlow = "var(--branch-army-glow)",
}: EquipmentTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRight = position === "right";

  function handleEnter() {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-2 pointer-events-auto ${isRight ? "flex-row" : "flex-row-reverse"}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Radar-ping marker */}
      <div className="relative shrink-0 w-4 h-4 flex items-center justify-center">
        {/* Core dot */}
        <div
          className="w-2.5 h-2.5 rounded-full relative z-10"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentGlow}, 0 0 20px ${accentGlow}`,
          }}
        />
        {/* Radar ring 1 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1.5px solid ${accentColor}`,
            animation: "radar-ping 2s ease-out infinite",
          }}
        />
        {/* Radar ring 2 (delayed) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${accentColor}`,
            animation: "radar-ping 2s ease-out infinite 0.6s",
          }}
        />
      </div>

      {/* Dashed leader line */}
      <div
        className="h-px shrink-0"
        style={{
          width: `${connectorWidth}px`,
          backgroundImage: isRight
            ? `linear-gradient(to right, ${accentColor} 60%, transparent 60%)`
            : `linear-gradient(to left, ${accentColor} 60%, transparent 60%)`,
          backgroundSize: "8px 1px",
          backgroundRepeat: "repeat-x",
          opacity: 0.7,
          boxShadow: `0 0 4px ${accentGlow}`,
        }}
      />

      {/* Label text (always visible) */}
      <span
        className="mono-readout text-[0.6rem] tracking-[0.15em] uppercase whitespace-nowrap"
        style={{ color: accentColor, textShadow: `0 0 8px ${accentGlow}` }}
      >
        {label}
      </span>

      {/* Expandable tooltip card — follows mouse */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-panel p-3 corner-brackets min-w-[180px] fixed z-50 pointer-events-none"
            style={{
              left: `${mousePos.x + 20}px`,
              top: `${mousePos.y - 10}px`,
              position: "absolute",
              "--panel-accent": accentColor,
              "--panel-glow": accentGlow,
            } as React.CSSProperties}
          >
            <div className="cb-inner">
              <h4
                className="text-[0.55rem] tracking-[0.2em] uppercase font-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)", color: accentColor }}
              >
                {label}
              </h4>
              <div className="divider-mil mb-2" />
              <div className="space-y-1">
                {details.map((d) => (
                  <div key={d.spec} className="flex justify-between items-baseline gap-3">
                    <span
                      className="mono-readout text-[0.55rem] tracking-[0.1em]"
                      style={{ color: "var(--color-text-muted, #a09880)" }}
                    >
                      {d.spec}
                    </span>
                    <span
                      className="mono-readout text-[0.6rem] font-medium"
                      style={{ color: "var(--color-text, #e8e0d0)" }}
                    >
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
