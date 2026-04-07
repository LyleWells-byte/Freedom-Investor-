// Freedom Investor: The Game - Market Engine
// Core economic brain: phases, rates, prices, vacancy, events.

export type MarketPhase =
  | 'expansion'
  | 'peak'
  | 'contraction'
  | 'recession'
  | 'recovery';

export type NeighborhoodClass = 'A' | 'B' | 'C' | 'D';

export interface InterestRates {
  conventional_30yr: number;
  dscr: number;
  hard_money: number;
  private_lender: number;
}

export interface PriceIndex {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface VacancyRates {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface MarketEvent {
  id: number;
  name: string;
  description: string;
  probability_weight: number;
  affected_asset_classes: string[];
  parameter_changes: Record<string, number | string>;
  duration_months: number;
  player_message: string;
}

export interface ActiveEvent {
  event: MarketEvent;
  started_month: number;
  expires_month: number;
}

export interface MarketState {
  city_id: string;
  current_phase: MarketPhase;
  phase_started_month: number;
  game_month: number; // months since game start
  rates: InterestRates;
  price_index: PriceIndex;
  vacancy: VacancyRates;
  min_dscr_ratio: number;
  active_events: ActiveEvent[];
  recession_started_at: number | null;
  last_updated: string;
}

// ---------- Phase minimum durations (months) ----------
const PHASE_MIN_DURATION: Record<MarketPhase, [number, number]> = {
  expansion: [18, 36],
  peak: [6, 12],
  contraction: [6, 18],
  recession: [12, 24],
  recovery: [12, 24],
};

const PHASE_ORDER: Record<MarketPhase, MarketPhase> = {
  expansion: 'peak',
  peak: 'contraction',
  contraction: 'recession',
  recession: 'recovery',
  recovery: 'expansion',
};

// ---------- Baseline rates ----------
const BASELINE_RATES: InterestRates = {
  conventional_30yr: 6.5,
  dscr: 7.5,
  hard_money: 11,
  private_lender: 9,
};

const RATE_CAP_LOW = 3;
const RATE_CAP_HIGH = 12;

// ---------- Vacancy baselines ----------
const VACANCY_BASE: Record<NeighborhoodClass, { base: number; recession: number; recovery: number }> = {
  A: { base: 4, recession: 8, recovery: 5 },
  B: { base: 7, recession: 13, recovery: 8 },
  C: { base: 12, recession: 20, recovery: 13 },
  D: { base: 20, recession: 35, recovery: 22 },
};

// ---------- Price drift bands per phase per class ----------
const PRICE_DRIFT: Record<NeighborhoodClass, Partial<Record<MarketPhase, [number, number]>>> = {
  A: {
    expansion: [0.3, 0.5],
    recession: [-0.8, -0.4],
    recovery: [0.2, 0.4],
  },
  B: {
    expansion: [0.4, 0.6],
    recession: [-1.5, -0.8],
    recovery: [0.3, 0.6],
  },
  C: {
    expansion: [0.2, 0.8],
    recession: [-2.0, -1.0],
    recovery: [0.4, 0.8],
  },
  D: {
    expansion: [0.1, 1.0],
    recession: [-3.0, -1.5],
    recovery: [0.5, 1.2],
  },
};

// ---------- Helpers ----------
function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

// ---------- Market Events ----------
export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: 1,
    name: 'Fed Raises Rates',
    description: 'The Federal Reserve hiked benchmark rates.',
    probability_weight: 6,
    affected_asset_classes: ['all'],
    parameter_changes: { rates_delta: 0.75 },
    duration_months: 1,
    player_message: 'The Fed raised rates by 0.75%. Borrowing just got more expensive.',
  },
  {
    id: 2,
    name: 'Fed Cuts Rates',
    description: 'The Federal Reserve cut benchmark rates.',
    probability_weight: 5,
    affected_asset_classes: ['all'],
    parameter_changes: { rates_delta: -0.5 },
    duration_months: 1,
    player_message: 'The Fed cut rates by 0.50%. Refinance opportunities ahead.',
  },
  {
    id: 3,
    name: 'Recession Declared',
    description: 'NBER officially declares a recession.',
    probability_weight: 2,
    affected_asset_classes: ['all'],
    parameter_changes: { force_phase: 'recession' },
    duration_months: 1,
    player_message: 'Recession declared. Brace for impact.',
  },
  {
    id: 4,
    name: 'Market Recovery Signal',
    description: 'Leading indicators flash green.',
    probability_weight: 2,
    affected_asset_classes: ['all'],
    parameter_changes: { force_phase: 'recovery' },
    duration_months: 1,
    player_message: 'Recovery signals confirmed. Smart money is moving.',
  },
  {
    id: 5,
    name: 'Local Job Growth Surge',
    description: 'Major employer expands locally.',
    probability_weight: 5,
    affected_asset_classes: ['B', 'C'],
    parameter_changes: { rent_demand_delta: 10 },
    duration_months: 6,
    player_message: 'Job growth is boosting rental demand in B/C zones (+10%).',
  },
  {
    id: 6,
    name: 'Insurance Spike',
    description: 'Carriers raise premiums across the board.',
    probability_weight: 5,
    affected_asset_classes: ['all'],
    parameter_changes: { insurance_delta: 15 },
    duration_months: 12,
    player_message: 'Insurance costs jumped 15% for the next 12 months.',
  },
  {
    id: 7,
    name: 'Property Tax Reassessment',
    description: 'County reassessment hits part of your portfolio.',
    probability_weight: 4,
    affected_asset_classes: ['all'],
    parameter_changes: { reassess_pct: 20, tax_delta: 10 },
    duration_months: 1,
    player_message: '20% of your portfolio just got reassessed (+10% taxes).',
  },
  {
    id: 8,
    name: 'Eviction Moratorium',
    description: 'A local moratorium pauses evictions.',
    probability_weight: 3,
    affected_asset_classes: ['all'],
    parameter_changes: { rent_pause_pct: 15 },
    duration_months: 3,
    player_message: 'Eviction moratorium: 15% of your rentals are non-paying for 3 months.',
  },
  {
    id: 9,
    name: 'Materials Cost Spike',
    description: 'Lumber and steel prices surge.',
    probability_weight: 5,
    affected_asset_classes: ['all'],
    parameter_changes: { rehab_cost_delta: 20 },
    duration_months: 6,
    player_message: 'Renovation budgets are up 20% for 6 months.',
  },
  {
    id: 10,
    name: 'Airbnb City Ordinance',
    description: 'City restricts short-term rentals.',
    probability_weight: 3,
    affected_asset_classes: ['C', 'D'],
    parameter_changes: { str_restricted: 1 },
    duration_months: 24,
    player_message: 'STR is now restricted in C/D zones.',
  },
  {
    id: 11,
    name: 'New Development Approved',
    description: 'A major mixed-use project breaks ground.',
    probability_weight: 4,
    affected_asset_classes: ['C'],
    parameter_changes: { c_index_boost: 5 },
    duration_months: 1,
    player_message: 'C-zone prices got a +5% boost.',
  },
  {
    id: 12,
    name: 'Hot Money Market',
    description: 'HYSA yields jump to 5%.',
    probability_weight: 4,
    affected_asset_classes: ['all'],
    parameter_changes: { hysa_yield: 5 },
    duration_months: 6,
    player_message: 'Cash is paying 5%. Holding powder is attractive.',
  },
  {
    id: 13,
    name: 'Rent Control Threat',
    description: 'Council debates rent caps in A zones.',
    probability_weight: 3,
    affected_asset_classes: ['A'],
    parameter_changes: { rent_growth_cap: 2 },
    duration_months: 12,
    player_message: 'Rent growth capped at 2% in A zones for 12 months.',
  },
  {
    id: 14,
    name: 'Natural Disaster Risk',
    description: 'Reinsurers reprice the region.',
    probability_weight: 3,
    affected_asset_classes: ['all'],
    parameter_changes: { insurance_delta: 25 },
    duration_months: 12,
    player_message: 'Insurance up 25% in affected zones.',
  },
  {
    id: 15,
    name: 'Tech Layoffs Hit City',
    description: 'Major tech employer cuts staff.',
    probability_weight: 4,
    affected_asset_classes: ['A'],
    parameter_changes: { a_vacancy_delta: 5, a_rent_delta: -3 },
    duration_months: 6,
    player_message: 'A-zone vacancy +5%, rents soften 3%.',
  },
  {
    id: 16,
    name: 'Population Growth Surge',
    description: 'Net migration spikes.',
    probability_weight: 4,
    affected_asset_classes: ['all'],
    parameter_changes: { vacancy_delta: -3 },
    duration_months: 12,
    player_message: 'Vacancies dropped 3% citywide.',
  },
  {
    id: 17,
    name: 'Interest Rate Uncertainty',
    description: 'DSCR lenders pause originations.',
    probability_weight: 3,
    affected_asset_classes: ['all'],
    parameter_changes: { dscr_paused: 1 },
    duration_months: 2,
    player_message: 'DSCR lenders are paused for 60 days.',
  },
  {
    id: 18,
    name: 'Storage Demand Surge',
    description: 'Self-storage occupancy spikes.',
    probability_weight: 4,
    affected_asset_classes: ['storage'],
    parameter_changes: { storage_occupancy_delta: 15 },
    duration_months: 6,
    player_message: 'Storage occupancy +15% for 6 months.',
  },
  {
    id: 19,
    name: 'Contractor Shortage',
    description: 'Trades labor is scarce.',
    probability_weight: 4,
    affected_asset_classes: ['all'],
    parameter_changes: { rehab_time_delta: 30, rehab_cost_delta: 15 },
    duration_months: 6,
    player_message: 'Rehab timelines +30%, costs +15%.',
  },
  {
    id: 20,
    name: '1031 Exchange Window',
    description: 'A clean 1031 window opens.',
    probability_weight: 3,
    affected_asset_classes: ['all'],
    parameter_changes: { exchange_window: 45 },
    duration_months: 2,
    player_message: 'Sell now and reinvest in 45 days to defer capital gains.',
  },
];

