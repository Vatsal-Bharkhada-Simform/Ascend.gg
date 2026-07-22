import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SaveData } from '../types/game';

interface MetaStore extends SaveData {
  setBestScore: (score: number) => void;
  addCoins: (amount: number) => void;
  unlockSkin: (id: string, cost: number) => void;
  equipSkin: (id: string) => void;
  unlockTheme: (id: string, cost: number) => void;
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
      coins: 0,
      unlockedSkinIds: ['default'],
      equippedSkinId: 'default',
      unlockedThemeIds: ['default'],
      equippedThemeId: 'default',
      controlMode: defaultControlMode,
      muted: false,

      setBestScore: (score) =>
        set((state) => ({ bestScore: Math.max(state.bestScore, score) })),

      addCoins: (amount) =>
        set((state) => ({ coins: state.coins + amount })),

      unlockSkin: (id, cost) =>
        set((state) => {
          if (state.unlockedSkinIds.includes(id) || state.coins < cost) {
            return state;
          }
          return {
            coins: state.coins - cost,
            unlockedSkinIds: [...state.unlockedSkinIds, id],
          };
        }),

      equipSkin: (id) => set({ equippedSkinId: id }),

      unlockTheme: (id, cost) =>
        set((state) => {
          if (state.unlockedThemeIds.includes(id) || state.coins < cost) {
            return state;
          }
          return {
            coins: state.coins - cost,
            unlockedThemeIds: [...state.unlockedThemeIds, id],
          };
        }),

      equipTheme: (id) => set({ equippedThemeId: id }),

      setControlMode: (mode) => set({ controlMode: mode }),

      setMuted: (muted) => set({ muted }),
    }),
    {
      name: 'ascend-save-data',
    }
  )
);
