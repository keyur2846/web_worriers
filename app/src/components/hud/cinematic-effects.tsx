import { useScrollStore } from "@/stores/scroll-store";

/**
 * Full-screen cinematic effects layer: film grain, color grading, vignette.
 * Updated for 5-scene structure (hero, army, air force, navy, mission select).
 */
export function CinematicEffects() {
  const activeSceneIndex = useScrollStore((s) => s.activeSceneIndex);

  const colorGrade = getColorGrade(activeSceneIndex);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
          animation: "filmGrain 0.1s steps(3) infinite",
        }}
      />

      {/* Per-scene color grading */}
      <div
        className="absolute inset-0"
        style={{ filter: colorGrade }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}

/**
 * Color grading per scene (5 scenes: 0=hero, 1=army, 2=airforce, 3=navy, 4=mission)
 * Softer values for the first few scenes.
 */
function getColorGrade(sceneIndex: number): string {
  if (sceneIndex === 0) return "sepia(0.05) saturate(1.1) contrast(1.03)";
  if (sceneIndex === 1) return "sepia(0.1) saturate(1.15) contrast(1.05)";
  if (sceneIndex === 2) return "brightness(1.05) contrast(1.03) saturate(1.05)";
  if (sceneIndex === 3) return "saturate(0.9) brightness(0.95) contrast(1.02)";
  return "sepia(0.03) saturate(1.05) contrast(1.02)";
}
