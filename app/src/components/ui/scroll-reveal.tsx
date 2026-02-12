import { useRef, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Direction the element slides in from */
  direction?: RevealDirection;
  /** Travel distance in pixels */
  distance?: number;
  /** Animation duration */
  duration?: number;
  /** Delay before this element animates */
  delay?: number;
  /** ScrollTrigger start */
  start?: string;
  /** Scrub to scroll or play once */
  scrub?: boolean | number;
  /** Scale from value (1 = no scale) */
  scaleFrom?: number;
}

const DIRECTION_OFFSET: Record<RevealDirection, (d: number) => gsap.TweenVars> = {
  up: (d) => ({ y: d }),
  down: (d) => ({ y: -d }),
  left: (d) => ({ x: d }),
  right: (d) => ({ x: -d }),
  none: () => ({}),
};

/**
 * Wraps any element with a scroll-triggered reveal animation.
 * Fades + slides in from the chosen direction when scrolled into view.
 */
export function ScrollReveal({
  children,
  className,
  style,
  direction = "up",
  distance = 40,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
  scrub = false,
  scaleFrom = 1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const from: gsap.TweenVars = {
        opacity: 0,
        scale: scaleFrom,
        ...DIRECTION_OFFSET[direction](distance),
      };

      const to: gsap.TweenVars = {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          scrub: scrub === true ? 1 : scrub === false ? undefined : scrub,
          toggleActions: scrub ? undefined : "play none none reverse",
        },
      };

      gsap.fromTo(el, from, to);
    },
    { scope: ref, dependencies: [direction, distance, duration, delay, start, scrub, scaleFrom] },
  );

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity", ...style }}>
      {children}
    </div>
  );
}
