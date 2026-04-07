import type { Clan, SyndicationDeal, PackChallengeT } from '../types/clan';
import type { PropertyListing } from '../types/property';

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function inviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createClan(
  creatorId: string,
  name: string,
  description: string
): Promise<Clan> {
  const clan: Clan = {
    id: uid('clan'),
    name,
    creatorId,
    memberCount: 1,
    packPoints: 0,
    description,
    totalCashflow: 0,
    totalNetWorth: 0,
    createdAt: new Date().toISOString(),
    isWolfPack: false,
  };
  // TODO: await supabase.from('clans').insert(clan)
  // TODO: await supabase.from('clan_members').insert({ clan_id: clan.id, player_id: creatorId, role: 'creator' })
  // TODO: award 100 XP, generate inviteCode() and persist
  void inviteCode();
  return clan;
}

export async function joinClan(_playerId: string, _inviteCode: string): Promise<boolean> {
  // TODO: validate code, insert into clan_members, increment memberCount, post feed item, award 50 XP
  return true;
}

export async function createSyndication(
  creatorId: string,
  clanId: string,
  propertyListing: PropertyListing,
  minimumBuyIn: number,
  maxInvestors: number
): Promise<SyndicationDeal> {
  const target = propertyListing.purchase_price * 0.25;
  const deal: SyndicationDeal = {
    id: uid('synd'),
    clanId,
    creatorId,
    propertyId: propertyListing.id,
    propertyAddress: propertyListing.address,
    purchasePrice: propertyListing.purchase_price,
    targetRaise: target,
    raisedSoFar: 0,
    minimumBuyIn,
    maxInvestors,
    currentInvestors: 0,
    equitySplits: [],
    monthlyDistribution: propertyListing.projected_cashflow,
    status: 'open',
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  };
  // TODO: persist + post to PackFeed
  return deal;
}

export async function investInSyndication(
  playerId: string,
  syndicationId: string,
  amount: number
): Promise<boolean> {
  // TODO: validate cash, deduct, update equity splits, fire purchase if funded
  void playerId;
  void syndicationId;
  void amount;
  return true;
}

export function calculatePackPoints(stats: {
  combinedMonthlyCashflow: number;
  totalProperties: number;
  educationCardsCompleted: number;
  marketEventsSurvived: number;
  syndicationsFunded: number;
}): number {
  return (
    stats.combinedMonthlyCashflow * 10 +
    stats.totalProperties * 50 +
    stats.educationCardsCompleted * 5 +
    stats.marketEventsSurvived * 25 +
    stats.syndicationsFunded * 100
  );
}

export async function issuePackChallenge(
  _creatorId: string,
  _clanId: string,
  _challenge: PackChallengeT
): Promise<void> {
  // TODO: persist + post to feed
}
