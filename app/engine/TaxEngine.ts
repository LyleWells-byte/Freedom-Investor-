import type {
  CostSegResult,
  DepreciationSummary,
  OwnedProperty,
  ProfessionalCosts,
  REPSResult,
} from '../types/tax';

// 2024 single-filer brackets (Texas: no state)
const SINGLE_BRACKETS: [number, number][] = [
  [11600, 0.1],
  [47150, 0.12],
  [100525, 0.22],
  [191950, 0.24],
  [243725, 0.32],
  [609350, 0.35],
  [Infinity, 0.37],
];

const MARRIED_BRACKETS: [number, number][] = [
  [23200, 0.1],
  [94300, 0.12],
  [201050, 0.22],
  [383900, 0.24],
  [487450, 0.32],
  [731200, 0.35],
  [Infinity, 0.37],
];

export interface FederalTaxResult {
  grossIncome: number;
  taxableIncome: number;
  federalTax: number;
  effectiveRate: number;
  marginalRate: number;
}

export function calculateFederalTax(
  grossIncome: number,
  filingStatus: 'single' | 'married' = 'single'
): FederalTaxResult {
  const brackets = filingStatus === 'married' ? MARRIED_BRACKETS : SINGLE_BRACKETS;
  let tax = 0;
  let prev = 0;
  let marginal = 0;
  for (const [limit, rate] of brackets) {
    if (grossIncome > prev) {
      const slice = Math.min(grossIncome, limit) - prev;
      tax += slice * rate;
      marginal = rate;
      prev = limit;
      if (grossIncome <= limit) break;
    }
  }
  return {
    grossIncome,
    taxableIncome: grossIncome,
    federalTax: Math.round(tax),
    effectiveRate: grossIncome > 0 ? Math.round((tax / grossIncome) * 1000) / 10 : 0,
    marginalRate: marginal * 100,
  };
}

const COMMERCIAL_CLASSES = new Set([
  'large_mf',
  'commercial',
  'storage',
  'hotel',
  'car_wash',
]);

export function calculateDepreciation(properties: OwnedProperty[]): DepreciationSummary {
  const byProperty = properties.map((p) => {
    const isCommercial = COMMERCIAL_CLASSES.has(p.asset_class);
    const schedule: '27.5yr' | '39yr' = isCommercial ? '39yr' : '27.5yr';
    const basis = p.purchase_price * 0.8;
    const annual = basis / (isCommercial ? 39 : 27.5);
    const months = Math.min(12, Math.max(0, p.monthsHeld));
    const prorated = (annual * months) / 12;
    return {
      propertyId: p.id,
      address: p.address,
      depreciableBasis: Math.round(basis),
      annualDepreciation: Math.round(annual),
      depreciationSchedule: schedule,
      monthsHeld: months,
      proratedDepreciation: Math.round(prorated),
    };
  });
  const total = byProperty.reduce((s, l) => s + l.proratedDepreciation, 0);
  return { totalAnnualDepreciation: total, byProperty };
}

export function calculateREPSOffset(
  w2Income: number,
  totalDepreciation: number,
  repsStatus: boolean,
  passiveIncome: number
): REPSResult {
  if (repsStatus) {
    const applied = Math.min(totalDepreciation, w2Income + passiveIncome);
    return {
      repsActive: true,
      appliedOffset: applied,
      taxableIncome: Math.max(0, w2Income + passiveIncome - applied),
      unusedLosses: Math.max(0, totalDepreciation - applied),
    };
  }
  const passiveOffset = Math.min(totalDepreciation, passiveIncome);
  return {
    repsActive: false,
    appliedOffset: passiveOffset,
    taxableIncome: w2Income + Math.max(0, passiveIncome - passiveOffset),
    unusedLosses: Math.max(0, totalDepreciation - passiveOffset),
  };
}

export function calculateCostSegBenefit(
  property: OwnedProperty,
  studyCost: number,
  bonusDepreciationRate = 0.6
): CostSegResult {
  const buildingValue = property.purchase_price * 0.8;
  const fiveYr = buildingValue * 0.15;
  const sevenYr = buildingValue * 0.1;
  const fifteenYr = buildingValue * 0.1;
  const accel = fiveYr + sevenYr + fifteenYr;
  const firstYearBonus = accel * bonusDepreciationRate;
  const taxSavingsEst = firstYearBonus * 0.32;
  const netBenefit = taxSavingsEst - studyCost;
  return {
    studyCost,
    fiveYearComponents: Math.round(fiveYr),
    sevenYearComponents: Math.round(sevenYr),
    fifteenYearComponents: Math.round(fifteenYr),
    firstYearBonus: Math.round(firstYearBonus),
    netBenefit: Math.round(netBenefit),
    paybackPeriod: taxSavingsEst > 0 ? Math.round((studyCost / taxSavingsEst) * 12) : 0,
    recommendPurchase: netBenefit > 0,
  };
}

export function calculateProfessionalCosts(
  portfolioSize: number,
  hasLLC: boolean,
  _repsStatus: boolean
): ProfessionalCosts {
  let cpa = 1500;
  if (portfolioSize >= 16) cpa = 3500;
  else if (portfolioSize >= 9) cpa = 3000;
  else if (portfolioSize >= 4) cpa = 2200;

  const attorneyAnnual = hasLLC ? 300 : 0;
  const llcFormation = 0; // one-time, not annual
  return {
    cpaCost: cpa,
    attorneyAnnual,
    llcFormation,
    total: cpa + attorneyAnnual,
  };
}
