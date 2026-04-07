import type { AvatarType } from './player';

export interface RecruitProfile {
  id: string;
  playerId: string;
  displayName: string;
  avatarType: AvatarType;
  signupDate: string;
  referrerCode: string;
  currentLevel: number;
  xpTotal: number;
  monthlyGameCashflow: number;
  netWorthInGame: number;
  propertiesOwned: number;
  assetClassesUnlocked: string[];
  lastActiveDate: string;
  wolfPackPitchShown: boolean;
  wolfPackPitchStep: number;
  wolfPackCtaClicked: boolean;
  wolfPackCtaClickedAt?: string;
  licenseTransferred: boolean;
  licenseTransferredAt?: string;
  wolfPackBonusApplied: boolean;
  creatorNotes: string;
  avatarEngagementScore: number;
}

export interface DownlineStats {
  totalReferred: number;
  activeThisMonth: number;
  activeThisWeek: number;
  level5Reached: number;
  wolfPackPitchShown: number;
  wolfPackCtaClicked: number;
  ctaConversionRate: number;
  licenseTransfers: number;
  licenseConversionRate: number;
  wolfPackBonusesApplied: number;
  avgPlayerLevel: number;
  avgMonthlyCashflow: number;
  totalPortfolioValueAcrossDownline: number;
}

export interface ConversionFunnelData {
  signups: number;
  completedOnboarding: number;
  reachedLevel3: number;
  reachedLevel5: number;
  pitchShown: number;
  ctaClicked: number;
  agentPathStarted: number;
  licenseTransferred: number;
}

export interface DemoModeConfig {
  creatorName: string;
  creatorCode: string;
  recruitingUrl: string;
  calendarUrl: string;
  demoSpeed: 'normal' | 'fast';
  showCreatorInfo: boolean;
}

export interface RecruitFilters {
  avatarType?: AvatarType[];
  minLevel?: number;
  maxLevel?: number;
  ctaClickedOnly?: boolean;
  licenseTransferredOnly?: boolean;
  activeOnly?: boolean;
  minEngagement?: number;
}
