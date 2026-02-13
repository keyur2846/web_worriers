import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps): ReactNode {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="mono-readout text-[0.65rem]" style={{ color: "#9a9585" }}>
        {label}
      </span>
      <span className="mono-readout text-[0.7rem] font-medium" style={{ color: "#e8e0d0" }}>
        {value}
      </span>
    </div>
  );
}
