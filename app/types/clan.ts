export interface Clan {
  id: string;
  name: string;
  creatorId: string;
  memberCount: number;
  packPoints: number;
  description: string;
  totalCashflow: number;
  totalNetWorth: number;
  createdAt: string;
  isWolfPack: boolean;
}

export interface ClanMember {
  id: string;
  clanId: string;
  playerId: string;
  displayName: string;
  avatarType: string;
  level: number;
  monthlyContribution: number;
  role: 'creator' | 'officer' | 'member';
  joinedAt: string;
}

export interface SyndicationDeal {
  id: string;
  clanId: string;
  creatorId: string;
  propertyId: string;
  propertyAddress: string;
  purchasePrice: number;
  targetRaise: number;
  raisedSoFar: number;
  minimumBuyIn: number;
  maxInvestors: number;
  currentInvestors: number;
  equitySplits: { playerId: string; percentage: number; amount: number }[];
  monthlyDistribution: number;
  status: 'open' | 'funded' | 'closed';
  expiresAt: string;
}

export interface PackChallengeT {
  id: string;
  clanId: string;
  title: string;
  description: string;
  targetMetric: string;
  targetValue: number;
  rewardXP: number;
  endsAt: string;
  completions: { playerId: string; completedAt: string }[];
}

export interface FeedItem {
  id: string;
  type:
    | 'purchase'
    | 'market_event'
    | 'level_up'
    | 'milestone'
    | 'flip_profit'
    | 'syndication'
    | 'challenge';
  playerName: string;
  message: string;
  timestamp: string;
  reactions: Record<string, number>;
  commentCount: number;
}

export interface ChatMessage {
  id: string;
  clanId: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: string;
  attachment?: { type: 'property' | 'market_event'; data: any };
}
