export type NeighborhoodClass = 'A' | 'B' | 'C' | 'D';

export type AssetClass =
  | 'sfr'
  | 'flip'
  | 'brrrr'
  | 'str'
  | 'rent_by_room'
  | 'small_mf'
  | 'storage'
  | 'lease_arbitrage'
  | 'large_mf'
  | 'commercial'
  | 'car_wash'
  | 'hotel';

export type CardRarity = 'standard' | 'good' | 'great' | 'trophy';

export interface PropertyListing {
  id: string;
  address: string;
  neighborhood_class: NeighborhoodClass;
  asset_class: AssetClass;
  purchase_price: number;
  condition_rating: number;
  projected_rent: number;
  projected_cashflow: number;
  cash_on_cash_return: number;
  days_on_market: number;
  card_rarity: CardRarity;
  is_mls_exclusive: boolean;
  expires_at: string;
  rehab_cost_required: number;
}
