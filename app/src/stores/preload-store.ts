import { create } from "zustand";

const TOTAL_FRAMES = 640;

/**
 * Preload store — frames array is MUTABLE (not reactive).
 * Components access frames via usePreloadStore.getState().frames
 * to avoid 640 re-renders. Only `isLoaded` is reactive.
 */

interface PreloadState {
  /** Mutable array — read via getState(), never subscribe to this */
  frames: (HTMLImageElement | null)[];
  isLoaded: boolean;
  setLoaded: () => void;
}

/** Direct mutable reference to the frames array — no copying */
const framesArray: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

export const usePreloadStore = create<PreloadState>((set) => ({
  frames: framesArray,
  isLoaded: false,
  setLoaded: () => set({ isLoaded: true }),
}));

/** Get the mutable frames array directly (no subscription) */
export function getPreloadedFrames(): (HTMLImageElement | null)[] {
  return framesArray;
}

/** Set a single frame in the mutable array (no state update) */
export function setPreloadedFrame(index: number, img: HTMLImageElement): void {
  framesArray[index] = img;
}
