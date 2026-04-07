import type {
  AssetClass,
  CardRarity,
  NeighborhoodClass,
  PropertyListing,
} from '../types/property';

interface ClassConfig {
  types: AssetClass[];
  priceRange: [number, number];
  rentRange: [number, number];
  conditionRange: [number, number];
  cashflowRange: [number, number];
}

const CLASS_CONFIG: Record<NeighborhoodClass, ClassConfig> = {
  A: {
    types: ['sfr', 'small_mf'],
    priceRange: [400000, 1500000],
    rentRange: [2800, 8500],
    conditionRange: [3, 5],
    cashflowRange: [-300, 200],
  },
  B: {
    types: ['sfr', 'small_mf', 'rent_by_room'],
    priceRange: [150000, 400000],
    rentRange: [1200, 2800],
    conditionRange: [2, 5],
    cashflowRange: [100, 600],
  },
  C: {
    types: ['sfr', 'small_mf', 'brrrr', 'flip'],
    priceRange: [60000, 150000],
    rentRange: [800, 1400],
    conditionRange: [1, 4],
    cashflowRange: [200, 900],
  },
  D: {
    types: ['sfr', 'flip', 'brrrr'],
    priceRange: [20000, 60000],
    rentRange: [600, 1000],
    conditionRange: [1, 2],
    cashflowRange: [300, 1100],
  },
};

const STREETS = [
  'Maple', 'Oak', 'Cedar', 'Pine', 'Elm', 'Birch', 'Sunset',
  'Lakeview', 'Hill', 'Park', 'Madison', 'Jefferson', 'Lincoln',
  'Washington', 'Riverside', 'Highland', 'Forest', 'Spring',
];
const SUFFIXES = ['Street', 'Avenue', 'Lane', 'Drive', 'Road', 'Court', 'Way'];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAddress(): string {
  return `${randInt(100, 9999)} ${pick(STREETS)} ${pick(SUFFIXES)}`;
}

function rarityFromCoC(coc: number): CardRarity {
  if (coc > 18) return 'trophy';
  if (coc > 12) return 'great';
  if (coc > 8) return 'good';
  return 'standard';
}

export interface GenerateOptions {
  neighborhoodClass: NeighborhoodClass;
  count?: number;
  isAgentAvatar?: boolean;
}

export function generateListings({
  neighborhoodClass,
  count,
  isAgentAvatar = false,
}: GenerateOptions): PropertyListing[] {
  const cfg = CLASS_CONFIG[neighborhoodClass];
  const total = count ?? randInt(8, 15);
  const listings: PropertyListing[] = [];

  for (let i = 0; i < total; i++) {
    const price = Math.round(rand(cfg.priceRange[0], cfg.priceRange[1]));
    const rent = Math.round(rand(cfg.rentRange[0], cfg.rentRange[1]));
    const condition = randInt(cfg.conditionRange[0], cfg.conditionRange[1]);
    const cashflow = Math.round(rand(cfg.cashflowRange[0], cfg.cashflowRange[1]));
    const downPayment = price * 0.25;
    const annualCF = cashflow * 12;
    const coc = downPayment > 0 ? (annualCF / downPayment) * 100 : 0;
    const rehab = (5 - condition) * Math.round(rand(2000, 6000));

    listings.push({
      id: `${neighborhoodClass}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      address: generateAddress(),
      neighborhood_class: neighborhoodClass,
      asset_class: pick(cfg.types),
      purchase_price: price,
      condition_rating: condition,
      projected_rent: rent,
      projected_cashflow: cashflow,
      cash_on_cash_return: Math.round(coc * 10) / 10,
      days_on_market: randInt(0, 25),
      card_rarity: rarityFromCoC(coc),
      is_mls_exclusive: false,
      expires_at: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
      rehab_cost_required: rehab,
    });
  }

  if (isAgentAvatar) {
    const exclusives = generateListings({
      neighborhoodClass,
      count: randInt(2, 3),
      isAgentAvatar: false,
    });
    exclusives.forEach((l) => (l.is_mls_exclusive = true));
    listings.push(...exclusives);
  }

  return listings;
}

export function refreshWeekly(neighborhoodClass: NeighborhoodClass): PropertyListing[] {
  return generateListings({ neighborhoodClass, count: randInt(2, 3) });
}

export function applyAging(listings: PropertyListing[]): PropertyListing[] {
  return listings
    .map((l) => {
      const dom = l.days_on_market + 7;
      const priceMultiplier = Math.floor(dom / 30) > Math.floor(l.days_on_market / 30) ? 0.98 : 1;
      return { ...l, days_on_market: dom, purchase_price: Math.round(l.purchase_price * priceMultiplier) };
    })
    .filter((l) => l.days_on_market < 60);
}
