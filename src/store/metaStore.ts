import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SaveData } from '../types/game';

interface MetaStore extends SaveData {
  setBestScore: (score: number) => void;
  equipSkin: (id: string) => void;
  equipTheme: (id: string) => void;
  setControlMode: (mode: 'touch' | 'keyboard') => void;
  setMuted: (muted: boolean) => void;
}

const defaultControlMode =
  typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
    ? 'touch'
    : 'keyboard';

export const useMetaStore = create<MetaStore>()(
  persist(
    (set) => ({
      bestScore: 0,
      equippedSkinId: 'default',
      equippedThemeId: 'default',
      controlMode: defaultControlMode,
      muted: false,

      setBestScore: (score) =>
        set((state) => ({ bestScore: Math.max(state.bestScore, score) })),

      equipSkin: (id) => set({ equippedSkinId: id }),

      equipTheme: (id) => set({ equippedThemeId: id }),

      setControlMode: (mode) => set({ controlMode: mode }),

      setMuted: (muted) => set({ muted }),
    }),
    {
      name: 'ascend-save-data',
    }
  )
);
