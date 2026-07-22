import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SaveData } from '../types/game';

interface MetaStore extends SaveData {
  setBestScore: (score: number) => void;
  addCoins: (amount: number) => void;
  unlockSkin: (id: string) => void;
  equipSkin: (id: string) => void;
  setControlMode: (mode: 'touch' | 'keyboard') => void;
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
      controlMode: defaultControlMode,

      setBestScore: (score) =>
        set((state) => ({ bestScore: Math.max(state.bestScore, score) })),

      addCoins: (amount) =>
        set((state) => ({ coins: state.coins + amount })),

      unlockSkin: (id) =>
        set((state) => ({
          unlockedSkinIds: state.unlockedSkinIds.includes(id)
            ? state.unlockedSkinIds
            : [...state.unlockedSkinIds, id],
        })),

      equipSkin: (id) => set({ equippedSkinId: id }),

      setControlMode: (mode) => set({ controlMode: mode }),
    }),
    {
      name: 'ascend-save-data',
    }
  )
);
