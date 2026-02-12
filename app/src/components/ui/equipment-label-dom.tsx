import type { ReactNode } from "react";

type EquipmentLabelSide = "left" | "right";

interface EquipmentLabelDomProps {
  label: string;
  value: string;
  className?: string;
  side?: EquipmentLabelSide;
}

export function EquipmentLabelDom({
  label,
  value,
  className,
  side = "left",
}: EquipmentLabelDomProps): ReactNode {
  const isLeft = side === "left";

  return (
    <div
      className={`flex items-center gap-2 pointer-events-none ${
        isLeft ? "flex-row" : "flex-row-reverse"
      } ${className ?? ""}`}
    >
      {/* Connecting line */}
      <div
        className="h-px w-6 shrink-0"
        style={{
          background: isLeft
            ? "linear-gradient(to right, var(--color-accent, #c4a35a), transparent)"
            : "linear-gradient(to left, var(--color-accent, #c4a35a), transparent)",
        }}
      />

      {/* Anchor dot */}
      <div
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          backgroundColor: "var(--color-accent, #c4a35a)",
          boxShadow: "0 0 6px rgba(196,163,90,0.6)",
        }}
      />

      {/* Label content */}
      <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
        <span
          className="mono-readout text-[0.55rem] tracking-[0.15em] uppercase leading-tight"
          style={{ color: "var(--color-text-muted, #a09880)" }}
        >
          {label}
        </span>
        <span
          className="mono-readout text-[0.7rem] font-medium leading-tight"
          style={{
            color: "var(--color-accent, #c4a35a)",
            textShadow: "0 0 8px rgba(196,163,90,0.4)",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
