export type MortgageType = 'conventional' | 'dscr' | 'hard_money' | 'private_lender' | 'cash';

export interface PrepayPenaltySchedule {
  type: 'step_down' | 'short_term' | 'year_one' | 'none';
  schedule?: number[]; // percent per year
  monthsThreshold?: number;
  flatPercent?: number;
}

export interface MortgageOption {
  type: MortgageType;
  label: string;
  rate: number;
  downPaymentPercent: number;
  termMonths: number;
  prepayPenaltySchedule: PrepayPenaltySchedule;
  requiresDSCR: boolean;
  minDSCR: number;
  bestFor: string;
  educationBlurb: string;
}

export interface MortgageSelection {
  option: MortgageOption;
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  dscrQualified: boolean;
  dscrRatio: number;
}

export interface CashflowBreakdown {
  grossRent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  propertyManagement: number;
  mortgage: number;
  propertyTax: number;
  insurance: number;
  maintenanceReserve: number;
  capexReserve: number;
  totalExpenses: number;
  netCashflow: number;
  cashOnCashReturn: number;
  annualCashflow: number;
}
