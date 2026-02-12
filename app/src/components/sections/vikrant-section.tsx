import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { ParallaxLayer } from "@/components/parallax/parallax-layer";
import { ParallaxImage } from "@/components/parallax/parallax-image";
import { SectionLabel } from "@/components/ui/section-label";
import { InfoRow } from "@/components/ui/info-row";
import { EquipmentTooltip } from "@/components/ui/equipment-tooltip";

gsap.registerPlugin(ScrollTrigger);

/**
 * Indian Navy Section — Wide Vikrant aerial view with ocean gradient,
 * equipment hover tooltips, bottom split info.
 */
export function VikrantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const vikrantRef = useRef<HTMLDivElement>(null);
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

      /* Vikrant zooms out from close-up to aerial — starts immediately */
      if (vikrantRef.current) {
        tl.fromTo(
          vikrantRef.current,
          { scale: 1.5, opacity: 0 },
          { scale: 1, opacity: 1, ease: "power2.out", duration: 0.25 },
          0,
        );
      }

      /* Info slides up — follows quickly */
      if (bottomRef.current) {
        const elements = bottomRef.current.querySelectorAll(".content-animate");
        tl.fromTo(
          elements,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.03, ease: "power2.out", duration: 0.15 },
          0.08,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection ref={sectionRef} id="vikrant" className="parallax-section">
      <SectionLabel number="03" title="Indian Navy" />

      {/* Layer 1 — Deep ocean gradient */}
      <ParallaxLayer speed={-0.5} className="z-0">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(to bottom, #1a3a5a 0%, #0f2844 30%, #0a1e38 60%, #0a1628 100%)",
          }}
        />
      </ParallaxLayer>

      {/* Layer 2 — Ocean surface overlay */}
      <ParallaxImage
        src="/images/ocean-surface.png"
        alt="Deep ocean waves"
        speed={-0.35}
        className="z-[1]"
        objectFit="cover"
        style={{ opacity: 0.5 }}
      />

      {/* Layer 3 — INS Vikrant (wide aerial view) with tooltips */}
      <ParallaxLayer speed={-0.15} className="z-[2]">
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <div
            ref={vikrantRef}
            className="relative"
            style={{
              width: "80%",
              maxWidth: "900px",
              transformOrigin: "center center",
              opacity: 0,
            }}
          >
            <img
              src="/images/vikrant-aerial.png"
              alt="INS Vikrant aircraft carrier aerial view"
              className="scene-image w-full h-auto object-contain"
              style={{
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
              }}
            />

            {/* Equipment tooltips on carrier */}
            <div className="absolute top-[15%] left-[5%]">
              <EquipmentTooltip
                label="Displacement"
                position="left"
                details={[
                  { spec: "Full Load", value: "45,000 tonnes" },
                  { spec: "Length", value: "262 meters" },
                  { spec: "Beam", value: "62 meters" },
                ]}
              />
            </div>

            <div className="absolute top-[25%] right-[5%]">
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

            <div className="absolute top-[50%] left-[8%]">
              <EquipmentTooltip
                label="Defense Systems"
                position="left"
                details={[
                  { spec: "SAM", value: "Barak-8" },
                  { spec: "Range", value: "70+ km" },
                ]}
              />
            </div>

            <div className="absolute top-[60%] right-[10%]">
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
      </ParallaxLayer>

      {/* Layer 4 — Wake trail */}
      <ParallaxLayer speed={-0.1} className="z-[1] pointer-events-none">
        <div
          className="absolute"
          style={{
            top: "60%",
            left: "50%",
            width: "180px",
            height: "300px",
            transform: "translateX(-50%)",
            transformOrigin: "top center",
          }}
        >
          <div
            className="w-full h-full"
            style={{
              clipPath: "polygon(50% 0%, 15% 100%, 85% 100%)",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(180,210,240,0.15) 40%, transparent 80%)",
            }}
          />
        </div>
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
                INDIAN NAVY
              </h2>
              <div className="gold-divider w-28 mb-3" />
              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ fontFamily: "var(--font-body)", color: "#c8c0b0" }}
              >
                The Indian Navy is the maritime branch of the Indian Armed Forces,
                safeguarding India's maritime borders and interests across the Indian Ocean.
                INS Vikrant, India's first indigenous aircraft carrier, represents the
                nation's growing naval prowess and self-reliance in defense manufacturing.
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
                        INS Vikrant (IAC-1)
                      </h3>
                      <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">India's First Indigenous Aircraft Carrier</p>
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
      </ParallaxLayer>
    </ParallaxSection>
  );
}
