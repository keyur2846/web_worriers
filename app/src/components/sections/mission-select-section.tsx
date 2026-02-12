import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { ParallaxLayer } from "@/components/parallax/parallax-layer";
import { ParallaxImage } from "@/components/parallax/parallax-image";
import { MissionCard } from "@/components/ui/mission-card";

gsap.registerPlugin(ScrollTrigger);

/* ── Floating dust particles ── */
const DUST_COUNT = 18;

function generateDust(): Array<{ x: string; y: string; size: number; delay: number; duration: number }> {
  return Array.from({ length: DUST_COUNT }, () => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
  }));
}

const DUST_PARTICLES = generateDust();

/**
 * Mission Select Section -- 5 layers, 1 optional image.
 *
 * Dark atmospheric background with golden dust particles,
 * "HISTORICAL OPERATIONS" heading, and two mission cards:
 * Operation Vijay (1999) and Surgical Strike (2016).
 */
export function MissionSelectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: 1,
        },
      });

      /* Heading fades/types in */
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" },
          { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", ease: "power2.out", duration: 0.25 },
          0,
        );
      }

      /* Decorative divider line draws from center outward */
      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: "power2.out", duration: 0.2 },
          0.15,
        );
      }

      /* Mission cards stagger in (y: 60 -> 0) */
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".mission-card-wrapper");
        tl.fromTo(
          cards,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, stagger: 0.1, ease: "power2.out", duration: 0.3 },
          0.25,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection ref={sectionRef} id="mission-select" className="parallax-section">
      {/* Layer 1 -- Dark atmospheric background */}
      <ParallaxLayer speed={-0.3} className="z-0">
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, #1a1a10 0%, #0f0f0a 40%, #0a0a08 100%)",
          }}
        />
      </ParallaxLayer>

      {/* Layer 2 -- Terrain silhouette */}
      <ParallaxImage
        src="/images/terrain-silhouette.png"
        alt="Mountain terrain silhouette"
        speed={-0.2}
        className="z-[1]"
        objectFit="cover"
        objectPosition="center bottom"
        style={{ opacity: 0.2, top: "50%" }}
      />

      {/* Layer 3 -- Golden floating dust particles */}
      <ParallaxLayer speed={0.1} className="z-[2] pointer-events-none">
        {DUST_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, rgba(196,163,90,0.5) 0%, transparent 70%)`,
              animationName: "dust-float-golden",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </ParallaxLayer>

      {/* Layer 4 -- Content: heading + mission cards */}
      <ParallaxLayer speed={0} className="z-[3]">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* Small mono label */}
          <p
            className="text-[0.55rem] tracking-[0.35em] uppercase mb-3 opacity-40"
            style={{ fontFamily: "var(--font-mono)", color: "#a09880" }}
          >
            Select Operation
          </p>

          {/* Main heading */}
          <div ref={headingRef} style={{ opacity: 0 }}>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.15em] uppercase text-center"
              style={{
                fontFamily: "var(--font-display)",
                color: "#e8e0d0",
                textShadow: "0 0 30px rgba(196,163,90,0.4), 0 0 60px rgba(196,163,90,0.15)",
              }}
            >
              HISTORICAL OPERATIONS
            </h2>
          </div>

          {/* Decorative divider with diamond */}
          <div
            ref={dividerRef}
            className="flex items-center gap-3 my-6"
            style={{ opacity: 0, transformOrigin: "center" }}
          >
            <div
              className="h-px w-16 md:w-24"
              style={{ background: "linear-gradient(to right, transparent, #c4a35a)" }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ background: "#c4a35a", boxShadow: "0 0 10px rgba(196,163,90,0.6), 0 0 20px rgba(196,163,90,0.3)" }}
            />
            <div
              className="h-px w-16 md:w-24"
              style={{ background: "linear-gradient(to left, transparent, #c4a35a)" }}
            />
          </div>

          {/* Mission cards */}
          <div
            ref={cardsRef}
            className="flex flex-col md:flex-row gap-6 mt-2"
          >
            <div className="mission-card-wrapper" style={{ opacity: 0 }}>
              <MissionCard
                title="Operation Vijay"
                year="1999"
                description="The Kargil War — reclaiming strategic heights at 16,000+ feet"
                branch="Army"
                delay={0.3}
              />
            </div>
            <div className="mission-card-wrapper" style={{ opacity: 0 }}>
              <MissionCard
                title="Surgical Strike"
                year="2016"
                description="Precision strikes across the Line of Control"
                branch="Special Forces"
                delay={0.5}
              />
            </div>
          </div>
        </div>
      </ParallaxLayer>

      {/* Layer 5 -- Strong focus vignette */}
      <ParallaxLayer speed={0} className="z-[4] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0.95) 100%)",
          }}
        />
      </ParallaxLayer>
    </ParallaxSection>
  );
}
