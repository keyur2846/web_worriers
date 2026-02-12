import type { ReactNode } from "react";

interface MissionCardProps {
  title: string;
  year: string;
  description: string;
  branch: string;
  delay?: number;
}

export function MissionCard({
  title,
  year,
  description,
  branch,
}: MissionCardProps): ReactNode {
  return (
    <div
      className="glass-panel p-6 w-72 cursor-pointer group corner-brackets transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="cb-inner">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-1 h-3"
            style={{
              backgroundColor: "#c4a35a",
              boxShadow: "0 0 8px rgba(196,163,90,0.5)",
            }}
          />
          <span className="label-military">{branch}</span>
        </div>

        <h3
          className="text-xl font-bold tracking-[0.08em] mb-1"
          style={{
            fontFamily: "var(--font-display)",
            color: "#e8e0d0",
            textShadow: "0 0 12px rgba(196,163,90,0.2)",
          }}
        >
          {title}
        </h3>
        <p
          className="mono-readout mb-2 text-[0.7rem]"
          style={{
            color: "#c4a35a",
            textShadow: "0 0 8px rgba(196,163,90,0.3)",
          }}
        >
          {year}
        </p>
        <p className="text-[0.8rem] text-[#a09880] leading-relaxed">
          {description}
        </p>

        <div className="divider-mil my-4" />

        <div className="flex items-center gap-2 text-[#c4a35a] group-hover:gap-3 transition-all">
          <span
            className="text-[0.65rem] tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              textShadow: "0 0 8px rgba(196,163,90,0.3)",
            }}
          >
            Explore Mission
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 4px rgba(196,163,90,0.4))" }}
          >
            <path d="M3 7h8M8 4l3 3-3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
