import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useScrollStore, type SceneConfig } from "@/stores/scroll-store";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { HUDOverlay } from "@/components/hud/hud-overlay";
import { CinematicEffects } from "@/components/hud/cinematic-effects";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { SoldierSection } from "@/components/sections/soldier-section";
import { AirforceSection } from "@/components/sections/airforce-section";
import { VikrantSection } from "@/components/sections/vikrant-section";
import { MissionSelectSection } from "@/components/sections/mission-select-section";

gsap.registerPlugin(ScrollTrigger);

const SCENE_CONFIGS: SceneConfig[] = [
  { id: "hero", label: "Hero", startProgress: 0, endProgress: 0.2 },
  { id: "indian-army", label: "Indian Army", startProgress: 0.2, endProgress: 0.4 },
  { id: "indian-airforce", label: "Indian Air Force", startProgress: 0.4, endProgress: 0.6 },
  { id: "indian-navy", label: "Indian Navy", startProgress: 0.6, endProgress: 0.8 },
  { id: "mission-select", label: "Mission Selection", startProgress: 0.8, endProgress: 1.0 },
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
        <SoldierSection />
        <AirforceSection />
        <VikrantSection />
        <MissionSelectSection />
      </main>

      {/* Fixed overlays */}
      <CinematicEffects />
      <HUDOverlay />

      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
    </>
  );
}
