export interface XPEvent {
  id: string;
  playerId: string;
  eventType: string;
  xpAwarded: number;
  description: string;
  timestamp: string;
  triggeredBy: string;
}

export interface LevelDefinition {
  level: number;
  xpRequired: number;
  xpToNext: number;
  unlocksAssetClass?: string;
  unlocksFeature?: string;
  title: string;
  milestone: boolean;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface XPAwardResult {
  xpAwarded: number;
  newTotal: number;
  leveledUp: boolean;
  newLevel?: number;
  newBadges?: AchievementBadge[];
  newUnlocks?: string[];
}
