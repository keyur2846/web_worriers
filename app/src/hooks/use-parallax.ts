import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useScrollStore } from "@/stores/scroll-store";

gsap.registerPlugin(ScrollTrigger);

interface UseParallaxReturn {
  sectionRef: React.RefObject<HTMLElement | null>;
  progressRef: React.MutableRefObject<number>;
}

/**
 * Creates a ScrollTrigger on the referenced section element that tracks
 * scroll progress (0-1) through a mutable ref for high-performance reads.
 *
 * Also updates the global scroll store progress as the section scrolls.
 */
export function useParallax(): UseParallaxReturn {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const setGlobalProgress = useScrollStore((s) => s.setGlobalProgress);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          setGlobalProgress(self.progress, self.direction);
        },
      });
    },
    { scope: sectionRef, dependencies: [setGlobalProgress] },
  );

  return { sectionRef, progressRef };
}
