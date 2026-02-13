import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { usePreloadStore, setPreloadedFrame } from "@/stores/preload-store";

/* ═══════════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════════ */

const TOTAL_FRAMES = 640;
const TOTAL_ITEMS = 644; // 640 frames + 1 video + 3 static images
const SESSION_KEY = "mi-assets-loaded";

const R2_BASE = "https://pub-8f1a35b88d584fcbbaf75e78ba08ee58.r2.dev";
const pad3 = (n: number) => String(n).padStart(3, "0");

function getFrameSrc(index: number): string {
  if (index < 120) return `${R2_BASE}/web/army-saluting/frame-${pad3(index + 1)}.webp`;
  if (index < 160) return `${R2_BASE}/web/army-eyezoom/frame-${pad3(index - 119)}.webp`;
  if (index < 400) return `${R2_BASE}/web/jet-transition/frame-${pad3(index - 159)}.webp`;
  return `${R2_BASE}/web/carrier-reveal/frame-${pad3(index - 399)}.webp`;
}

const STATIC_IMAGES = [
  "/images/desert-terrain.png",
  "/images/sand-foreground.png",
  "/images/terrain-silhouette.png",
];

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */

interface AssetLoaderProps {
  onComplete: () => void;
}

export function AssetLoader({ onComplete }: AssetLoaderProps) {
  const setLoaded = usePreloadStore((s) => s.setLoaded);

  const overlayRef = useRef<HTMLDivElement>(null);
  const chakraRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [showOverlay, setShowOverlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadedCountRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const onItemLoaded = useCallback(() => {
    loadedCountRef.current += 1;
    const pct = Math.min(loadedCountRef.current / TOTAL_ITEMS, 1);
    setProgress(pct);

    if (loadedCountRef.current >= TOTAL_ITEMS && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setProgress(1);
      sessionStorage.setItem(SESSION_KEY, "1");
      setLoaded();
    }
  }, [setLoaded]);

  /** Preload all assets (runs once) */
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const alreadyCached = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyCached) {
      setShowOverlay(false);
    }

    // Build frame images
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => {
        setPreloadedFrame(idx, img);
        onItemLoaded();
      };
      img.onerror = () => onItemLoaded();
      img.src = getFrameSrc(i);
      setPreloadedFrame(i, img);
    }

    // Static images
    for (const src of STATIC_IMAGES) {
      const img = new Image();
      img.onload = onItemLoaded;
      img.onerror = onItemLoaded;
      img.src = src;
    }

    // Flag video
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    const handleVideo = () => {
      onItemLoaded();
      video.removeEventListener("canplaythrough", handleVideo);
    };
    video.addEventListener("canplaythrough", handleVideo);
    video.src = "/videos/waving_flag.mp4";
    video.load();
  }, [onItemLoaded]);

  /** Exit animation on completion */
  useEffect(() => {
    if (!hasCompletedRef.current || !showOverlay) return;
    if (progress < 1) return;

    const timeout = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShowOverlay(false);
          onComplete();
        },
      });

      // Brief hold — full glow pulse
      if (glowRef.current) {
        tl.to(glowRef.current, {
          opacity: 0.8,
          scale: 1.3,
          duration: 0.3,
          ease: "power2.out",
        }, 0);
      }

      // Chakra scales up and fades
      if (chakraRef.current) {
        tl.to(chakraRef.current, {
          scale: 1.5,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, 0.2);
      }

      // Glow expands and fades
      if (glowRef.current) {
        tl.to(glowRef.current, {
          scale: 2.5,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, 0.2);
      }

      // Text fades
      if (textRef.current) {
        tl.to(textRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.in",
        }, 0.15);
      }

      // Background sweeps away
      if (overlayRef.current) {
        tl.to(overlayRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        }, 0.35);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [progress, showOverlay, onComplete]);

  /** If cached session, fire onComplete immediately */
  useEffect(() => {
    if (!showOverlay && hasCompletedRef.current) {
      onComplete();
    }
  }, [showOverlay, onComplete]);

  if (!showOverlay) return null;

  const pctDeg = progress * 360;
  const pctNum = Math.round(progress * 100);

  return (
    <div ref={overlayRef} className="loading-overlay">
      <div className="chakra-loader-container">
        {/* Radial glow behind the chakra */}
        <div
          ref={glowRef}
          className="chakra-glow-bg"
          style={{ opacity: 0.15 + progress * 0.45 }}
        />

        {/* The Ashoka Chakra image with conic gradient mask reveal */}
        <div className="chakra-img-wrapper">
          {/* Dim base layer — always visible at low opacity */}
          <img
            src="/images/ashoka-chakra.jpeg"
            alt=""
            className="chakra-img chakra-img-dim chakra-spin"
          />
          {/* Bright reveal layer — masked by conic gradient based on progress */}
          <img
            ref={chakraRef}
            src="/images/ashoka-chakra.jpeg"
            alt="Loading"
            className="chakra-img chakra-img-bright"
            style={{
              maskImage: `conic-gradient(from -90deg, #000 ${pctDeg}deg, transparent ${pctDeg}deg)`,
              WebkitMaskImage: `conic-gradient(from -90deg, #000 ${pctDeg}deg, transparent ${pctDeg}deg)`,
            }}
          />
        </div>

        {/* Percentage text */}
        <div ref={textRef} className="chakra-loader-text">
          <span ref={percentRef} className="chakra-loader-pct">{pctNum}%</span>
          <span className="chakra-loader-label">
            {pctNum < 100 ? "LOADING ASSETS" : "READY"}
          </span>
        </div>
      </div>
    </div>
  );
}
