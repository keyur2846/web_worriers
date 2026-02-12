import { useRef, type ReactNode, type CSSProperties, createElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayerProps {
  speed: number;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  as?: string;
}

/**
 * An absolutely positioned layer that moves at a parallax speed relative
 * to the nearest `<section>` parent. Negative speed = slower (background),
 * positive speed = faster (foreground).
 */
export function ParallaxLayer({
  speed,
  className,
  children,
  style,
  as = "div",
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layer = layerRef.current;
      if (!layer) return;

      const section = layer.closest("section");
      if (!section) return;

      gsap.fromTo(
        layer,
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
              layer.style.willChange = self.isActive ? "transform, opacity" : "auto";
            },
          },
        },
      );
    },
    { scope: layerRef, dependencies: [speed] },
  );

  const buffer = Math.abs(speed) * 150;
  const baseClasses = "absolute left-0 right-0";
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  const mergedStyle: CSSProperties = {
    top: -buffer,
    bottom: -buffer,
    ...style,
  };

  return createElement(
    as,
    { ref: layerRef, className: classes, style: mergedStyle },
    children,
  );
}
