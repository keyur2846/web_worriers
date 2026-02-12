import { useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  style?: CSSProperties;
  objectFit?: "cover" | "contain" | "none";
  objectPosition?: string;
}

/**
 * A parallax image layer with lazy loading and an army-themed error placeholder.
 * Uses the same scroll-driven GSAP pattern as `ParallaxLayer`.
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0,
  className,
  style,
  objectFit = "contain",
  objectPosition,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || speed === 0) return;

      const section = container.closest("section");
      if (!section) return;

      gsap.fromTo(
        container,
        { y: speed * -150 },
        {
          y: speed * 150,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            onToggle: (self) => {
              container.style.willChange = self.isActive ? "transform, opacity" : "auto";
            },
          },
        },
      );
    },
    { scope: containerRef, dependencies: [speed] },
  );

  const buffer = Math.abs(speed) * 150;
  const baseClasses = "absolute left-0 right-0";
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  const bufferStyle: CSSProperties = {
    top: -buffer,
    bottom: -buffer,
    ...style,
  };

  const filename = src.split("/").pop() ?? src;

  function handleError(): void {
    setHasError(true);
  }

  if (hasError) {
    return (
      <div ref={containerRef} className={classes} style={bufferStyle}>
        <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-[#4a5a3a] bg-[#1a1f16]/60">
          <span className="text-xs tracking-widest uppercase text-[#6b7a5a] opacity-60">
            [{filename}]
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={classes} style={bufferStyle}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleError}
        className="scene-image h-full w-full"
        style={{ objectFit, objectPosition }}
      />
    </div>
  );
}
