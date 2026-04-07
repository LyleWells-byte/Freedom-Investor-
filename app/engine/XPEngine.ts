import { GAME_CONFIG, type XPEventType } from '../constants/config';
import type { AchievementBadge, LevelDefinition, XPAwardResult } from '../types/xp';

export const LEVELS: LevelDefinition[] = [
  { level: 1, xpRequired: 0, xpToNext: 500, title: 'First Timer', milestone: false },
  { level: 2, xpRequired: 500, xpToNext: 700, title: 'Getting Started', milestone: false },
  { level: 3, xpRequired: 1200, xpToNext: 1000, title: 'BRRRR Unlocked', milestone: true, unlocksAssetClass: 'brrrr' },
  { level: 4, xpRequired: 2200, xpToNext: 1300, title: 'Building Momentum', milestone: false },
  { level: 5, xpRequired: 3500, xpToNext: 1500, title: 'Wolf Pack Eligible', milestone: true, unlocksFeature: 'wolfpack_pitch' },
  { level: 6, xpRequired: 5000, xpToNext: 2000, title: 'Portfolio Builder', milestone: false },
  { level: 7, xpRequired: 7000, xpToNext: 2500, title: 'STR Unlocked', milestone: true, unlocksAssetClass: 'str' },
  { level: 8, xpRequired: 9500, xpToNext: 3000, title: 'Small MF Unlocked', milestone: true, unlocksAssetClass: 'small_mf' },
  { level: 9, xpRequired: 12500, xpToNext: 3500, title: 'Scaling Up', milestone: false },
  { level: 10, xpRequired: 16000, xpToNext: 4000, title: 'Storage Unlocked', milestone: true, unlocksAssetClass: 'storage' },
  { level: 11, xpRequired: 20000, xpToNext: 5000, title: 'Double Digits', milestone: false },
  { level: 12, xpRequired: 25000, xpToNext: 6000, title: 'Lease Arb Unlocked', milestone: true, unlocksAssetClass: 'lease_arbitrage' },
  { level: 13, xpRequired: 31000, xpToNext: 7000, title: 'Deal Maker', milestone: false },
  { level: 14, xpRequired: 38000, xpToNext: 8000, title: 'Large MF Unlocked', milestone: true, unlocksAssetClass: 'large_mf' },
  { level: 15, xpRequired: 46000, xpToNext: 9000, title: 'REPS Eligible', milestone: true, unlocksFeature: 'reps' },
  { level: 16, xpRequired: 55000, xpToNext: 10000, title: 'Commercial Unlocked', milestone: true, unlocksAssetClass: 'commercial' },
  { level: 17, xpRequired: 65000, xpToNext: 12000, title: 'Operator', milestone: false },
  { level: 18, xpRequired: 77000, xpToNext: 13000, title: 'Car Wash Unlocked', milestone: true, unlocksAssetClass: 'car_wash' },
  { level: 19, xpRequired: 90000, xpToNext: 15000, title: 'Portfolio King', milestone: false },
  { level: 20, xpRequired: 105000, xpToNext: 17000, title: 'Hotel Unlocked', milestone: true, unlocksAssetClass: 'hotel' },
  { level: 21, xpRequired: 122000, xpToNext: 19000, title: 'Syndicator', milestone: false },
  { level: 22, xpRequired: 141000, xpToNext: 21000, title: 'Capital Allocator', milestone: false },
  { level: 23, xpRequired: 162000, xpToNext: 23000, title: 'Market Maker', milestone: false },
  { level: 24, xpRequired: 185000, xpToNext: 25000, title: 'Empire Builder', milestone: false },
  { level: 25, xpRequired: 210000, xpToNext: 0, title: 'Freedom Investor', milestone: true },
];

export function getLevelDefinitions(): LevelDefinition[] {
  return LEVELS;
}

export function levelForXP(xp: number): LevelDefinition {
  let current = LEVELS[0];
  for (const def of LEVELS) {
    if (xp >= def.xpRequired) current = def;
    else break;
  }
  return current;
}

export const ACHIEVEMENTS: AchievementBadge[] = [
  { id: 'first_deal', name: 'First Deal Closed', description: 'Purchased your first property.', icon: '🏠', rarity: 'common', xpReward: 500 },
  { id: 'flip_master', name: 'Flip Master', description: 'Completed 5 profitable flips.', icon: '🔨', rarity: 'rare', xpReward: 300 },
  { id: 'brrrr_machine', name: 'BRRRR Machine', description: 'Completed 3 BRRRRs recovering 100%+ capital.', icon: '🔄', rarity: 'rare', xpReward: 500 },
  { id: 'tax_warrior', name: 'Tax Warrior', description: 'Saved $10,000+ in taxes in one year.', icon: '📉', rarity: 'rare', xpReward: 400 },
  { id: 'double_digits', name: 'Double Digits', description: 'Owned 10+ properties simultaneously.', icon: '🏘️', rarity: 'epic', xpReward: 750 },
  { id: 'cashflow_king', name: 'Cashflow King', description: 'Reached $10,000/mo net cashflow.', icon: '💰', rarity: 'epic', xpReward: 1000 },
  { id: 'recession_survivor', name: 'Recession Survivor', description: 'Maintained positive cashflow through a full recession.', icon: '🛡️', rarity: 'epic', xpReward: 800 },
  { id: 'wolf_pack_member', name: 'Wolf Pack Member', description: 'Completed Wolf Pack license transfer.', icon: '🐺', rarity: 'legendary', xpReward: 2500 },
  { id: 'freedom_investor', name: 'Freedom Investor', description: 'Reached Level 25.', icon: '👑', rarity: 'legendary', xpReward: 5000 },
  { id: 'infinite_returns', name: 'Infinite Returns', description: 'BRRRR recovering all capital + cashflow positive.', icon: '♾️', rarity: 'epic', xpReward: 600 },
  { id: 'pack_leader', name: 'Pack Leader', description: 'Created a clan with 10+ members.', icon: '🏆', rarity: 'epic', xpReward: 500 },
  { id: 'syndication_king', name: 'Syndication King', description: 'Funded 3 syndication deals.', icon: '🤝', rarity: 'epic', xpReward: 600 },
  { id: 'tax_zero', name: 'Tax Zero', description: '0% effective tax rate via REPS + cost seg.', icon: '🎯', rarity: 'legendary', xpReward: 2000 },
  { id: 'hotel_baron', name: 'Hotel Baron', description: 'Own a hotel asset class property.', icon: '🏨', rarity: 'legendary', xpReward: 1000 },
  { id: 'dip_buyer', name: 'Dip Buyer', description: 'Purchased 3+ properties during active recession.', icon: '📈', rarity: 'rare', xpReward: 400 },
  { id: 'first_day', name: 'First Day Investor', description: 'Completed the tutorial.', icon: '🌱', rarity: 'common', xpReward: 250 },
];

export async function awardXP(
  _playerId: string,
  eventType: XPEventType,
  _customDescription?: string
): Promise<XPAwardResult> {
  const xp = GAME_CONFIG.xp[eventType] ?? 0;
  // TODO: read existing player XP from store/Supabase, persist new total, log event
  const newTotal = xp; // placeholder
  const newDef = levelForXP(newTotal);
  return {
    xpAwarded: xp,
    newTotal,
    leveledUp: false,
    newLevel: newDef.level,
  };
}

export async function checkAchievements(
  _playerId: string,
  _triggerEvent: string
): Promise<AchievementBadge[]> {
  // TODO: evaluate condition functions per badge against current player state
  return [];
}
