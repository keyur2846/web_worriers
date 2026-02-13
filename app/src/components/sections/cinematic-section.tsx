import { useRef, useCallback, useState, useEffect } from "react";
import { getPreloadedFrames, usePreloadStore } from "@/stores/preload-store";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ParallaxSection } from "@/components/parallax/parallax-section";
import { ParallaxImage } from "@/components/parallax/parallax-image";
import { InfoRow } from "@/components/ui/info-row";
import { EquipmentTooltip } from "@/components/ui/equipment-tooltip";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════
   Constants & Zone Definitions
   ═══════════════════════════════════════════════════════════════════ */

const TOTAL_FRAMES = 640;
const IMG_W = 1280;
const IMG_H = 720;
const SOLDIER_SHIFT_X = 20;

/** Zone heights in vh — defines scroll budget per zone */
const Z = {
  heroIntro: 100,
  heroFade: 50,
  armySalute: 300,
  armyDwell: 100,
  armyFade: 30,
  eyeZoom: 100,
  eyeToJet: 50,
  jet: 450,
  afDwell: 100,
  afFade: 30,
  carrier: 500,
  navyDwell: 100,
  navyFade: 70,
} as const;

const TOTAL_VH = Object.values(Z).reduce((s, v) => s + v, 0); // 1980

/** Pre-computed progress boundaries for each zone */
function computeBounds() {
  const keys = Object.keys(Z) as (keyof typeof Z)[];
  const out = {} as Record<keyof typeof Z, { s: number; e: number }>;
  let cum = 0;
  for (const k of keys) {
    const vh = Z[k];
    out[k] = { s: cum / TOTAL_VH, e: (cum + vh) / TOTAL_VH };
    cum += vh;
  }
  return out;
}
const B = computeBounds();

/* ═══════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════ */



function progressToFrame(p: number): number {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
  const local = (start: number, end: number) => (p - start) / (end - start);

  if (p <= B.heroFade.e) return 0; // frozen during hero intro + fade
  if (p <= B.armySalute.e) return Math.round(lerp(0, 119, local(B.armySalute.s, B.armySalute.e)));
  if (p <= B.armyFade.e) return 119;
  if (p <= B.eyeZoom.e) return Math.round(lerp(120, 159, local(B.eyeZoom.s, B.eyeZoom.e)));
  if (p <= B.eyeToJet.e) return 159; // frozen during crossfade
  if (p <= B.jet.e) return Math.round(lerp(160, 399, local(B.jet.s, B.jet.e)));
  if (p <= B.afFade.e) return 399;
  if (p <= B.carrier.e) return Math.round(lerp(400, 639, local(B.carrier.s, B.carrier.e)));
  return 639;
}

function ramp(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/* ── Army tooltip anchor math ── */
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
    dh = ch; dw = ch * imgAspect; dx = (cw - dw) / 2; dy = 0;
  } else {
    dw = cw; dh = cw / imgAspect; dx = 0; dy = (ch - dh) / 2;
  }
  return {
    left: ((dx + imgXFrac * dw) / cw) * 100 + SOLDIER_SHIFT_X,
    top: ((dy + imgYFrac * dh) / ch) * 100,
  };
}

