import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps): ReactNode {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="mono-readout text-[var(--color-text-muted)] text-[0.65rem]">
        {label}
      </span>
      <span className="mono-readout text-[var(--color-text)] text-[0.7rem] font-medium">
        {value}
      </span>
    </div>
  );
}
