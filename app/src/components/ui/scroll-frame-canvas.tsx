import { useRef, useEffect, useCallback, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameCanvasProps {
  /** Total number of frames (1-indexed file naming) */
  frameCount: number;
  /** Function returning the image URL for a given frame index (0-based) */
  getFrameSrc: (index: number) => string;
  /** CSS class for the canvas container */
  className?: string;
  /** ScrollTrigger trigger element ref — if not provided, uses the canvas container */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** What portion of the scroll drives the frame animation (0-1 range within the timeline) */
  startProgress?: number;
  endProgress?: number;
  /** ScrollTrigger start position — default "top top" for full-range playback */
  scrollStart?: string;
  /** ScrollTrigger end position — default "bottom bottom" for full-range playback */
  scrollEnd?: string;
  /** CSS mix-blend-mode applied to the container div */
  blendMode?: CSSProperties["mixBlendMode"];
  /** CSS filter applied to the container div */
  containerFilter?: string;
}

/**
 * A canvas that plays through a sequence of image frames driven by scroll position.
 * Preloads all frames on mount, then draws the appropriate frame based on
 * GSAP ScrollTrigger progress.
 *
 * Key design choices:
 *  - No `snap` on the GSAP tween — continuous proxy.frame, Math.round picks the frame
 *  - Fallback to nearest loaded frame when target isn't ready yet
 *  - scrub: 0.5 for smooth tracking without overshooting
 */
export function ScrollFrameCanvas({
  frameCount,
  getFrameSrc,
  className,
  triggerRef,
  startProgress = 0,
  endProgress = 1,
  scrollStart = "top top",
  scrollEnd = "bottom bottom",
  blendMode,
  containerFilter,
}: ScrollFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  /** Draw a specific frame index on the canvas */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find the best available frame: target first, then nearest loaded
    let img = framesRef.current[index];
    if (!img?.complete || img.naturalWidth === 0) {
      for (let spread = 1; spread < frameCount; spread++) {
        const before = framesRef.current[index - spread];
        if (before?.complete && before.naturalWidth > 0) { img = before; break; }
        const after = framesRef.current[index + spread];
        if (after?.complete && after.naturalWidth > 0) { img = after; break; }
      }
      if (!img?.complete || img.naturalWidth === 0) return;
    }

    // Match canvas to container's CSS layout size (only resize when needed).
    // IMPORTANT: Use offsetWidth/offsetHeight, NOT getBoundingClientRect().
    // getBoundingClientRect includes parent CSS transforms (scale, translate),
    // causing constant canvas buffer reallocation during GSAP animations
    // which clears the canvas and causes visible flicker.
    const container = containerRef.current;
    if (container) {
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
    }

    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, cw, ch);

    // Cover-fill: draw image to fill the canvas (no black bars)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cw / ch;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      drawH = ch;
      drawW = ch * imgAspect;
      drawX = (cw - drawW) / 2;
      drawY = 0;
    } else {
      drawW = cw;
      drawH = cw / imgAspect;
      drawX = 0;
      drawY = (ch - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [frameCount]);

  /** Preload all frames */
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        if (cancelled) return;
        if (i === 0) {
          drawFrame(0);
        } else if (i === currentFrameRef.current) {
          drawFrame(i);
        }
      };
      images.push(img);
    }

    framesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, [frameCount, getFrameSrc, drawFrame]);

  /** ScrollTrigger drives the frame index */
  useGSAP(
    () => {
      const trigger = triggerRef?.current ?? containerRef.current;
      if (!trigger) return;

      const proxy = { frame: 0 };

      gsap.to(proxy, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: scrollStart,
          end: scrollEnd,
          scrub: 0.5,
        },
        onUpdate: () => {
          const frameIndex = Math.min(
            Math.max(Math.round(proxy.frame), 0),
            frameCount - 1,
          );
          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }
        },
      });
    },
    { dependencies: [frameCount, startProgress, endProgress, scrollStart, scrollEnd, drawFrame] },
  );

  /** Resize canvas on window resize */
  useEffect(() => {
    function handleResize() {
      drawFrame(currentFrameRef.current);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ mixBlendMode: blendMode, filter: containerFilter }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
