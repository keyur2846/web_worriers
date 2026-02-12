import { create } from "zustand";

export interface SceneConfig {
  id: string;
  label: string;
  startProgress: number;
  endProgress: number;
}

interface ScrollState {
  globalProgress: number;
  activeSceneIndex: number;
  sceneProgress: number;
  direction: number;
  scenes: SceneConfig[];
  setGlobalProgress: (progress: number, direction: number) => void;
  setScenes: (scenes: SceneConfig[]) => void;
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  globalProgress: 0,
  activeSceneIndex: 0,
  sceneProgress: 0,
  direction: 1,
  scenes: [],

  setScenes: (scenes) => set({ scenes }),

  setGlobalProgress: (progress, direction) => {
    const { scenes } = get();
    if (scenes.length === 0) return;

    let activeIndex = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (progress >= scenes[i].startProgress && progress <= scenes[i].endProgress) {
        activeIndex = i;
        break;
      }
      if (progress > scenes[i].endProgress) {
        activeIndex = i;
      }
    }

    const scene = scenes[activeIndex];
    const range = scene.endProgress - scene.startProgress;
    const sceneProgress =
      range > 0
        ? Math.max(0, Math.min(1, (progress - scene.startProgress) / range))
        : 0;

    set({
      globalProgress: progress,
      activeSceneIndex: activeIndex,
      sceneProgress,
      direction,
    });
  },
}));
