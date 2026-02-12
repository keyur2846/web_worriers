import type { ReactNode, Ref } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  ref?: Ref<HTMLElement>;
}

/**
 * A full-viewport section wrapper with CSS 3D perspective enabled.
 * Pair with `useParallax` to get scroll-driven progress tracking.
 */
export function ParallaxSection({ children, className, id, ref }: ParallaxSectionProps) {
  const baseClasses = "relative h-screen overflow-hidden";
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <section
      ref={ref}
      id={id}
      className={classes}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {children}
    </section>
  );
}