// ---------- Initialization ----------
export function initializeMarketState(city_id = 'default'): MarketState {
  return {
    city_id,
    current_phase: 'expansion',
    phase_started_month: 0,
    game_month: 0,
    rates: { ...BASELINE_RATES },
    price_index: { A: 100, B: 100, C: 100, D: 100 },
    vacancy: {
      A: VACANCY_BASE.A.base,
      B: VACANCY_BASE.B.base,
      C: VACANCY_BASE.C.base,
      D: VACANCY_BASE.D.base,
    },
    min_dscr_ratio: 1.2,
    active_events: [],
    recession_started_at: null,
    last_updated: new Date().toISOString(),
  };
}

// ---------- Rate drift ----------
function driftRates(state: MarketState): void {
  let delta = 0;
  switch (state.current_phase) {
    case 'expansion':
      delta = rand(0.05, 0.15);
      break;
    case 'peak':
      delta = rand(0.15, 0.25);
      break;
    case 'contraction':
      delta = rand(-0.05, 0.05);
      break;
    case 'recession':
      delta = -rand(0.1, 0.2);
      break;
    case 'recovery':
      delta = -0.05;
      break;
  }
  state.rates.conventional_30yr = clamp(
    state.rates.conventional_30yr + delta,
    RATE_CAP_LOW,
    RATE_CAP_HIGH
  );
  state.rates.dscr = clamp(state.rates.dscr + delta, RATE_CAP_LOW + 0.5, RATE_CAP_HIGH + 1);
  state.rates.hard_money = clamp(state.rates.hard_money + delta, 6, 18);
  state.rates.private_lender = clamp(state.rates.private_lender + delta, 5, 15);
}

