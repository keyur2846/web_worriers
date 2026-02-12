import type { ReactNode } from "react";

type InfoPanelPosition = "left" | "right" | "center";

interface InfoPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  position?: InfoPanelPosition;
}

const POSITION_CLASSES: Record<InfoPanelPosition, string> = {
  left: "left-6 top-1/2 -translate-y-1/2 max-w-sm",
  right: "right-6 top-1/2 -translate-y-1/2 max-w-sm",
  center: "left-1/2 -translate-x-1/2 bottom-[12%] max-w-lg",
};

export function InfoPanel({
  title,
  subtitle,
  children,
  position = "left",
}: InfoPanelProps): ReactNode {
  return (
    <div
      className={`absolute pointer-events-auto ${POSITION_CLASSES[position]}`}
    >
      <div className="glass-panel p-5 space-y-3 corner-brackets">
        <div className="cb-inner">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-1.5 h-4"
              style={{
                backgroundColor: "#c4a35a",
                boxShadow: "0 0 8px rgba(196,163,90,0.5)",
              }}
            />
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase font-semibold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#c4a35a",
                  textShadow: "0 0 10px rgba(196,163,90,0.3)",
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="divider-mil my-3" />

          {children}
        </div>
      </div>
    </div>
  );
}
