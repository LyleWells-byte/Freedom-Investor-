import type { AvatarType } from '../types/player';

export interface AvatarPitchContent {
  headline: string;
  body: string;
  cta: string;
}

export async function checkWolfPackTrigger(
  playerLevel: number,
  _playerId: string
): Promise<boolean> {
  // TODO: read wolf_pack_pitch_events for this player
  // pitchShown / ctaClicked flags
  if (playerLevel >= 5) return true;
  return false;
}

export function getAvatarPitchCopy(
  avatarType: AvatarType,
  taxSavings = 0
): AvatarPitchContent {
  switch (avatarType) {
    case 'agent':
      return {
        headline: "You're already an agent.",
        body:
          "Are you on the right team?\nThe Wolf Pack isn't just about selling — it's about owning. Move your license and unlock the system that turns your commission into a real estate portfolio.",
        cta: 'Move My License to Wolf Pack',
      };
    case 'new_investor':
      return {
        headline: "You've been investing in the game.",
        body:
          'Ready to do it in real life?\nGet your license and unlock every advantage the Wolf Pack offers. Your commission funds your first deal.',
        cta: 'Get Licensed. Join the Pack.',
      };
    case 'w2_employee':
      return {
        headline: `You just saved $${taxSavings.toLocaleString()} in taxes. Inside a game.`,
        body:
          'Imagine doing that with real money.\nThe Wolf Pack shows you exactly how — and gives you the license that makes it all work together.',
        cta: 'Build Wealth with the Wolf Pack',
      };
    case 'business_owner':
      return {
        headline: 'You know how to build.',
        body:
          'The Wolf Pack teaches you how to keep more of what you build — and multiply it through real estate. Your business becomes your best deal source.',
        cta: 'Join the Pack. Multiply Your Business.',
      };
  }
}

export type RecruitingEvent =
  | 'pitch_shown'
  | 'step_reached'
  | 'cta_clicked'
  | 'dismissed'
  | 'agent_path_started';

export async function logRecruitingEvent(
  _playerId: string,
  _event: RecruitingEvent,
  _stepNumber?: number
): Promise<void> {
  // TODO: insert into wolf_pack_pitch_events + update referrals timestamps
}

export async function applyWolfPackBonus(_playerId: string): Promise<void> {
  // TODO: add $250K cash, unlock all asset classes, add to Wolf Pack Elite,
  // unlock full academy, award 2500 XP, fire celebration
}
