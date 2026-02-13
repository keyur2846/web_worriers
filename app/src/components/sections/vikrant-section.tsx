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
 * Indian Navy Section — Full-bleed 240-frame sequence
 * (jet landing → carrier zoom-out → INS Vikrant aerial reveal).
 *
 * Frames include their own ocean background — no compositing needed.
 * Section height: 350vh for smooth 240-frame pacing.
 *
 * Scroll choreography:
 *  Phase 1 (0.00–0.50): Frames play (jet landing → carrier reveal)
 *  Phase 2 (0.40–0.55): "INDIAN NAVY" heading slides in
 *  Phase 3 (0.55–0.65): Description + equipment panel fade in
 *  Phase 4 (0.60–0.75): Equipment tooltips appear staggered
 *  Phase 5 (0.75–1.00): Static dwell before Mission Select
 */
export function VikrantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tooltipAreaRef = useRef<HTMLDivElement>(null);

  const getFrameSrc = useCallback(
    (index: number) =>
      `/images/carrier-reveal/frame-${String(index + 1).padStart(3, "0")}.jpg`,
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
      id="vikrant"
      className="parallax-section !h-[350vh] !overflow-visible"
    >
      <SectionLabel number="03" title="Indian Navy" />

      {/* Sticky viewport — pins content while scrolling 350vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Full-bleed frame canvas (frames include ocean BG) */}
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
                  NAVY
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
                  The Indian Navy is the maritime branch of the Indian Armed Forces,
                  safeguarding India's maritime borders and interests across the
                  Indian Ocean. INS Vikrant, India's first indigenous aircraft
                  carrier, represents the nation's growing naval prowess.
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
                          INS Vikrant (IAC-1)
                        </h3>
                        <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">
                          India's First Indigenous Aircraft Carrier
                        </p>
                      </div>
                    </div>
                    <div className="divider-mil my-3" />
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      <InfoRow label="Displacement" value="45,000 tonnes" />
                      <InfoRow label="Length" value="262 meters" />
                      <InfoRow label="Speed" value="28 knots" />
                      <InfoRow label="Aircraft" value="30+ capacity" />
                      <InfoRow label="Defense" value="Barak-8 SAM" />
                      <InfoRow label="CIWS" value="AK-630" />
                    </div>
                    <div className="divider-mil my-3" />
                    <p
                      className="text-center text-[0.65rem] tracking-[0.15em] uppercase"
                      style={{ fontFamily: "var(--font-mono)", color: "#a09880" }}
                    >
                      Commissioned: September 2, 2022
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment tooltips — positioned on carrier.
             Calibrated to frame 240: carrier aerial view, centered. */}
        <div ref={tooltipAreaRef} className="absolute inset-0 z-[6] pointer-events-none">
          {/* Hull */}
          <div className="tooltip-item absolute" style={{ top: "55%", right: "15%", opacity: 0 }}>
            <EquipmentTooltip
              label="Displacement"
              position="right"
              details={[
                { spec: "Full Load", value: "45,000 tonnes" },
                { spec: "Length", value: "262 meters" },
                { spec: "Beam", value: "62 meters" },
              ]}
            />
          </div>

          {/* Flight deck */}
          <div className="tooltip-item absolute" style={{ top: "30%", right: "20%", opacity: 0 }}>
            <EquipmentTooltip
              label="Air Wing"
              position="right"
              details={[
                { spec: "Capacity", value: "30+ Aircraft" },
                { spec: "Fighter", value: "MiG-29K" },
                { spec: "Helo", value: "Ka-31 / MH-60R" },
              ]}
            />
          </div>

          {/* Superstructure */}
          <div className="tooltip-item absolute" style={{ top: "25%", right: "35%", opacity: 0 }}>
            <EquipmentTooltip
              label="Defense Systems"
              position="right"
              details={[
                { spec: "SAM", value: "Barak-8" },
                { spec: "Range", value: "70+ km" },
              ]}
            />
          </div>

          {/* Side mount */}
          <div className="tooltip-item absolute" style={{ top: "45%", right: "10%", opacity: 0 }}>
            <EquipmentTooltip
              label="CIWS"
              position="right"
              details={[
                { spec: "System", value: "AK-630" },
                { spec: "Caliber", value: "30mm" },
                { spec: "Rate", value: "5,000 rpm" },
              ]}
            />
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