// ---------- Price index drift ----------
function driftPriceIndex(state: MarketState): void {
  (['A', 'B', 'C', 'D'] as NeighborhoodClass[]).forEach((cls) => {
    const band = PRICE_DRIFT[cls][state.current_phase];
    if (!band) return;
    const pct = rand(band[0], band[1]);
    state.price_index[cls] *= 1 + pct / 100;
  });
}

// ---------- Vacancy update ----------
function updateVacancy(state: MarketState): void {
  (['A', 'B', 'C', 'D'] as NeighborhoodClass[]).forEach((cls) => {
    const v = VACANCY_BASE[cls];
    if (state.current_phase === 'recession') state.vacancy[cls] = v.recession;
    else if (state.current_phase === 'recovery') state.vacancy[cls] = v.recovery;
    else state.vacancy[cls] = v.base;
  });
}

// ---------- Phase transition ----------
function maybeTransitionPhase(state: MarketState): void {
  const monthsInPhase = state.game_month - state.phase_started_month;
  const [minD, maxD] = PHASE_MIN_DURATION[state.current_phase];
  if (monthsInPhase < minD) return;
  // Past min, increasing chance up to max.
  const progress = (monthsInPhase - minD) / Math.max(1, maxD - minD);
  const chance = clamp(0.05 + progress * 0.4, 0.05, 0.6);
  if (Math.random() < chance) {
    const next = PHASE_ORDER[state.current_phase];
    if (next === 'recession') {
      triggerRecession(state);
    } else {
      state.current_phase = next;
      state.phase_started_month = state.game_month;
    }
  }
}

