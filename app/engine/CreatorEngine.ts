import type {
  ConversionFunnelData,
  DownlineStats,
  RecruitFilters,
  RecruitProfile,
} from '../types/creator';
import { applyWolfPackBonus } from './RecruitingEngine';

export async function isCreatorAccount(_playerId: string): Promise<boolean> {
  // TODO: query creator_accounts table
  return true;
}

export async function getDownlineStats(_creatorCode: string): Promise<DownlineStats> {
  // TODO: aggregate from referrals + players
  return {
    totalReferred: 0,
    activeThisMonth: 0,
    activeThisWeek: 0,
    level5Reached: 0,
    wolfPackPitchShown: 0,
    wolfPackCtaClicked: 0,
    ctaConversionRate: 0,
    licenseTransfers: 0,
    licenseConversionRate: 0,
    wolfPackBonusesApplied: 0,
    avgPlayerLevel: 0,
    avgMonthlyCashflow: 0,
    totalPortfolioValueAcrossDownline: 0,
  };
}

export async function getRecruitList(
  _creatorCode: string,
  filters: RecruitFilters,
  sortBy = 'recent'
): Promise<RecruitProfile[]> {
  // TODO: load + apply filters + sort
  void filters;
  void sortBy;
  return [];
}

export function calculateEngagementScore(recruit: RecruitProfile): number {
  let score = 0;
  score += Math.min(30, recruit.currentLevel * 5);
  const daysSince = (Date.now() - new Date(recruit.lastActiveDate).getTime()) / 86400000;
  score += Math.max(0, Math.min(20, 20 - daysSince));
  if (recruit.wolfPackCtaClicked) score += 25;
  score += Math.min(10, recruit.assetClassesUnlocked.length * 2);
  // education cards completed proxy
  return Math.round(Math.min(100, score));
}

export async function confirmLicenseTransfer(playerId: string, _creatorId: string): Promise<void> {
  await applyWolfPackBonus(playerId);
  // TODO: update referrals table, send notification, award 500 XP to creator
}

export async function updateRecruitNotes(_playerId: string, _notes: string): Promise<void> {
  // TODO: persist notes on referrals table
}

export async function exportDownlineCSV(
  _creatorCode: string,
  _filters: RecruitFilters
): Promise<string> {
  const header =
    'Name,Avatar Type,Level,Signup Date,Last Active,Monthly Cashflow,Wolf Pack CTA Clicked,CTA Date,License Transferred,Notes,Engagement Score';
  return header + '\n';
}

export async function getConversionFunnel(_creatorCode: string): Promise<ConversionFunnelData> {
  return {
    signups: 0,
    completedOnboarding: 0,
    reachedLevel3: 0,
    reachedLevel5: 0,
    pitchShown: 0,
    ctaClicked: 0,
    agentPathStarted: 0,
    licenseTransferred: 0,
  };
}
