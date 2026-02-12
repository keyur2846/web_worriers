import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { ParallaxLayer } from "@/components/parallax/parallax-layer";
import { SectionLabel } from "@/components/ui/section-label";
import { InfoRow } from "@/components/ui/info-row";
import { EquipmentTooltip } from "@/components/ui/equipment-tooltip";

gsap.registerPlugin(ScrollTrigger);

/**
 * Indian Air Force Section — Tejas centered, sky gradient (no cloud images),
 * equipment hover tooltips on aircraft, info panel below.
 */
export function AirforceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tejasRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
      });

      /* Tejas flies in from bottom-left, settles center — starts immediately */
      if (tejasRef.current) {
        tl.fromTo(
          tejasRef.current,
          { xPercent: -25, yPercent: 20, opacity: 0, scale: 0.9 },
          { xPercent: 0, yPercent: 0, opacity: 1, scale: 1, ease: "power2.out", duration: 0.3 },
          0,
        );
      }

      /* Bottom info fades in — follows quickly */
      if (bottomRef.current) {
        const elements = bottomRef.current.querySelectorAll(".content-animate");
        tl.fromTo(
          elements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.03, ease: "power2.out", duration: 0.15 },
          0.08,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection ref={sectionRef} id="airforce" className="parallax-section">
      <SectionLabel number="02" title="Indian Air Force" />

      {/* Layer 1 — Sky gradient (no cloud images) */}
      <ParallaxLayer speed={-0.5} className="z-0">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(to bottom, #0a1a3a 0%, #1a3a6a 20%, #4a7ab5 50%, #87ceeb 80%, #a8dce8 100%)",
          }}
        />
      </ParallaxLayer>

      {/* Layer 2 — Sun flare */}
      <ParallaxLayer speed={-0.1} className="z-[1] pointer-events-none">
        <div
          className="absolute"
          style={{
            top: "-5%",
            right: "15%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(255,240,200,0.35) 0%, rgba(255,220,150,0.12) 30%, transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
      </ParallaxLayer>

      {/* Layer 3 — HAL Tejas (centered) with tooltips */}
      <ParallaxLayer speed={0} className="z-[3]">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            ref={tejasRef}
            className="relative"
            style={{
              width: "60%",
              maxWidth: "650px",
              opacity: 0,
            }}
          >
            <img
              src="/images/tejas.png"
              alt="HAL Tejas Light Combat Aircraft"
              className="scene-image w-full h-auto object-contain"
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
              }}
            />

            {/* Equipment tooltips on aircraft */}
            <div className="absolute top-[20%] right-[5%]">
              <EquipmentTooltip
                label="Max Speed"
                position="right"
                details={[
                  { spec: "Speed", value: "Mach 1.8" },
                  { spec: "Supercruise", value: "Mach 1.1" },
                ]}
              />
            </div>

            <div className="absolute top-[45%] left-[2%]">
              <EquipmentTooltip
                label="BVR Missile"
                position="left"
                details={[
                  { spec: "Type", value: "Derby / Astra" },
                  { spec: "Range", value: "80+ km" },
                ]}
              />
            </div>

            <div className="absolute top-[55%] right-[2%]">
              <EquipmentTooltip
                label="WVR Missile"
                position="right"
                details={[
                  { spec: "Type", value: "Python-5" },
                  { spec: "Range", value: "20 km" },
                ]}
              />
            </div>

            <div className="absolute bottom-[10%] left-[30%]">
              <EquipmentTooltip
                label="GSh-23 Cannon"
                position="left"
                details={[
                  { spec: "Caliber", value: "23mm" },
                  { spec: "Rate", value: "3,400 rpm" },
                ]}
              />
            </div>
          </div>
        </div>
      </ParallaxLayer>

      {/* Layer 4 — Vapor trail */}
      <ParallaxLayer speed={-0.05} className="z-[2] pointer-events-none">
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "5%",
            width: "50%",
            height: "3px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.3) 60%, transparent)",
            filter: "blur(2px)",
            opacity: 0.5,
          }}
        />
      </ParallaxLayer>

      {/* Layer 5 — Bottom info area */}
      <ParallaxLayer speed={0} className="z-[5]">
        <div ref={bottomRef} className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left — Description */}
            <div className="content-animate">
              <h2
                className="text-2xl md:text-3xl font-bold tracking-[0.1em] mb-3"
                style={{ fontFamily: "var(--font-display)", color: "#c4a35a", textShadow: "0 0 20px rgba(196,163,90,0.3)" }}
              >
                INDIAN AIR FORCE
              </h2>
              <div className="gold-divider w-28 mb-3" />
              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ fontFamily: "var(--font-body)", color: "#c8c0b0" }}
              >
                The Indian Air Force is the air arm of the Indian Armed Forces,
                operating cutting-edge fighter aircraft including the indigenous HAL Tejas.
                With over 1,500 aircraft, the IAF is the fourth-largest air force in the world.
              </p>
            </div>

            {/* Right — Info Panel */}
            <div className="content-animate">
              <div className="glass-panel p-5 space-y-3 corner-brackets max-w-sm">
                <div className="cb-inner">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-1.5 h-4" style={{ backgroundColor: "#c4a35a", boxShadow: "0 0 8px rgba(196,163,90,0.5)" }} />
                    <div>
                      <h3 className="text-sm tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}>
                        HAL Tejas LCA
                      </h3>
                      <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">Indigenous Light Combat Aircraft</p>
                    </div>
                  </div>
                  <div className="divider-mil my-3" />
                  <div className="space-y-1.5">
                    <InfoRow label="Type" value="Light Combat Aircraft" />
                    <InfoRow label="Max Speed" value="Mach 1.8" />
                    <InfoRow label="Range" value="3,000 km" />
                    <InfoRow label="Ceiling" value="15,250 m" />
                  </div>
                  <div className="divider-mil my-3" />
                  <h4 className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}>
                    Armament
                  </h4>
                  <div className="space-y-1.5">
                    <InfoRow label="Cannon" value="23mm GSh-23" />
                    <InfoRow label="BVR" value="Derby / Astra" />
                    <InfoRow label="WVR" value="Python-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxLayer>
    </ParallaxSection>
  );
}
