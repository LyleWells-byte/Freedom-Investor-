import { create } from 'zustand';
import type { AchievementBadge } from '../types/xp';
import type { ToastMessage } from '../types/notifications';

interface LevelUpData {
  newLevel: number;
  title: string;
  unlocksAssetClass?: string;
  unlocksFeature?: string;
}

interface GameStore {
  isGameRunning: boolean;
  gameSpeed: 1 | 2 | 5;
  currentGameDate: Date;
  sessionStartTime: Date;
  tutorialComplete: boolean;
  tutorialStep: number;
  pendingLevelUp: LevelUpData | null;
  pendingBadges: AchievementBadge[];
  toastQueue: ToastMessage[];

  startGame: () => void;
  pauseGame: () => void;
  setGameSpeed: (speed: 1 | 2 | 5) => void;
  advanceGameTick: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  clearToast: (id: string) => void;
  completeTutorialStep: () => void;
  setTutorialComplete: () => void;
  setPendingLevelUp: (data: LevelUpData | null) => void;
  setPendingBadges: (badges: AchievementBadge[]) => void;
  clearPendingLevelUp: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  isGameRunning: false,
  gameSpeed: 1,
  currentGameDate: new Date(2024, 0, 1),
  sessionStartTime: new Date(),
  tutorialComplete: false,
  tutorialStep: 1,
  pendingLevelUp: null,
  pendingBadges: [],
  toastQueue: [],

  startGame: () => set({ isGameRunning: true, sessionStartTime: new Date() }),
  pauseGame: () => set({ isGameRunning: false }),
  setGameSpeed: (speed) => set({ gameSpeed: speed }),
  advanceGameTick: () => {
    const next = new Date(get().currentGameDate);
    next.setMonth(next.getMonth() + 1);
    set({ currentGameDate: next });
  },
  showToast: (toast) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ toastQueue: [...s.toastQueue, { ...toast, id }] }));
    setTimeout(() => get().clearToast(id), toast.duration ?? 3000);
  },
  clearToast: (id) => set((s) => ({ toastQueue: s.toastQueue.filter((t) => t.id !== id) })),
  completeTutorialStep: () => set((s) => ({ tutorialStep: s.tutorialStep + 1 })),
  setTutorialComplete: () => set({ tutorialComplete: true }),
  setPendingLevelUp: (data) => set({ pendingLevelUp: data }),
  setPendingBadges: (badges) => set({ pendingBadges: badges }),
  clearPendingLevelUp: () => set({ pendingLevelUp: null, pendingBadges: [] }),
}));