// ---------- Event rolling ----------
export function rollForMarketEvent(state: MarketState): MarketEvent | null {
  if (Math.random() > 0.15) return null;
  const totalWeight = MARKET_EVENTS.reduce((s, e) => s + e.probability_weight, 0);
  let r = Math.random() * totalWeight;
  for (const evt of MARKET_EVENTS) {
    r -= evt.probability_weight;
    if (r <= 0) {
      applyEvent(state, evt);
      return evt;
    }
  }
  return null;
}

function applyEvent(state: MarketState, evt: MarketEvent): void {
  state.active_events.push({
    event: evt,
    started_month: state.game_month,
    expires_month: state.game_month + evt.duration_months,
  });

  const pc = evt.parameter_changes;
  if (typeof pc.rates_delta === 'number') {
    const d = pc.rates_delta;
    state.rates.conventional_30yr = clamp(state.rates.conventional_30yr + d, RATE_CAP_LOW, RATE_CAP_HIGH);
    state.rates.dscr = clamp(state.rates.dscr + d, RATE_CAP_LOW + 0.5, RATE_CAP_HIGH + 1);
    state.rates.hard_money = clamp(state.rates.hard_money + d, 6, 18);
    state.rates.private_lender = clamp(state.rates.private_lender + d, 5, 15);
  }
  if (pc.force_phase === 'recession') {
    triggerRecession(state);
  } else if (pc.force_phase === 'recovery') {
    state.current_phase = 'recovery';
    state.phase_started_month = state.game_month;
  }
  if (typeof pc.c_index_boost === 'number') {
    state.price_index.C *= 1 + pc.c_index_boost / 100;
  }
  if (typeof pc.vacancy_delta === 'number') {
    (['A', 'B', 'C', 'D'] as NeighborhoodClass[]).forEach((cls) => {
      state.vacancy[cls] = Math.max(0, state.vacancy[cls] + (pc.vacancy_delta as number));
    });
  }
  if (typeof pc.a_vacancy_delta === 'number') {
    state.vacancy.A = Math.max(0, state.vacancy.A + pc.a_vacancy_delta);
  }
}

function expireEvents(state: MarketState): void {
  state.active_events = state.active_events.filter((a) => a.expires_month > state.game_month);
}

// ---------- Recession trigger ----------
export function triggerRecession(state: MarketState): MarketState {
  state.current_phase = 'recession';
  state.phase_started_month = state.game_month;
  state.recession_started_at = state.game_month;
  (['A', 'B', 'C', 'D'] as NeighborhoodClass[]).forEach((cls) => {
    state.price_index[cls] *= 0.95;
    state.vacancy[cls] = VACANCY_BASE[cls].recession;
  });
  state.min_dscr_ratio = 1.35;
  const recessionCard = MARKET_EVENTS.find((e) => e.name === 'Recession Declared');
  if (recessionCard) {
    state.active_events.push({
      event: recessionCard,
      started_month: state.game_month,
      expires_month: state.game_month + 1,
    });
  }
  state.last_updated = new Date().toISOString();
  return state;
}

// ---------- Monthly tick ----------
export function processMonthlyTick(state: MarketState): MarketState {
  state.game_month += 1;
  expireEvents(state);
  driftRates(state);
  driftPriceIndex(state);
  updateVacancy(state);
  maybeTransitionPhase(state);
  rollForMarketEvent(state);
  // Restore DSCR ratio when out of recession
  if (state.current_phase !== 'recession') state.min_dscr_ratio = 1.2;
  state.last_updated = new Date().toISOString();
  return state;
}

// ---------- Accessors ----------
export function getCurrentRates(state: MarketState): InterestRates {
  return { ...state.rates };
}

export function getPriceIndex(state: MarketState, neighborhoodClass: NeighborhoodClass): number {
  return state.price_index[neighborhoodClass];
}

export function getVacancyRate(state: MarketState, neighborhoodClass: NeighborhoodClass): number {
  return state.vacancy[neighborhoodClass];
}
