import { useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type SplitMode = "chars" | "words" | "lines";
type AnimationPreset = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "typewriter";

interface ScrollTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  /** How to split the text for staggered animation */
  split?: SplitMode;
  /** Animation preset */
  preset?: AnimationPreset;
  /** Stagger delay between each element (seconds) */
  stagger?: number;
  /** Total animation duration (seconds) */
  duration?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** ScrollTrigger end position */
  end?: string;
  /** Whether animation is scrubbed to scroll position */
  scrub?: boolean | number;
  /** Delay before animation starts (in timeline position) */
  delay?: number;
}

/** Split text into individual characters wrapped in spans */
function splitIntoChars(text: string): string[][] {
  return text.split(" ").map((word) => word.split(""));
}

/** Split text into words */
function splitIntoWords(text: string): string[] {
  return text.split(" ");
}

const PRESET_FROM: Record<AnimationPreset, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 30, rotateX: -40 },
  "fade-in": { opacity: 0 },
  "slide-left": { opacity: 0, x: -40 },
  "slide-right": { opacity: 0, x: 40 },
  scale: { opacity: 0, scale: 0.6 },
  typewriter: { opacity: 0, display: "none" },
};

const PRESET_TO: Record<AnimationPreset, gsap.TweenVars> = {
  "fade-up": { opacity: 1, y: 0, rotateX: 0 },
  "fade-in": { opacity: 1 },
  "slide-left": { opacity: 1, x: 0 },
  "slide-right": { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  typewriter: { opacity: 1, display: "inline" },
};

/**
 * Scroll-driven text animation component.
 * Splits text into characters or words and reveals them
 * with staggered GSAP animations tied to ScrollTrigger.
 */
export function ScrollText({
  children,
  as: Tag = "h2",
  className,
  style,
  split = "chars",
  preset = "fade-up",
  stagger = 0.03,
  duration = 0.6,
  start = "top 80%",
  end = "top 30%",
  scrub = true,
  delay = 0,
}: ScrollTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  const elements = useMemo(() => {
    if (split === "words" || split === "lines") {
      return splitIntoWords(children);
    }
    return splitIntoChars(children);
  }, [children, split]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const targets = container.querySelectorAll(".scroll-char");
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { ...PRESET_FROM[preset] },
        {
          ...PRESET_TO[preset],
          stagger,
          duration,
          ease: preset === "typewriter" ? "steps(1)" : "power3.out",
          scrollTrigger: {
            trigger: container,
            start,
            end,
            scrub: scrub === true ? 1 : scrub === false ? undefined : scrub,
            toggleActions: scrub ? undefined : "play none none reverse",
          },
          delay,
        },
      );
    },
    { scope: containerRef, dependencies: [preset, stagger, duration, start, end, scrub, delay] },
  );

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={className}
      style={{ ...style, perspective: "600px" }}
    >
      {split === "chars"
        ? (elements as string[][]).map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.map((char, ci) => (
                <span
                  key={`${wi}-${ci}`}
                  className="scroll-char inline-block"
                  style={{ willChange: "transform, opacity" }}
                >
                  {char}
                </span>
              ))}
              {wi < (elements as string[][]).length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          ))
        : (elements as string[]).map((word, i) => (
            <span
              key={i}
              className="scroll-char inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {word}
              {i < (elements as string[]).length - 1 && "\u00A0"}
            </span>
          ))}
    </Tag>
  );
}
