import { useRef, useEffect, useCallback } from "react";
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
}

/**
 * A canvas that plays through a sequence of image frames driven by scroll position.
 * Preloads all frames on mount, then draws the appropriate frame based on
 * GSAP ScrollTrigger progress.
 */
export function ScrollFrameCanvas({
  frameCount,
  getFrameSrc,
  className,
  triggerRef,
  startProgress = 0,
  endProgress = 1,
}: ScrollFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const loadedCountRef = useRef(0);

  /** Draw a specific frame index on the canvas */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = framesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Match canvas to container size
    const container = containerRef.current;
    if (container) {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
      }
    }

    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, cw, ch);

    // Draw image to fill (cover) the canvas — no black bars
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cw / ch;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      // Image is wider — match height, crop sides
      drawH = ch;
      drawW = ch * imgAspect;
      drawX = (cw - drawW) / 2;
      drawY = 0;
    } else {
      // Image is taller — match width, crop top/bottom
      drawW = cw;
      drawH = cw / imgAspect;
      drawX = 0;
      drawY = (ch - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /** Preload all frames */
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCountRef.current++;
        // Draw first frame once it's loaded
        if (i === 0) {
          drawFrame(0);
        }
      };
      images.push(img);
    }

    framesRef.current = images;
  }, [frameCount, getFrameSrc, drawFrame]);

  /** ScrollTrigger drives the frame index */
  useGSAP(
    () => {
      const trigger = triggerRef?.current ?? containerRef.current;
      if (!trigger) return;

      // Animate a proxy object's progress from startProgress to endProgress
      const proxy = { frame: 0 };

      gsap.to(proxy, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
        },
        onUpdate: () => {
          const frameIndex = Math.round(proxy.frame);
          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }
        },
      });
    },
    { dependencies: [frameCount, startProgress, endProgress, drawFrame] },
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
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
