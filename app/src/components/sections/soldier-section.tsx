import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { ParallaxImage } from "@/components/parallax/parallax-image";
import { SectionLabel } from "@/components/ui/section-label";
import { InfoRow } from "@/components/ui/info-row";
import { EquipmentTooltip } from "@/components/ui/equipment-tooltip";
import { ScrollFrameCanvas } from "@/components/ui/scroll-frame-canvas";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 161;

/* ── Dust particles ── */
function generateDustMotes(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${60 + Math.random() * 40}%`,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 6,
    duration: Math.random() * 5 + 3,
    opacity: Math.random() * 0.3 + 0.1,
  }));
}

const DUST_MOTES = generateDustMotes(10);

/**
 * Indian Army Section — Scroll-driven soldier frame animation.
 *
 * Scroll choreography (section occupies 3x viewport height for pacing):
 *  Phase 1: Soldier centered, zoomed in, saluting — frames play as you scroll
 *  Phase 2: Soldier zooms out + shifts right — full body revealed
 *  Phase 3: "INDIAN ARMY" heading slides in from left
 *  Phase 4: Description text fades in
 *  Phase 5: Equipment info panel slides in
 *  Phase 6: Equipment tooltips appear one by one
 */
export function SoldierSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const soldierWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tooltip1Ref = useRef<HTMLDivElement>(null);
  const tooltip2Ref = useRef<HTMLDivElement>(null);
  const tooltip3Ref = useRef<HTMLDivElement>(null);
  const tooltip4Ref = useRef<HTMLDivElement>(null);

  const getFrameSrc = useCallback(
    (index: number) =>
      `/images/soldier-frames/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`,
    [],
  );

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          pin: false,
        },
      });

      /* Phase 1 (0-0.12): "INDIAN ARMY" heading appears first */
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, xPercent: -30 },
          { opacity: 1, xPercent: 0, ease: "power2.out", duration: 0.12 },
          0,
        );
      }

      /* Phase 2 (0.08-0.25): Soldier fades in — starts zoomed-in showing saluting pose */
      if (soldierWrapRef.current) {
        tl.fromTo(
          soldierWrapRef.current,
          { opacity: 0, scale: 1.8, xPercent: 0 },
          { opacity: 1, scale: 1.8, xPercent: 0, ease: "power2.out", duration: 0.12 },
          0.08,
        );
      }

      /* Phase 3 (0.25-0.5): Soldier zooms out to full body */
      if (soldierWrapRef.current) {
        tl.to(
          soldierWrapRef.current,
          { scale: 1, ease: "power2.out", duration: 0.25 },
          0.25,
        );
      }

      /* Phase 4 (0.5-0.65): Soldier shifts to right side to make room for content */
      if (soldierWrapRef.current) {
        tl.to(
          soldierWrapRef.current,
          { xPercent: 25, ease: "power1.inOut", duration: 0.15 },
          0.5,
        );
      }

      /* Phase 5 (0.65-0.8): ALL content appears at once — description, panel, tooltips */
      const allContent = [descRef, panelRef, tooltip1Ref, tooltip2Ref, tooltip3Ref, tooltip4Ref];
      allContent.forEach((ref) => {
        if (ref.current) {
          tl.fromTo(
            ref.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.15 },
            0.65,
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection
      ref={sectionRef}
      id="soldier"
      className="parallax-section !h-[300vh] !overflow-visible"
    >
      {/* Sticky viewport container — pins content while we scroll through 3x height */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <SectionLabel number="01" title="Indian Army" />

        {/* Background gradient — warm desert, even coverage */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 100% at 60% 50%, #3a2818 0%, #2a2018 40%, #1e1810 70%, #1a1510 100%)",
          }}
        />

        {/* Desert terrain */}
        <div className="absolute inset-0 z-[1]">
          <ParallaxImage
            src="/images/desert-terrain.png"
            alt="Desert terrain landscape"
            objectFit="cover"
            objectPosition="center bottom"
            style={{ opacity: 0.4 }}
          />
        </div>

        {/* Soldier frame animation — centered, wraps for scale/position animation */}
        <div
          ref={soldierWrapRef}
          className="absolute inset-0 z-[3] flex items-center justify-center"
          style={{ transformOrigin: "center 40%", opacity: 0 }}
        >
          <ScrollFrameCanvas
            frameCount={FRAME_COUNT}
            getFrameSrc={getFrameSrc}
            triggerRef={sectionRef}
            className="w-full h-full"
          />
        </div>

        {/* Left side content — overlays on top of soldier */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="h-full flex items-center">
            <div className="pl-6 md:pl-16 max-w-lg flex flex-col gap-5">
              {/* Heading */}
              <div ref={headingRef} style={{ opacity: 0 }}>
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.1em] mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#c4a35a",
                    textShadow:
                      "0 0 30px rgba(196,163,90,0.4), 0 2px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  INDIAN
                  <br />
                  ARMY
                </h2>
                <div className="gold-divider w-32" />
              </div>

              {/* Description */}
              <div ref={descRef} style={{ opacity: 0 }}>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#c8c0b0",
                    textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  The Indian Army is the world's largest standing volunteer force
                  with over 1.4 million active personnel. Its infantry soldiers
                  are equipped with cutting-edge weaponry and protection systems,
                  trained to operate across deserts, mountains, and dense jungles.
                </p>
              </div>

              {/* Equipment Info Panel */}
              <div ref={panelRef} className="pointer-events-auto" style={{ opacity: 0 }}>
                <div className="glass-panel p-5 space-y-3 corner-brackets max-w-sm">
                  <div className="cb-inner">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-1.5 h-4"
                        style={{
                          backgroundColor: "#c4a35a",
                          boxShadow: "0 0 8px rgba(196,163,90,0.5)",
                        }}
                      />
                      <div>
                        <h3
                          className="text-sm tracking-[0.2em] uppercase font-semibold"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "#c4a35a",
                          }}
                        >
                          Infantry Loadout
                        </h3>
                        <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">
                          Modern Combat Equipment
                        </p>
                      </div>
                    </div>
                    <div className="divider-mil my-3" />
                    <div className="space-y-1.5">
                      <InfoRow label="Rifle" value="AK-203 (7.62×39mm)" />
                      <InfoRow label="Rate of Fire" value="700 rpm" />
                      <InfoRow label="Eff. Range" value="800 m" />
                      <InfoRow label="Magazine" value="30 rounds" />
                    </div>
                    <div className="divider-mil my-3" />
                    <div className="space-y-1.5">
                      <InfoRow label="Body Armor" value="BPJ NIJ Level IV" />
                      <InfoRow label="Armor Weight" value="< 7 kg" />
                      <InfoRow label="Helmet" value="Ballistic NIJ IIIA" />
                      <InfoRow label="Comms" value="Tactical PRR" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment tooltips — positioned on right side over soldier */}
        <div className="absolute inset-0 z-[6]">
          <div
            ref={tooltip1Ref}
            className="absolute"
            style={{ top: "12%", right: "25%", opacity: 0 }}
          >
            <EquipmentTooltip
              label="Ballistic Helmet"
              position="right"
              details={[
                { spec: "Protection", value: "NIJ Level IIIA" },
                { spec: "Material", value: "Kevlar Composite" },
                { spec: "Weight", value: "1.4 kg" },
                { spec: "Features", value: "NVG Mount, Rail" },
              ]}
            />
          </div>

          <div
            ref={tooltip2Ref}
            className="absolute"
            style={{ top: "25%", right: "15%", opacity: 0 }}
          >
            <EquipmentTooltip
              label="Tactical Comms"
              position="right"
              details={[
                { spec: "Type", value: "Personal Role Radio" },
                { spec: "Range", value: "500 m (squad)" },
                { spec: "Band", value: "UHF / VHF" },
              ]}
            />
          </div>

          <div
            ref={tooltip3Ref}
            className="absolute"
            style={{ top: "40%", right: "22%", opacity: 0 }}
          >
            <EquipmentTooltip
              label="Body Armor (BPJ)"
              position="right"
              details={[
                { spec: "Protection", value: "NIJ Level IV" },
                { spec: "Stops", value: "7.62mm AP rounds" },
                { spec: "Weight", value: "< 7 kg w/ plates" },
                { spec: "Coverage", value: "360° Torso" },
              ]}
            />
          </div>

          <div
            ref={tooltip4Ref}
            className="absolute"
            style={{ top: "55%", right: "28%", opacity: 0 }}
          >
            <EquipmentTooltip
              label="AK-203 Rifle"
              position="right"
              details={[
                { spec: "Caliber", value: "7.62×39mm" },
                { spec: "Range", value: "800 m effective" },
                { spec: "Rate", value: "700 rpm" },
                { spec: "Weight", value: "4.1 kg (empty)" },
              ]}
            />
          </div>
        </div>

        {/* Foreground sand */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <ParallaxImage
            src="/images/sand-foreground.png"
            alt="Foreground sand"
            objectFit="cover"
            objectPosition="center bottom"
            style={{ top: "auto", bottom: "-5%", height: "30%", opacity: 0.5 }}
          />
        </div>

        {/* Dust particles */}
        <div className="absolute inset-0 z-[7] pointer-events-none">
          {DUST_MOTES.map((m) => (
            <div
              key={m.id}
              className="dust-particle"
              style={{
                left: m.left,
                top: m.top,
                width: `${m.size}px`,
                height: `${m.size}px`,
                backgroundColor: `rgba(210,170,100,${m.opacity})`,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
}