function makeDustMotes(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${60 + Math.random() * 40}%`,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 6,
    duration: Math.random() * 5 + 3,
    opacity: Math.random() * 0.3 + 0.1,
  }));
}
const DUST_MOTES = makeDustMotes(10);

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */

export function CinematicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(0);
  const isLoaded = usePreloadStore((s) => s.isLoaded);

  // Hero layers
  const flagVideoRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Backgrounds
  const desertBgRef = useRef<HTMLDivElement>(null);
  const darkBgRef = useRef<HTMLDivElement>(null);
  const terrainRef = useRef<HTMLDivElement>(null);
  const sandRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  // Gradient overlays (for jet/carrier text legibility)
  const leftGradRef = useRef<HTMLDivElement>(null);
  const bottomGradRef = useRef<HTMLDivElement>(null);

  // Army info refs
  const armyHeadingRef = useRef<HTMLDivElement>(null);
  const armyDescRef = useRef<HTMLDivElement>(null);
  const armyPanelRef = useRef<HTMLDivElement>(null);
  const armyTip1 = useRef<HTMLDivElement>(null);
  const armyTip2 = useRef<HTMLDivElement>(null);
  const armyTip3 = useRef<HTMLDivElement>(null);
  const armyTip4 = useRef<HTMLDivElement>(null);
  const armySvgRef = useRef<SVGSVGElement>(null);

  // AF info refs
  const afHeadingRef = useRef<HTMLDivElement>(null);
  const afDescRef = useRef<HTMLDivElement>(null);
  const afPanelRef = useRef<HTMLDivElement>(null);
  const afTooltipAreaRef = useRef<HTMLDivElement>(null);

  // Navy info refs
  const navyHeadingRef = useRef<HTMLDivElement>(null);
  const navyDescRef = useRef<HTMLDivElement>(null);
  const navyPanelRef = useRef<HTMLDivElement>(null);
  const navyTooltipAreaRef = useRef<HTMLDivElement>(null);


  // Anchor positions for army SVG lines
  const [anchors, setAnchors] = useState(
    BODY_ANCHORS.map(() => ({ left: 70, top: 30 })),
  );

  /* ── Canvas drawing (supports optional crossfade between two frames) ── */
  const resolveImg = useCallback((index: number): HTMLImageElement | null => {
    const frames = getPreloadedFrames();
    const img = frames[index];
    if (img?.complete && img.naturalWidth > 0) return img;
    for (let spread = 1; spread < TOTAL_FRAMES; spread++) {
      const before = frames[index - spread];
      if (before?.complete && before.naturalWidth > 0) return before;
      const after = frames[index + spread];
      if (after?.complete && after.naturalWidth > 0) return after;
    }
    return null;
  }, []);

  const ensureCanvasSize = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const container = viewportRef.current;
    if (!container) return;
    const dpr = window.devicePixelRatio || 1;
    const layoutW = container.offsetWidth;
    const layoutH = container.offsetHeight;
    const targetW = Math.round(layoutW * dpr);
    const targetH = Math.round(layoutH * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${layoutW}px`;
      canvas.style.height = `${layoutH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const coverFill = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) => {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cw / ch;
    let drawW: number, drawH: number, drawX: number, drawY: number;
    if (imgAspect > canvasAspect) {
      drawH = ch; drawW = ch * imgAspect;
      drawX = (cw - drawW) / 2; drawY = 0;
    } else {
      drawW = cw; drawH = cw / imgAspect;
      drawX = 0; drawY = (ch - drawH) / 2;
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const drawFrame = useCallback((index: number, crossfade?: { inIndex: number; t: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ensureCanvasSize(canvas, ctx);
    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, cw, ch);

    if (crossfade) {
      const { inIndex, t } = crossfade;
      // Smoothstep easing for natural-feeling dissolve
      const eased = t * t * (3 - 2 * t);
      // Subtle brightness dip at midpoint — "passing through darkness"
      const envelope = 1 - 0.15 * Math.sin(eased * Math.PI);

      const outImg = resolveImg(index);
      const inImg = resolveImg(inIndex);
      if (outImg) {
        ctx.globalAlpha = (1 - eased) * envelope;
        coverFill(ctx, outImg, cw, ch);
      }
      if (inImg) {
        ctx.globalAlpha = eased * envelope;
        coverFill(ctx, inImg, cw, ch);
      }
      ctx.globalAlpha = 1;
    } else {
      const img = resolveImg(index);
      if (!img) return;
      coverFill(ctx, img, cw, ch);
    }
  }, [resolveImg, ensureCanvasSize, coverFill]);

  /* ── Draw first frame once preloaded frames arrive ── */
  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  /* ── Anchor computation for army SVG lines ── */
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

  /* ── Master scroll handler ── */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const svgDots = armySvgRef.current?.querySelectorAll(".svg-anchor-dot");
      const svgLines = armySvgRef.current?.querySelectorAll(".svg-connector-line");
      const armyTips = [armyTip1, armyTip2, armyTip3, armyTip4].map((r) => r.current);

      // Initial states — canvas + hero visible from the start
      gsap.set(canvasWrapRef.current, { opacity: 1, scale: 1.2, xPercent: 0 });
      if (desertBgRef.current) gsap.set(desertBgRef.current, { opacity: 0 });
      if (terrainRef.current) gsap.set(terrainRef.current, { opacity: 0 });
      if (sandRef.current) gsap.set(sandRef.current, { opacity: 0 });
      if (dustRef.current) gsap.set(dustRef.current, { opacity: 0 });
      [armyHeadingRef, armyDescRef, armyPanelRef, afHeadingRef, afDescRef, afPanelRef,
        navyHeadingRef, navyDescRef, navyPanelRef].forEach((r) => {
        if (r.current) gsap.set(r.current, { opacity: 0 });
      });
      armyTips.forEach((t) => { if (t) gsap.set(t, { opacity: 0, y: 12, scale: 0.95 }); });
      if (afTooltipAreaRef.current) gsap.set(afTooltipAreaRef.current.querySelectorAll(".tooltip-item"), { opacity: 0, y: 12, scale: 0.95 });
      if (navyTooltipAreaRef.current) gsap.set(navyTooltipAreaRef.current.querySelectorAll(".tooltip-item"), { opacity: 0, y: 12, scale: 0.95 });
      if (svgDots) gsap.set(svgDots, { opacity: 0 });
      if (svgLines) gsap.set(svgLines, { attr: { "stroke-dashoffset": 1 } });
      if (darkBgRef.current) gsap.set(darkBgRef.current, { opacity: 0 });
      if (leftGradRef.current) gsap.set(leftGradRef.current, { opacity: 0 });
      if (bottomGradRef.current) gsap.set(bottomGradRef.current, { opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
        onUpdate: (self) => {
          const p = self.progress;

          /* ── 1. Frame drawing (with eye→jet crossfade) ── */
          const inCrossfade = p >= B.eyeToJet.s && p <= B.eyeToJet.e;
          if (inCrossfade) {
            const t = ramp(p, B.eyeToJet.s, B.eyeToJet.e);
            drawFrame(159, { inIndex: 160, t });
            currentFrameRef.current = -1; // force redraw when exiting crossfade
          } else {
            const frameIndex = progressToFrame(p);
            if (frameIndex !== currentFrameRef.current) {
              currentFrameRef.current = frameIndex;
              drawFrame(frameIndex);
            }
          }



          /* ── 2. Hero layers (flag video + text fade out) ── */
          {
            const textFade = ramp(p, B.heroIntro.e * 0.8, B.heroFade.s + (B.heroFade.e - B.heroFade.s) * 0.4);
            const flagFade = ramp(p, B.heroFade.s, B.heroFade.e);
            if (heroTextRef.current) {
              gsap.set(heroTextRef.current, { opacity: 1 - textFade, y: -40 * textFade });
            }
            if (flagVideoRef.current) {
              gsap.set(flagVideoRef.current, { opacity: 1 - flagFade });
            }
          }

          /* ── 3. Canvas wrapper transforms (zoom out starts during heroFade) ── */
          if (canvasWrapRef.current) {
            const zoomOut = ramp(p, B.heroFade.s, B.armySalute.e * 0.65);
            const scale = 1.2 - 0.2 * zoomOut;
            const shiftR = ramp(p, B.armySalute.e - 0.03, B.armySalute.e);
            const shiftBack = ramp(p, B.armyFade.s, B.armyFade.e);
            const xPct = SOLDIER_SHIFT_X * shiftR * (1 - shiftBack);
            gsap.set(canvasWrapRef.current, { scale, xPercent: xPct });
          }

          /* ── 4. Backgrounds (desert fades in during heroFade, out during eye-zoom) ── */
          {
            const desertIn = ramp(p, B.heroFade.s, B.heroFade.e);
            const desertOut = ramp(p, B.armyFade.s, B.eyeZoom.s + 0.02);
            const desertOp = desertIn * (1 - desertOut);
            [desertBgRef, terrainRef, sandRef, dustRef].forEach((r) => {
              if (r.current) gsap.set(r.current, { opacity: desertOp });
            });
            if (darkBgRef.current) gsap.set(darkBgRef.current, { opacity: desertOut });
          }

          /* ── 5. Gradient overlays (visible during jet/carrier for text legibility) ── */
          const gradShow = ramp(p, B.eyeZoom.e - 0.02, B.jet.s + 0.02);
          const gradHide = ramp(p, B.navyFade.s, B.navyFade.e);
          const gradOp = gradShow * (1 - gradHide);
          if (leftGradRef.current) gsap.set(leftGradRef.current, { opacity: gradOp });
          if (bottomGradRef.current) gsap.set(bottomGradRef.current, { opacity: gradOp });

          /* ── 6. Army info (during armyDwell, fades during armyFade) ── */
          {
            const ds = B.armyDwell.s;
            const de = B.armyDwell.e;
            const fe = B.armyFade.e;
            const r_ = de - ds; // dwell range

            const hd = ramp(p, ds, ds + r_ * 0.2);
            const dc = ramp(p, ds + r_ * 0.15, ds + r_ * 0.35);
            const sv = ramp(p, ds + r_ * 0.3, ds + r_ * 0.55);
            const fo = ramp(p, de, fe);

            if (armyHeadingRef.current) {
              gsap.set(armyHeadingRef.current, { opacity: hd * (1 - fo), xPercent: -30 * (1 - hd) });
            }
            [armyDescRef, armyPanelRef].forEach((ref) => {
              if (ref.current) gsap.set(ref.current, { opacity: dc * (1 - fo), y: 20 * (1 - dc) });
            });
            if (svgDots) gsap.set(svgDots, { opacity: 0.9 * sv * (1 - fo) });
            if (svgLines) gsap.set(svgLines, { attr: { "stroke-dashoffset": 1 - sv } });
            if (armySvgRef.current) gsap.set(armySvgRef.current, { opacity: 1 - fo });
            armyTips.forEach((t, i) => {
              if (!t) return;
              const st = i * 0.02;
              const sh = ramp(p, ds + r_ * (0.35 + st), ds + r_ * (0.55 + st));
              gsap.set(t, { opacity: sh * (1 - fo), y: 12 * (1 - sh), scale: 0.95 + 0.05 * sh });
            });
          }

          /* ── 7. Air Force info (during afDwell, fades during afFade) ── */
          {
            const ds = B.afDwell.s;
            const de = B.afDwell.e;
            const fe = B.afFade.e;
            const r_ = de - ds;

            const hd = ramp(p, ds, ds + r_ * 0.2);
            const dc = ramp(p, ds + r_ * 0.15, ds + r_ * 0.35);
            const fo = ramp(p, de, fe);

            if (afHeadingRef.current) {
              gsap.set(afHeadingRef.current, { opacity: hd * (1 - fo), xPercent: -20 * (1 - hd) });
            }
            [afDescRef, afPanelRef].forEach((ref) => {
              if (ref.current) gsap.set(ref.current, { opacity: dc * (1 - fo), y: 20 * (1 - dc) });
            });
            if (afTooltipAreaRef.current) {
              afTooltipAreaRef.current.querySelectorAll(".tooltip-item").forEach((t, i) => {
                const st = i * 0.02;
                const sh = ramp(p, ds + r_ * (0.3 + st), ds + r_ * (0.55 + st));
                gsap.set(t, { opacity: sh * (1 - fo), y: 12 * (1 - sh), scale: 0.95 + 0.05 * sh });
              });
            }
          }

          /* ── 8. Navy info (during navyDwell, fades during navyFade) ── */
          {
            const ds = B.navyDwell.s;
            const de = B.navyDwell.e;
            const fe = B.navyFade.e;
            const r_ = de - ds;

            const hd = ramp(p, ds, ds + r_ * 0.2);
            const dc = ramp(p, ds + r_ * 0.15, ds + r_ * 0.35);
            const fo = ramp(p, de, fe);

            if (navyHeadingRef.current) {
              gsap.set(navyHeadingRef.current, { opacity: hd * (1 - fo), xPercent: -20 * (1 - hd) });
            }
            [navyDescRef, navyPanelRef].forEach((ref) => {
              if (ref.current) gsap.set(ref.current, { opacity: dc * (1 - fo), y: 20 * (1 - dc) });
            });
            if (navyTooltipAreaRef.current) {
              navyTooltipAreaRef.current.querySelectorAll(".tooltip-item").forEach((t, i) => {
                const st = i * 0.02;
                const sh = ramp(p, ds + r_ * (0.3 + st), ds + r_ * (0.55 + st));
                gsap.set(t, { opacity: sh * (1 - fo), y: 12 * (1 - sh), scale: 0.95 + 0.05 * sh });
              });
            }
          }


        },
      });
    },
    { scope: sectionRef },
  );

  /* ── Resize → redraw current frame ── */
  useEffect(() => {
    const h = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [drawFrame]);

  /* ═══════════════════════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <ParallaxSection
      ref={sectionRef}
      id="cinematic"
      className="parallax-section !h-[1980vh] !overflow-visible"
    >
      <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Hero: Flag video background ── */}
        <div ref={flagVideoRef} className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/waving_flag.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </div>

        {/* ── Backgrounds (hidden initially, fade in during heroFade) ── */}
        <div
          ref={desertBgRef}
          className="absolute inset-0 z-0"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 120% 100% at 60% 50%, #3a2818 0%, #2a2018 40%, #1e1810 70%, #1a1510 100%)",
          }}
        />
        <div
          ref={darkBgRef}
          className="absolute inset-0 z-0"
          style={{ opacity: 0, background: "#0a0a0a" }}
        />

        {/* Desert terrain (army atmosphere) */}
        <div ref={terrainRef} className="absolute inset-0 z-[1]">
          <ParallaxImage
            src="/images/desert-terrain.png"
            alt="Desert terrain"
            objectFit="cover"
            objectPosition="center bottom"
            style={{ opacity: 0.4 }}
          />
        </div>

        {/* Sand foreground */}
        <div ref={sandRef} className="absolute inset-0 z-[2] pointer-events-none">
          <ParallaxImage
            src="/images/sand-foreground.png"
            alt="Sand"
            objectFit="cover"
            objectPosition="center bottom"
            style={{ top: "auto", bottom: "-5%", height: "30%", opacity: 0.5 }}
          />
        </div>

        {/* ── Canvas ── */}
        <div
          ref={canvasWrapRef}
          className="absolute inset-0 z-[3] flex items-center justify-center"
          style={{
            transformOrigin: "center 40%",
            opacity: 0,
            filter: "contrast(1.08) brightness(1.02) drop-shadow(0 0 0.3px rgba(0,0,0,0.2))",
          }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* ── Gradient overlays for text legibility (jet/carrier) ── */}
        <div
          ref={leftGradRef}
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            opacity: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
          }}
        />
        <div
          ref={bottomGradRef}
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            opacity: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 50%)",
          }}
        />

        {/* ── Army SVG connector lines ── */}
        <svg
          ref={armySvgRef}
          className="absolute inset-0 z-[5] pointer-events-none"
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
                <circle className="svg-anchor-dot" cx={`${anchor.left}%`} cy={`${anchor.top}%`} r="1.5" fill="#c4a35a" style={{ opacity: 0 }} />
              </g>
            );
          })}
        </svg>

        {/* ═══════ ARMY INFO ═══════ */}
        <div className="absolute inset-0 z-[6] pointer-events-none">
          <div className="h-full flex items-center">
            <div className="pl-6 md:pl-16 max-w-lg flex flex-col gap-5">
              <div ref={armyHeadingRef} style={{ opacity: 0 }}>
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.1em] mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "#c4a35a", textShadow: "0 0 30px rgba(196,163,90,0.4), 0 2px 8px rgba(0,0,0,0.8)" }}
                >INDIAN<br />ARMY</h2>
                <div className="gold-divider w-32" />
              </div>

              <div ref={armyDescRef} style={{ opacity: 0 }}>
                <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#c8c0b0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  The Indian Army is the world&apos;s largest standing volunteer force with over 1.4 million active personnel. Its infantry soldiers are equipped with cutting-edge weaponry and protection systems, trained to operate across deserts, mountains, and dense jungles.
                </p>
              </div>

              <div ref={armyPanelRef} className="pointer-events-auto" style={{ opacity: 0 }}>
                <div className="glass-panel p-5 space-y-3 corner-brackets max-w-sm">
                  <div className="cb-inner">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-1.5 h-4" style={{ backgroundColor: "#c4a35a", boxShadow: "0 0 8px rgba(196,163,90,0.5)" }} />
                      <div>
                        <h3 className="text-sm tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}>Infantry Loadout</h3>
                        <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">Modern Combat Equipment</p>
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

        {/* Army equipment tooltips */}
        <div className="absolute inset-0 z-[7] pointer-events-none">
          {[
            { ref: armyTip1, anchor: anchors[0], label: "Ballistic Helmet", width: 60, details: [
              { spec: "Protection", value: "NIJ Level IIIA" }, { spec: "Material", value: "Kevlar Composite" },
              { spec: "Weight", value: "1.4 kg" }, { spec: "Features", value: "NVG Mount, Rail" },
            ]},
            { ref: armyTip2, anchor: anchors[1], label: "Tactical Comms", width: 80, details: [
              { spec: "Type", value: "Personal Role Radio" }, { spec: "Range", value: "500 m (squad)" },
              { spec: "Band", value: "UHF / VHF" },
            ]},
            { ref: armyTip3, anchor: anchors[2], label: "Body Armor (BPJ)", width: 65, details: [
              { spec: "Protection", value: "NIJ Level IV" }, { spec: "Stops", value: "7.62mm AP rounds" },
              { spec: "Weight", value: "< 7 kg w/ plates" }, { spec: "Coverage", value: "360° Torso" },
            ]},
            { ref: armyTip4, anchor: anchors[3], label: "AK-203 Rifle", width: 50, details: [
              { spec: "Caliber", value: "7.62×39mm" }, { spec: "Range", value: "800 m effective" },
              { spec: "Rate", value: "700 rpm" }, { spec: "Weight", value: "4.1 kg (empty)" },
            ]},
          ].map(({ ref, anchor, label, width, details }, i) => (
            <div key={i} className="absolute" style={{ left: `${anchor.left}%`, top: `${anchor.top}%`, transform: "translate(-100%, -50%)" }}>
              <div ref={ref} style={{ opacity: 0 }}>
                <EquipmentTooltip label={label} position="left" connectorWidth={width} details={details} />
              </div>
            </div>
          ))}
        </div>

        {/* ═══════ AIR FORCE INFO ═══════ */}
        <div className="absolute inset-0 z-[6] pointer-events-none">
          <div className="h-full flex items-center">
            <div className="pl-6 md:pl-16 max-w-lg flex flex-col gap-5">
              <div ref={afHeadingRef} style={{ opacity: 0 }}>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.1em] mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "#c4a35a", textShadow: "0 0 30px rgba(196,163,90,0.4), 0 2px 8px rgba(0,0,0,0.8)" }}
                >INDIAN<br />AIR FORCE</h2>
                <div className="gold-divider w-28" />
              </div>

              <div ref={afDescRef} style={{ opacity: 0 }}>
                <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#c8c0b0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  The Indian Air Force is the air arm of the Indian Armed Forces, operating cutting-edge fighter aircraft including the indigenous HAL Tejas. With over 1,500 aircraft, the IAF is the fourth-largest air force in the world.
                </p>
              </div>

              <div ref={afPanelRef} className="pointer-events-auto" style={{ opacity: 0 }}>
                <div className="glass-panel p-5 space-y-3 corner-brackets max-w-sm">
                  <div className="cb-inner">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-1.5 h-4" style={{ backgroundColor: "#c4a35a", boxShadow: "0 0 8px rgba(196,163,90,0.5)" }} />
                      <div>
                        <h3 className="text-sm tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}>HAL Tejas LCA</h3>
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
                    <h4 className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}>Armament</h4>
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

        {/* AF tooltips */}
        <div ref={afTooltipAreaRef} className="absolute inset-0 z-[7] pointer-events-none">
          <div className="tooltip-item absolute" style={{ top: "30%", right: "15%", opacity: 0 }}>
            <EquipmentTooltip label="Max Speed" position="right" details={[{ spec: "Speed", value: "Mach 1.8" }, { spec: "Supercruise", value: "Mach 1.1" }]} />
          </div>
          <div className="tooltip-item absolute" style={{ top: "48%", right: "25%", opacity: 0 }}>
            <EquipmentTooltip label="BVR Missile" position="right" details={[{ spec: "Type", value: "Derby / Astra" }, { spec: "Range", value: "80+ km" }]} />
          </div>
          <div className="tooltip-item absolute" style={{ top: "55%", right: "8%", opacity: 0 }}>
            <EquipmentTooltip label="WVR Missile" position="right" details={[{ spec: "Type", value: "Python-5" }, { spec: "Range", value: "20 km" }]} />
          </div>
          <div className="tooltip-item absolute" style={{ top: "65%", right: "30%", opacity: 0 }}>
            <EquipmentTooltip label="GSh-23 Cannon" position="right" details={[{ spec: "Caliber", value: "23mm" }, { spec: "Rate", value: "3,400 rpm" }]} />
          </div>
        </div>

        {/* ═══════ NAVY INFO ═══════ */}
        <div className="absolute inset-0 z-[6] pointer-events-none">
          <div className="h-full flex items-center">
            <div className="pl-6 md:pl-16 max-w-lg flex flex-col gap-5">
              <div ref={navyHeadingRef} style={{ opacity: 0 }}>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.1em] mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "#c4a35a", textShadow: "0 0 30px rgba(196,163,90,0.4), 0 2px 8px rgba(0,0,0,0.8)" }}
                >INDIAN<br />NAVY</h2>
                <div className="gold-divider w-28" />
              </div>

              <div ref={navyDescRef} style={{ opacity: 0 }}>
                <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#c8c0b0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  The Indian Navy is the maritime branch of the Indian Armed Forces, safeguarding India&apos;s maritime borders and interests across the Indian Ocean. INS Vikrant, India&apos;s first indigenous aircraft carrier, represents the nation&apos;s growing naval prowess.
                </p>
              </div>

              <div ref={navyPanelRef} className="pointer-events-auto" style={{ opacity: 0 }}>
                <div className="glass-panel p-5 space-y-3 corner-brackets max-w-sm">
                  <div className="cb-inner">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-1.5 h-4" style={{ backgroundColor: "#c4a35a", boxShadow: "0 0 8px rgba(196,163,90,0.5)" }} />
                      <div>
                        <h3 className="text-sm tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#c4a35a" }}>INS Vikrant (IAC-1)</h3>
                        <p className="mono-readout text-[var(--color-text-muted)] text-[0.65rem] mt-0.5">India&apos;s First Indigenous Aircraft Carrier</p>
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
                    <p className="text-center text-[0.65rem] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "#a09880" }}>
                      Commissioned: September 2, 2022
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navy tooltips */}
        <div ref={navyTooltipAreaRef} className="absolute inset-0 z-[7] pointer-events-none">
          <div className="tooltip-item absolute" style={{ top: "55%", right: "15%", opacity: 0 }}>
            <EquipmentTooltip label="Displacement" position="right" details={[{ spec: "Full Load", value: "45,000 tonnes" }, { spec: "Length", value: "262 meters" }, { spec: "Beam", value: "62 meters" }]} />
          </div>
          <div className="tooltip-item absolute" style={{ top: "30%", right: "20%", opacity: 0 }}>
            <EquipmentTooltip label="Air Wing" position="right" details={[{ spec: "Capacity", value: "30+ Aircraft" }, { spec: "Fighter", value: "MiG-29K" }, { spec: "Helo", value: "Ka-31 / MH-60R" }]} />
          </div>
          <div className="tooltip-item absolute" style={{ top: "25%", right: "35%", opacity: 0 }}>
            <EquipmentTooltip label="Defense Systems" position="right" details={[{ spec: "SAM", value: "Barak-8" }, { spec: "Range", value: "70+ km" }]} />
          </div>
          <div className="tooltip-item absolute" style={{ top: "45%", right: "10%", opacity: 0 }}>
            <EquipmentTooltip label="CIWS" position="right" details={[{ spec: "System", value: "AK-630" }, { spec: "Caliber", value: "30mm" }, { spec: "Rate", value: "5,000 rpm" }]} />
          </div>
        </div>


        {/* ── Hero text overlay ── */}
        <div className="absolute inset-0 z-[8] pointer-events-none">
          <div ref={heroTextRef} className="h-full flex flex-col items-center justify-center text-center px-4">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.12em] leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "#c4a35a",
                textShadow: "0 0 40px rgba(196,163,90,0.35), 0 2px 12px rgba(0,0,0,0.9)",
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
        </div>

        {/* ── Dust particles (army atmosphere) ── */}
        <div ref={dustRef} className="absolute inset-0 z-[9] pointer-events-none">
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
