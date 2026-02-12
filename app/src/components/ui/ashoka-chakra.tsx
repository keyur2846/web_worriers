import type { ReactNode } from "react";

interface AshokaChakraProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

const SPOKE_COUNT = 24;
const GOLD = "#c4a35a";

function generateSpokes(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
): string {
  return Array.from({ length: SPOKE_COUNT }, (_, i) => {
    const angle = (i / SPOKE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(angle) * innerRadius;
    const y1 = cy + Math.sin(angle) * innerRadius;
    const x2 = cx + Math.cos(angle) * outerRadius;
    const y2 = cy + Math.sin(angle) * outerRadius;
    return `M${x1},${y1}L${x2},${y2}`;
  }).join(" ");
}

export function AshokaChakra({
  className,
  size = 200,
  animate = true,
}: AshokaChakraProps): ReactNode {
  const cx = 100;
  const cy = 100;
  const outerRadius = 90;
  const innerRadius = 18;
  const rimWidth = 6;
  const spokePaths = generateSpokes(cx, cy, innerRadius, outerRadius - rimWidth);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={animate ? { animation: "chakra-spin 60s linear infinite" } : undefined}
    >
      {/* Outer rim */}
      <circle
        cx={cx}
        cy={cy}
        r={outerRadius}
        stroke={GOLD}
        strokeWidth={rimWidth}
        fill="none"
      />

      {/* Inner hub */}
      <circle
        cx={cx}
        cy={cy}
        r={innerRadius}
        stroke={GOLD}
        strokeWidth={3}
        fill={GOLD}
        fillOpacity={0.15}
      />

      {/* 24 spokes */}
      <path
        d={spokePaths}
        stroke={GOLD}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

    </svg>
  );
}
