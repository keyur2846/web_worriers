import { useRef, useCallback, useState, useEffect } from "react";
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

/* ── Frame sequence constants ── */
const SALUTE_FRAMES = 120;
const EYEZOOM_FRAMES = 40;
const FRAME_COUNT = SALUTE_FRAMES + EYEZOOM_FRAMES; // 160 total
const IMG_W = 2560;
const IMG_H = 1360;
const SOLDIER_SHIFT_X = 20; // xPercent shift when info is visible

/*
 * Frame-to-progress mapping (160 frames, progress 0→1):
 *   frame N = progress N / 159
 *
 * Actual frame content (verified by viewing):
 *   0–30   Saluting, hand lowering — chest-up shot, active movement
 *   30–60  Grabbing rifle, camera zooming out
 *   60–90  Settling into standing pose, full body emerging
 *   90–120 Standing at attention, nearly static
 *   120–130 Same soldier, zoom starts, transparent BG
 *   130–135 Zooming into face, BG darkening
 *   135–160 Face → eye extreme closeup, dark BG
 */

const BODY_ANCHORS = [
  { imgX: 0.48, imgY: 0.11 },
  { imgX: 0.52, imgY: 0.21 },
  { imgX: 0.47, imgY: 0.36 },
  { imgX: 0.40, imgY: 0.46 },
];

const LINE_OFFSETS = [
  { dx: -7, dy: -2 },
  { dx: -9, dy: -1 },
  { dx: -8, dy: 1 },
  { dx: -6, dy: 2 },
];

function anchorToPct(imgXFrac: number, imgYFrac: number, cw: number, ch: number) {
  const imgAspect = IMG_W / IMG_H;
  const cAspect = cw / ch;
  let dw: number, dh: number, dx: number, dy: number;
  if (imgAspect > cAspect) {
    dh = ch; dw = ch * imgAspect;
    dx = (cw - dw) / 2; dy = 0;
  } else {
    dw = cw; dh = cw / imgAspect;
    dx = 0; dy = (ch - dh) / 2;
  }
  return {
    left: ((dx + imgXFrac * dw) / cw) * 100 + SOLDIER_SHIFT_X,
    top: ((dy + imgYFrac * dh) / ch) * 100,
  };
}

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
 * Indian Army Section — 160 frames from ONE continuous video.
 *
 * CRITICAL: The content timeline and frame canvas BOTH use
 * start="top top" / end="bottom bottom" so progress values
 * map 1:1 to frame indices. progress P = frame P×159.
 *
 * Timeline (mapped to actual frame content):
 *  0.00–0.04  Soldier fades in                     (frames 0–6)
 *  0.00–0.06  Heading slides in                    (frames 0–10)
 *  0.04–0.35  Soldier scale 1.2→1.0 (enhances video zoom-out) (frames 6–56)
 *  0.30–0.40  Soldier shifts right                 (frames 48–64, settled pose)
 *  0.38–0.46  Description + panel appear           (frames 61–74)
 *  0.44–0.52  SVG lines draw in                    (frames 70–83)
 *  0.48–0.58  Tooltips stagger in                  (frames 77–93)
 *  0.62–0.68  All info fades out                   (frames 99–109)
 *  0.66–0.73  Soldier re-centers                   (frames 106–117)
 *  0.75–0.86  Desert→dark BG crossfade             (frames 120–138, eye-zoom start)
 *  0.82–0.92  "Through the Eyes" caption flash     (frames 131–147)
 */
