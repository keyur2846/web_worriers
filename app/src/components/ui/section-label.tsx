import type { ReactNode } from "react";

interface SectionLabelProps {
  number: string;
  title: string;
}

export function SectionLabel({ number, title }: SectionLabelProps): ReactNode {
  return (
    <div
      className="absolute top-6 left-6 right-20 flex items-start justify-between z-[8] pointer-events-none"
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span
            className="text-[2rem] font-bold leading-none opacity-20"
            style={{ fontFamily: "var(--font-display)", color: "#c4a35a" }}
          >
            {number}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[0.6rem] tracking-[0.2em] uppercase opacity-40"
            style={{ fontFamily: "var(--font-mono)", color: "#a09880" }}
          >
            Section
          </span>
          <span
            className="text-sm tracking-[0.15em] uppercase font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "#e8e0d0" }}
          >
            {title}
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 mt-2">
        <div className="h-px w-12 bg-[#c4a35a] opacity-20" />
        <div className="h-1 w-1 bg-[#c4a35a] opacity-30" />
      </div>
    </div>
  );
}
