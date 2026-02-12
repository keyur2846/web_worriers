import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { ParallaxLayer } from "@/components/parallax/parallax-layer";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { ScrollText } from "@/components/ui/scroll-text";

gsap.registerPlugin(ScrollTrigger);

/* ── Star field ── */
function generateStarShadows(count: number): string {
  const stars: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * 2000);
    const y = Math.round(Math.random() * 2000);
    const size = Math.random() > 0.85 ? 2 : 1;
    const opacity = (Math.random() * 0.6 + 0.2).toFixed(2);
    stars.push(`${x}px ${y}px 0 ${size > 1 ? "1px" : "0"} rgba(255,255,255,${opacity})`);
  }
  return stars.join(", ");
}

const STAR_SHADOWS = generateStarShadows(55);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chakraRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* Chakra scale pulse on scroll */
      if (chakraRef.current) {
        tl.fromTo(
          chakraRef.current,
          { scale: 1.05 },
          { scale: 0.95, ease: "none" },
          0,
        );
      }

      /* Title group fades out on scroll */
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -30, ease: "power2.in" },
          0.3,
        );
      }

      /* Scene fades out 80-100% */
      if (sceneRef.current) {
        tl.to(
          sceneRef.current,
          { opacity: 0, ease: "none" },
          0.8,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection ref={sectionRef} id="hero" className="parallax-section">
      {/* Layer 1 — Deep BG gradient */}
      <ParallaxLayer speed={-0.5} className="z-0">
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(ellipse at center, #0c1a2a 0%, #020408 100%)",
          }}
        />
      </ParallaxLayer>

      {/* Layer 2 — Star field */}
      <ParallaxLayer speed={-0.4} className="z-[1]">
        <div
          className="absolute inset-0 star-twinkle"
          style={{
            width: "2px",
            height: "2px",
            background: "transparent",
            boxShadow: STAR_SHADOWS,
          }}
        />
      </ParallaxLayer>

      {/* Layer 3 — Atmospheric haze (warm gold glow) */}
      <ParallaxLayer speed={-0.3} className="z-[2]">
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, rgba(196,163,90,0.15) 0%, transparent 65%)",
          }}
        />
      </ParallaxLayer>

      {/* Layer 4 — Ashoka Chakra SVG with golden glow */}
      <ParallaxLayer speed={0} className="z-[3] flex items-center justify-center">
        <div ref={chakraRef} className="flex items-center justify-center h-full w-full">
          <div className="relative">
            {/* Glow halo behind chakra */}
            <div
              className="absolute inset-0 glow-pulse"
              style={{
                background: "radial-gradient(circle, rgba(196,163,90,0.3) 0%, rgba(196,163,90,0.1) 40%, transparent 70%)",
                transform: "scale(1.6)",
              }}
            />
            <AshokaChakra size={300} animate className="opacity-50 drop-shadow-[0_0_20px_rgba(196,163,90,0.4)]" />
          </div>
        </div>
      </ParallaxLayer>

      {/* Layer 5 — Title text with scroll-driven character animation */}
      <ParallaxLayer speed={0.05} className="z-[4]">
        <div
          ref={titleRef}
          className="flex h-full w-full flex-col items-center justify-center text-center px-4"
        >
          <p className="mono-label mb-4 opacity-50 text-muted-sand">
            Mission Intelligence System v2.0
          </p>

          <ScrollText
            as="h1"
            className="display-hero text-4xl md:text-6xl lg:text-7xl text-cream"
            split="chars"
            preset="fade-up"
            stagger={0.02}
            start="top 95%"
            end="top 60%"
            scrub={1.2}
          >
            DEFEND . SERVE . PROTECT
          </ScrollText>

          <ScrollText
            as="p"
            className="heading-text text-lg md:text-xl mt-4 text-warm"
            split="words"
            preset="fade-up"
            stagger={0.08}
            start="top 90%"
            end="top 55%"
            scrub={1}
          >
            Indian Armed Forces
          </ScrollText>

          <div className="mt-6 w-24 mx-auto gold-divider" />
        </div>
      </ParallaxLayer>

      {/* Layer 6 — God ray overlay */}
      <ParallaxLayer speed={-0.05} className="z-[5] pointer-events-none">
        <div
          className="h-full w-full god-ray-rotate"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 40%, transparent 0deg, rgba(196,163,90,0.04) 30deg, transparent 60deg, rgba(196,163,90,0.03) 120deg, transparent 150deg, rgba(196,163,90,0.04) 210deg, transparent 240deg, rgba(196,163,90,0.03) 300deg, transparent 330deg)",
            mixBlendMode: "overlay",
          }}
        />
      </ParallaxLayer>

      {/* Layer 7 — Vignette */}
      <ParallaxLayer speed={0} className="z-[6] pointer-events-none">
        <div
          ref={sceneRef}
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)",
          }}
        />
      </ParallaxLayer>
    </ParallaxSection>
  );
}
