import { create } from 'zustand';
import type { AvatarType, Player, PlayerGoals } from '../types/player';

interface OnboardingDraft {
  display_name?: string;
  avatar_type?: AvatarType;
  w2_income?: number;
  goals?: Partial<PlayerGoals>;
}

interface PlayerStore {
  player: Player | null;
  draft: OnboardingDraft;
  setDraft: (patch: Partial<OnboardingDraft>) => void;
  setAvatar: (avatar: AvatarType) => void;
  setW2Income: (income: number) => void;
  setGoals: (goals: Partial<PlayerGoals>) => void;
  setPlayer: (player: Player) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: null,
  draft: {},
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  setAvatar: (avatar_type) => set((s) => ({ draft: { ...s.draft, avatar_type } })),
  setW2Income: (w2_income) => set((s) => ({ draft: { ...s.draft, w2_income } })),
  setGoals: (goals) =>
    set((s) => ({ draft: { ...s.draft, goals: { ...s.draft.goals, ...goals } } })),
  setPlayer: (player) => set({ player }),
  reset: () => set({ player: null, draft: {} }),
}));

export function startingCashFor(avatar: AvatarType): number {
  if (avatar === 'new_investor') return 75000;
  return 50000;
}

export function llcFormedFor(avatar: AvatarType): boolean {
  return avatar === 'business_owner';
}
