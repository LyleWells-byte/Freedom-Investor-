export interface TaxCalculation {
  grossIncome: number;
  totalDepreciation: number;
  repsOffset: number;
  taxableIncome: number;
  federalTaxBefore: number;
  federalTaxAfter: number;
  taxSavings: number;
  effectiveRateBefore: number;
  effectiveRateAfter: number;
  unusedLosses: number;
  carryForwardLosses: number;
}

export interface DepreciationLine {
  propertyId: string;
  address: string;
  depreciableBasis: number;
  annualDepreciation: number;
  depreciationSchedule: '27.5yr' | '39yr';
  monthsHeld: number;
  proratedDepreciation: number;
}

export interface DepreciationSummary {
  totalAnnualDepreciation: number;
  byProperty: DepreciationLine[];
}

export interface CostSegResult {
  studyCost: number;
  fiveYearComponents: number;
  sevenYearComponents: number;
  fifteenYearComponents: number;
  firstYearBonus: number;
  netBenefit: number;
  paybackPeriod: number;
  recommendPurchase: boolean;
}

export interface REPSResult {
  repsActive: boolean;
  appliedOffset: number;
  taxableIncome: number;
  unusedLosses: number;
}

export interface ProfessionalCosts {
  cpaCost: number;
  attorneyAnnual: number;
  llcFormation: number;
  total: number;
}

export interface OwnedProperty {
  id: string;
  address: string;
  purchase_price: number;
  asset_class: string;
  monthsHeld: number;
}