export function SoldierSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const soldierWrapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tooltip1Ref = useRef<HTMLDivElement>(null);
  const tooltip2Ref = useRef<HTMLDivElement>(null);
  const tooltip3Ref = useRef<HTMLDivElement>(null);
  const tooltip4Ref = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);
  const desertBgRef = useRef<HTMLDivElement>(null);
  const darkBgRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const terrainRef = useRef<HTMLDivElement>(null);
  const sandRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  const [anchors, setAnchors] = useState<{ left: number; top: number }[]>(
    BODY_ANCHORS.map(() => ({ left: 70, top: 30 })),
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    function recompute() {
      const { clientWidth: cw, clientHeight: ch } = el!;
      setAnchors(BODY_ANCHORS.map((a) => anchorToPct(a.imgX, a.imgY, cw, ch)));
    }
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getFrameSrc = useCallback((index: number) => {
    if (index < SALUTE_FRAMES) {
      return `/images/army-saluting/frame-${String(index + 1).padStart(3, "0")}.png`;
    }
    const eyeIndex = index - SALUTE_FRAMES;
    return `/images/army-eyezoom/frame-${String(eyeIndex + 1).padStart(3, "0")}.png`;
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      /*
       * CRITICAL: Use a single ScrollTrigger onUpdate instead of a GSAP timeline.
       *
       * Previous approach used a gsap.timeline with scrub, but timeline duration
       * is auto-calculated from the last tween end time (e.g. 0.95), so GSAP maps
       * scroll 0→1 to time 0→0.95, skewing ALL position values vs frame progress.
       *
       * This approach reads scroll progress directly and sets element states
       * imperatively, guaranteeing progress P = frame P×159 exactly.
       */
      const els = {
        soldier: soldierWrapRef.current,
        heading: headingRef.current,
        desc: descRef.current,
        panel: panelRef.current,
        tooltips: [tooltip1Ref, tooltip2Ref, tooltip3Ref, tooltip4Ref].map(r => r.current),
        svg: svgOverlayRef.current,
        desertBg: desertBgRef.current,
        darkBg: darkBgRef.current,
        terrain: terrainRef.current,
        sand: sandRef.current,
        dust: dustRef.current,
        caption: captionRef.current,
      };

      // Pre-query SVG sub-elements
      const svgDots = els.svg?.querySelectorAll(".svg-anchor-dot");
      const svgLines = els.svg?.querySelectorAll(".svg-connector-line");

      // Helper: clamp and lerp for smooth transitions within a progress range
      function ramp(progress: number, start: number, end: number): number {
        if (progress <= start) return 0;
        if (progress >= end) return 1;
        return (progress - start) / (end - start);
      }

      // Set initial states
      if (els.soldier) gsap.set(els.soldier, { opacity: 0, scale: 1.2, xPercent: 0 });
      if (els.heading) gsap.set(els.heading, { opacity: 0, xPercent: -30 });
      if (els.desc) gsap.set(els.desc, { opacity: 0, y: 20 });
      if (els.panel) gsap.set(els.panel, { opacity: 0, y: 20 });
      els.tooltips.forEach(t => { if (t) gsap.set(t, { opacity: 0, y: 12, scale: 0.95 }); });
      if (els.svg) gsap.set(els.svg, { opacity: 1 });
      if (svgDots) gsap.set(svgDots, { opacity: 0 });
      if (svgLines) gsap.set(svgLines, { attr: { "stroke-dashoffset": 1 } });
      if (els.darkBg) gsap.set(els.darkBg, { opacity: 0 });
      if (els.caption) gsap.set(els.caption, { opacity: 0, scale: 0.97 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
        onUpdate: (self) => {
          const p = self.progress;

          // ── Soldier wrapper ──
          if (els.soldier) {
            // Fade in: p 0→0.04
            const fadeIn = ramp(p, 0, 0.04);
            // Scale: 1.2→1.0 over p 0.04→0.35
            const zoomOut = ramp(p, 0.04, 0.35);
            const scale = 1.2 - 0.2 * zoomOut;
            // Shift right: p 0.30→0.40, then back: p 0.66→0.73
            const shiftR = ramp(p, 0.30, 0.40);
            const shiftBack = ramp(p, 0.66, 0.73);
            const xPct = SOLDIER_SHIFT_X * shiftR * (1 - shiftBack);

            gsap.set(els.soldier, { opacity: fadeIn, scale, xPercent: xPct });
          }

          // ── Heading ──
          if (els.heading) {
            const show = ramp(p, 0, 0.06);
            const hide = ramp(p, 0.62, 0.68);
            gsap.set(els.heading, {
              opacity: show * (1 - hide),
              xPercent: -30 * (1 - show),
            });
          }

          // ── Description + Panel ──
          [els.desc, els.panel].forEach(el => {
            if (!el) return;
            const show = ramp(p, 0.38, 0.46);
            const hide = ramp(p, 0.62, 0.68);
            gsap.set(el, {
              opacity: show * (1 - hide),
              y: 20 * (1 - show),
            });
          });

          // ── SVG lines + dots ──
          if (els.svg) {
            const show = ramp(p, 0.44, 0.52);
            const hide = ramp(p, 0.62, 0.68);
            const vis = show * (1 - hide);
            if (svgDots) gsap.set(svgDots, { opacity: 0.9 * vis });
            if (svgLines) gsap.set(svgLines, { attr: { "stroke-dashoffset": 1 - show } });
            gsap.set(els.svg, { opacity: 1 - hide });
          }

          // ── Tooltips (staggered) ──
          els.tooltips.forEach((t, i) => {
            if (!t) return;
            const staggerDelay = i * 0.025;
            const show = ramp(p, 0.48 + staggerDelay, 0.54 + staggerDelay);
            const hide = ramp(p, 0.62, 0.68);
            gsap.set(t, {
              opacity: show * (1 - hide),
              y: 12 * (1 - show),
              scale: 0.95 + 0.05 * show,
            });
          });

          // ── Eye-zoom BG crossfade (progress 0.75–0.86) ──
          const bgFade = ramp(p, 0.75, 0.86);
          [els.desertBg, els.terrain, els.sand, els.dust].forEach(el => {
            if (el) gsap.set(el, { opacity: 1 - bgFade });
          });
          if (els.darkBg) gsap.set(els.darkBg, { opacity: bgFade });

          // ── Caption flash (progress 0.82→0.87 in, 0.90→0.95 out) ──
          if (els.caption) {
            const captionIn = ramp(p, 0.82, 0.87);
            const captionOut = ramp(p, 0.90, 0.95);
            gsap.set(els.caption, {
              opacity: captionIn * (1 - captionOut),
              scale: 0.97 + 0.03 * captionIn,
            });
          }
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <ParallaxSection
      ref={sectionRef}
      id="soldier"
      className="parallax-section !h-[400vh] !overflow-visible"
    >
      <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <SectionLabel number="01" title="Indian Army" />

        {/* Desert gradient background */}
        <div
          ref={desertBgRef}
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 100% at 60% 50%, #3a2818 0%, #2a2018 40%, #1e1810 70%, #1a1510 100%)",
          }}
        />

        {/* Dark background (fades in during eye-zoom to match frame BG) */}
        <div
          ref={darkBgRef}
          className="absolute inset-0 z-0"
          style={{ opacity: 0, background: "#0a0a0a" }}
        />

        {/* Desert terrain */}
        <div ref={terrainRef} className="absolute inset-0 z-[1]">
          <ParallaxImage
            src="/images/desert-terrain.png"
            alt="Desert terrain landscape"
            objectFit="cover"
            objectPosition="center bottom"
            style={{ opacity: 0.4 }}
          />
        </div>

        {/* Soldier frame animation — 160 frames continuous */}
        <div
          ref={soldierWrapRef}
          className="absolute inset-0 z-[3] flex items-center justify-center"
          style={{
            transformOrigin: "center 40%",
            opacity: 0,
            filter: "contrast(1.08) brightness(1.02) drop-shadow(0 0 0.3px rgba(0,0,0,0.2))",
          }}
        >
          <ScrollFrameCanvas
            frameCount={FRAME_COUNT}
            getFrameSrc={getFrameSrc}
            triggerRef={sectionRef}
            className="w-full h-full"
          />
        </div>

        {/* Left side content */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <div className="h-full flex items-center">
            <div className="pl-6 md:pl-16 max-w-lg flex flex-col gap-5">
              <div ref={headingRef} style={{ opacity: 0 }}>
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.1em] mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#c4a35a",
                    textShadow: "0 0 30px rgba(196,163,90,0.4), 0 2px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  INDIAN<br />ARMY
                </h2>
                <div className="gold-divider w-32" />
              </div>

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

              <div ref={panelRef} className="pointer-events-auto" style={{ opacity: 0 }}>
                <div className="glass-panel p-5 space-y-3 corner-brackets max-w-sm">
                  <div className="cb-inner">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-1.5 h-4"
                        style={{ backgroundColor: "#c4a35a", boxShadow: "0 0 8px rgba(196,163,90,0.5)" }}
                      />
                      <div>
                        <h3
                          className="text-sm tracking-[0.2em] uppercase font-semibold"
                          style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}
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

        {/* Equipment tooltips */}
        <div className="absolute inset-0 z-[6] pointer-events-none">
          {[
            { ref: tooltip1Ref, anchor: anchors[0], label: "Ballistic Helmet", width: 60, details: [
              { spec: "Protection", value: "NIJ Level IIIA" }, { spec: "Material", value: "Kevlar Composite" },
              { spec: "Weight", value: "1.4 kg" }, { spec: "Features", value: "NVG Mount, Rail" },
            ]},
            { ref: tooltip2Ref, anchor: anchors[1], label: "Tactical Comms", width: 80, details: [
              { spec: "Type", value: "Personal Role Radio" }, { spec: "Range", value: "500 m (squad)" },
              { spec: "Band", value: "UHF / VHF" },
            ]},
            { ref: tooltip3Ref, anchor: anchors[2], label: "Body Armor (BPJ)", width: 65, details: [
              { spec: "Protection", value: "NIJ Level IV" }, { spec: "Stops", value: "7.62mm AP rounds" },
              { spec: "Weight", value: "< 7 kg w/ plates" }, { spec: "Coverage", value: "360° Torso" },
            ]},
            { ref: tooltip4Ref, anchor: anchors[3], label: "AK-203 Rifle", width: 50, details: [
              { spec: "Caliber", value: "7.62×39mm" }, { spec: "Range", value: "800 m effective" },
              { spec: "Rate", value: "700 rpm" }, { spec: "Weight", value: "4.1 kg (empty)" },
            ]},
          ].map(({ ref, anchor, label, width, details }, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${anchor.left}%`, top: `${anchor.top}%`, transform: "translate(-100%, -50%)" }}
            >
              <div ref={ref} style={{ opacity: 0 }}>
                <EquipmentTooltip label={label} position="left" connectorWidth={width} details={details} />
              </div>
            </div>
          ))}
        </div>

        {/* SVG connecting lines */}
        <svg
          ref={svgOverlayRef}
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{ overflow: "visible", filter: "drop-shadow(0 0 2px rgba(196,163,90,0.25))" }}
        >
          {anchors.map((anchor, i) => {
            const endX = anchor.left + LINE_OFFSETS[i].dx;
            const endY = anchor.top + LINE_OFFSETS[i].dy;
            return (
              <g key={i}>
                <line
                  className="svg-connector-line"
                  x1={`${anchor.left}%`} y1={`${anchor.top}%`}
                  x2={`${endX}%`} y2={`${endY}%`}
                  stroke="#c4a35a" strokeWidth="1" strokeOpacity="0.5"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={1}
                />
                <circle
                  className="svg-anchor-dot"
                  cx={`${anchor.left}%`} cy={`${anchor.top}%`}
                  r="4" fill="none" stroke="#c4a35a" strokeWidth="1.5"
                  style={{ opacity: 0 }}
                >
                  <animate attributeName="r" values="4;5.5;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle
                  className="svg-anchor-dot"
                  cx={`${anchor.left}%`} cy={`${anchor.top}%`}
                  r="1.5" fill="#c4a35a" style={{ opacity: 0 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Eye-zoom caption */}
        <div className="absolute inset-0 z-[7] flex items-center justify-center pointer-events-none">
          <div ref={captionRef} className="text-center" style={{ opacity: 0 }}>
            <p
              className="text-xs md:text-sm tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                color: "#c4a35a",
                textShadow: "0 0 20px rgba(196,163,90,0.6), 0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              Through the Eyes of a Warrior
            </p>
          </div>
        </div>

        {/* Foreground sand */}
        <div ref={sandRef} className="absolute inset-0 z-[2] pointer-events-none">
          <ParallaxImage
            src="/images/sand-foreground.png"
            alt="Foreground sand"
            objectFit="cover"
            objectPosition="center bottom"
            style={{ top: "auto", bottom: "-5%", height: "30%", opacity: 0.5 }}
          />
        </div>

        {/* Dust particles */}
        <div ref={dustRef} className="absolute inset-0 z-[8] pointer-events-none">
          {DUST_MOTES.map((m) => (
            <div
              key={m.id}
              className="dust-particle"
              style={{
                left: m.left, top: m.top,
                width: `${m.size}px`, height: `${m.size}px`,
                backgroundColor: `rgba(210,170,100,${m.opacity})`,
                animationDelay: `${m.delay}s`, animationDuration: `${m.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
}
