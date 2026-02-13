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
}

/**
 * Hover-to-reveal equipment tooltip. Shows a pulsing marker + label by default,
 * and expands into a glass-panel spec card that follows the mouse cursor.
 */
export function EquipmentTooltip({
  label,
  details,
  position = "right",
  connectorWidth = 24,
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
      {/* Pulsing dot marker */}
      <div className="relative shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: "var(--color-accent, #c4a35a)",
            boxShadow: "0 0 8px rgba(196,163,90,0.7)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: "var(--color-accent, #c4a35a)",
            opacity: 0.3,
            animationDuration: "2s",
          }}
        />
      </div>

      {/* Dashed leader line */}
      <div
        className="h-px shrink-0"
        style={{
          width: `${connectorWidth}px`,
          backgroundImage: isRight
            ? "linear-gradient(to right, rgba(196,163,90,0.8) 60%, transparent 60%)"
            : "linear-gradient(to left, rgba(196,163,90,0.8) 60%, transparent 60%)",
          backgroundSize: "8px 1px",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Label text (always visible) */}
      <span
        className="mono-readout text-[0.6rem] tracking-[0.15em] uppercase whitespace-nowrap"
        style={{ color: "var(--color-accent, #c4a35a)", textShadow: "0 0 8px rgba(196,163,90,0.4)" }}
      >
        {label}
      </span>

      {/* Expandable tooltip card — follows mouse */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-panel p-3 corner-brackets min-w-[180px] fixed z-50 pointer-events-none"
            style={{
              left: `${mousePos.x + 20}px`,
              top: `${mousePos.y - 10}px`,
              position: "absolute",
            }}
          >
            <div className="cb-inner">
              <h4
                className="text-[0.55rem] tracking-[0.2em] uppercase font-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}
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
