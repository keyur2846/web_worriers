import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { SectionLabel } from "@/components/ui/section-label";
import { InfoRow } from "@/components/ui/info-row";
import { EquipmentTooltip } from "@/components/ui/equipment-tooltip";
import { ScrollFrameCanvas } from "@/components/ui/scroll-frame-canvas";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;

/**
 * Indian Air Force Section — Full-bleed 240-frame sequence
 * (eye → cockpit → Tejas in flight) with scroll-driven playback.
 *
 * Frames include their own sky background — no compositing needed.
 * Section height: 350vh for smooth 240-frame pacing.
 *
 * Scroll choreography:
 *  Phase 1 (0.00–0.50): Frames play (eye → cockpit → jet flying)
 *  Phase 2 (0.40–0.55): "INDIAN AIR FORCE" heading slides in
 *  Phase 3 (0.55–0.65): Description + equipment panel fade in
 *  Phase 4 (0.60–0.75): Equipment tooltips appear staggered
 *  Phase 5 (0.75–1.00): Static dwell before Navy section
 */
export function AirforceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tooltipAreaRef = useRef<HTMLDivElement>(null);

  const getFrameSrc = useCallback(
    (index: number) =>
      `/images/jet-transition/frame-${String(index + 1).padStart(3, "0")}.jpg`,
    [],
  );

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "80% bottom",
          scrub: 0.5,
          pin: false,
        },
      });

      /* Phase 2 (0.40–0.55): Heading slides in */
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, xPercent: -20 },
          { opacity: 1, xPercent: 0, ease: "power2.out", duration: 0.15 },
          0.4,
        );
      }

      /* Phase 3 (0.55–0.65): Description + panel */
      [descRef, panelRef].forEach((ref) => {
        if (ref.current) {
          tl.fromTo(
            ref.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.10 },
            0.55,
          );
        }
      });

      /* Phase 4 (0.60–0.75): Tooltips stagger in */
      if (tooltipAreaRef.current) {
        const tooltips = tooltipAreaRef.current.querySelectorAll(".tooltip-item");
        tl.fromTo(
          tooltips,
          { opacity: 0, y: 12, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.03, ease: "power2.out", duration: 0.08 },
          0.6,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection
      ref={sectionRef}
      id="airforce"
      className="parallax-section !h-[350vh] !overflow-visible"
    >
      <SectionLabel number="02" title="Indian Air Force" />

      {/* Sticky viewport — pins content while scrolling 350vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Full-bleed frame canvas (frames include sky BG) */}
        <div className="absolute inset-0 z-[1]">
          <ScrollFrameCanvas
            frameCount={FRAME_COUNT}
            getFrameSrc={getFrameSrc}
            triggerRef={sectionRef}
            className="w-full h-full"
          />
        </div>

        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
          }}
        />

        {/* Bottom gradient for info panel */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 50%)",
          }}
        />

        {/* Content overlay — left side */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="h-full flex items-center">
            <div className="pl-6 md:pl-16 max-w-lg flex flex-col gap-5">
              {/* Heading */}
              <div ref={headingRef} style={{ opacity: 0 }}>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.1em] mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#c4a35a",
                    textShadow:
                      "0 0 30px rgba(196,163,90,0.4), 0 2px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  INDIAN
                  <br />
                  AIR FORCE
                </h2>
                <div className="gold-divider w-28" />
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
                  The Indian Air Force is the air arm of the Indian Armed Forces,
                  operating cutting-edge fighter aircraft including the indigenous
                  HAL Tejas. With over 1,500 aircraft, the IAF is the
                  fourth-largest air force in the world.
                </p>
              </div>

              {/* Equipment Panel */}
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
                          style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}
                        >
                          HAL Tejas LCA
                        </h3>
                        <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">
                          Indigenous Light Combat Aircraft
                        </p>
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
                    <h4
                      className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold mb-2"
                      style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}
                    >
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
        </div>

        {/* Equipment tooltips — positioned on the jet (right side of viewport).
             Calibrated to frame 240: jet in flight, centered-right. */}
        <div ref={tooltipAreaRef} className="absolute inset-0 z-[6] pointer-events-none">
          {/* Nose / engine area */}
          <div className="tooltip-item absolute" style={{ top: "30%", right: "15%", opacity: 0 }}>
            <EquipmentTooltip
              label="Max Speed"
              position="right"
              details={[
                { spec: "Speed", value: "Mach 1.8" },
                { spec: "Supercruise", value: "Mach 1.1" },
              ]}
            />
          </div>

          {/* Wing pylon */}
          <div className="tooltip-item absolute" style={{ top: "48%", right: "25%", opacity: 0 }}>
            <EquipmentTooltip
              label="BVR Missile"
              position="right"
              details={[
                { spec: "Type", value: "Derby / Astra" },
                { spec: "Range", value: "80+ km" },
              ]}
            />
          </div>

          {/* Wingtip */}
          <div className="tooltip-item absolute" style={{ top: "55%", right: "8%", opacity: 0 }}>
            <EquipmentTooltip
              label="WVR Missile"
              position="right"
              details={[
                { spec: "Type", value: "Python-5" },
                { spec: "Range", value: "20 km" },
              ]}
            />
          </div>

          {/* Underside */}
          <div className="tooltip-item absolute" style={{ top: "65%", right: "30%", opacity: 0 }}>
            <EquipmentTooltip
              label="GSh-23 Cannon"
              position="right"
              details={[
                { spec: "Caliber", value: "23mm" },
                { spec: "Rate", value: "3,400 rpm" },
              ]}
            />
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
