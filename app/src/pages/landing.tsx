import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useScrollStore, type SceneConfig } from "@/stores/scroll-store";
import { HUDOverlay } from "@/components/hud/hud-overlay";
import { CinematicEffects } from "@/components/hud/cinematic-effects";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { CinematicSection } from "@/components/sections/cinematic-section";
import { MissionSelectSection } from "@/components/sections/mission-select-section";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene progress ranges derived from section heights:
 *  Hero 100vh | Cinematic 1880vh | Mission 100vh
 *  Total ≈ 2080vh — each range is proportional.
 *
 *  Cinematic sub-ranges (within the 1880vh):
 *    Army zone:  350+100+30+100 = 580vh
 *    AF zone:    500+100+30     = 630vh
 *    Navy zone:  500+100+70     = 670vh
 */
const SCENE_CONFIGS: SceneConfig[] = [
  { id: "hero", label: "Hero", startProgress: 0, endProgress: 0.05 },
  { id: "indian-army", label: "Indian Army", startProgress: 0.05, endProgress: 0.33 },
  { id: "indian-airforce", label: "Indian Air Force", startProgress: 0.33, endProgress: 0.63 },
  { id: "indian-navy", label: "Indian Navy", startProgress: 0.63, endProgress: 0.95 },
  { id: "mission-select", label: "Mission Selection", startProgress: 0.95, endProgress: 1.0 },
];

export function LandingPage() {
  const setScenes = useScrollStore((s) => s.setScenes);
  const setGlobalProgress = useScrollStore((s) => s.setGlobalProgress);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setScenes(SCENE_CONFIGS);
  }, [setScenes]);

  /* Master ScrollTrigger tracking overall page progress */
  useGSAP(
    () => {
      if (!containerRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          setGlobalProgress(self.progress, self.direction);
        },
      });
    },
    { scope: containerRef, dependencies: [setGlobalProgress] },
  );

  return (
    <>
      <Navbar />
      <main ref={containerRef} id="parallax-container">
        <HeroSection />
        <CinematicSection />
        <MissionSelectSection />
      </main>

      {/* Fixed overlays */}
      <CinematicEffects />
      <HUDOverlay />
    </>
  );
}
