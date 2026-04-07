import { ASSET_CLASSES, AssetClassDefinition, getAssetClass } from '../data/assetClasses';

export interface UnlockResult {
  assetClass: AssetClassDefinition;
  reason: 'level' | 'purchased';
}

export function checkUnlocks(
  playerLevel: number,
  ownedAssetClasses: string[]
): UnlockResult[] {
  return ASSET_CLASSES.filter(
    (a) => a.unlockLevel <= playerLevel && !ownedAssetClasses.includes(a.id)
  ).map((a) => ({ assetClass: a, reason: 'level' as const }));
}

export function isAssetClassAvailable(
  assetClassId: string,
  playerLevel: number,
  purchasedUnlocks: string[]
): boolean {
  const a = getAssetClass(assetClassId);
  if (!a) return false;
  if (purchasedUnlocks.includes(assetClassId)) return true;
  return playerLevel >= a.unlockLevel;
}

export function calculateXPToNextUnlock(playerLevel: number): {
  nextUnlockLevel: number;
  xpRequired: number;
  assetClassName: string;
} | null {
  const next = ASSET_CLASSES.find((a) => a.unlockLevel > playerLevel);
  if (!next) return null;
  const levelsAway = next.unlockLevel - playerLevel;
  return {
    nextUnlockLevel: next.unlockLevel,
    xpRequired: levelsAway * 1000,
    assetClassName: next.name,
  };
}

export async function purchaseEarlyUnlock(
  assetClassId: string,
  _playerId: string
): Promise<boolean> {
  const a = getAssetClass(assetClassId);
  if (!a) return false;
  try {
    // TODO: Stripe payment intent flow
    // const result = await createStripePayment(a.earlyUnlockPrice, playerId)
    // if (!result.success) return false
    // await supabase.from('creator_accounts').update({...}).eq('player_id', playerId)
    return true;
  } catch {
    return false;
  }
}
