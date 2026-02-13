import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      }).to(contentRef.current, { opacity: 0, y: -40, ease: "power2.in" }, 0.4);
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection ref={sectionRef} id="hero" className="parallax-section">
      {/* Background — looping flag video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/videos/waving_flag.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* Content layer */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col">
        {/* Top half — text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.12em] leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "#c4a35a",
              textShadow:
                "0 0 40px rgba(196,163,90,0.35), 0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            INDIAN
            <br />
            ARMED FORCES
          </h1>

          <div className="mt-5 w-32 mx-auto gold-divider" />

          <h2
            className="text-lg md:text-2xl lg:text-3xl tracking-[0.3em] mt-4 uppercase font-semibold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#e8dcc8",
              textShadow: "0 1px 6px rgba(0,0,0,0.8)",
            }}
          >
            DEFEND &middot; SERVE &middot; PROTECT
          </h2>
        </div>

        {/* Bottom half — soldier */}
        <div className="flex-1 relative flex items-end justify-center overflow-hidden">
          <img
            src="/images/army-saluting/frame-001.png"
            alt="Indian Army Soldier"
            className="h-[90%] w-auto max-w-none object-contain object-bottom"
            style={{
              filter:
                "drop-shadow(0 4px 20px rgba(0,0,0,0.6)) contrast(1.05) brightness(1.02)",
            }}
          />
        </div>
      </div>
    </ParallaxSection>
  );
}
