import type { CashflowBreakdown, MortgageType } from '../types/mortgage';

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return principal / termMonths;
  const r = annualRate / 100 / 12;
  const pmt = (principal * r) / (1 - Math.pow(1 + r, -termMonths));
  return Math.round(pmt * 100) / 100;
}

export function calculateDSCR(
  monthlyRent: number,
  vacancyRate: number,
  monthlyPayment: number,
  monthlyExpenses: number
): number {
  const denom = monthlyPayment + monthlyExpenses;
  if (denom <= 0) return 0;
  const ratio = (monthlyRent * (1 - vacancyRate)) / denom;
  return Math.round(ratio * 100) / 100;
}

export function calculatePropertyTax(purchasePrice: number): number {
  return Math.round((purchasePrice * 0.018) / 12);
}

export function calculateInsurance(propertyValue: number, spikeMultiplier = 1): number {
  return Math.round(((propertyValue * 0.0075) / 12) * spikeMultiplier);
}

export function calculateCashflow(
  monthlyRent: number,
  vacancyRate: number,
  monthlyPayment: number,
  propertyTaxMonthly: number,
  insuranceMonthly: number,
  managementRate: number,
  maintenanceReserve: number,
  capexReserve: number,
  downPayment = 0
): CashflowBreakdown {
  const grossRent = monthlyRent;
  const vacancyLoss = Math.round(grossRent * vacancyRate);
  const effectiveGrossIncome = grossRent - vacancyLoss;
  const propertyManagement = Math.round(effectiveGrossIncome * managementRate);
  const totalExpenses =
    propertyManagement +
    monthlyPayment +
    propertyTaxMonthly +
    insuranceMonthly +
    maintenanceReserve +
    capexReserve;
  const netCashflow = effectiveGrossIncome - totalExpenses;
  const annualCashflow = netCashflow * 12;
  const coc = downPayment > 0 ? Math.round((annualCashflow / downPayment) * 1000) / 10 : 0;
  return {
    grossRent,
    vacancyLoss,
    effectiveGrossIncome,
    propertyManagement,
    mortgage: monthlyPayment,
    propertyTax: propertyTaxMonthly,
    insurance: insuranceMonthly,
    maintenanceReserve,
    capexReserve,
    totalExpenses,
    netCashflow,
    cashOnCashReturn: coc,
    annualCashflow,
  };
}

export function getPrepayPenalty(
  loanType: MortgageType,
  monthsSinceOrigination: number,
  loanBalance: number
): number {
  const year = Math.floor(monthsSinceOrigination / 12) + 1;
  switch (loanType) {
    case 'dscr': {
      if (year === 1) return loanBalance * 0.03;
      if (year === 2) return loanBalance * 0.02;
      if (year === 3) return loanBalance * 0.01;
      return 0;
    }
    case 'hard_money':
      return monthsSinceOrigination < 6 ? loanBalance * 0.02 : 0;
    case 'private_lender':
      return year === 1 ? loanBalance * 0.01 : 0;
    case 'conventional':
    case 'cash':
    default:
      return 0;
  }
}

export const MIN_DSCR_NORMAL = 1.2;
export const MIN_DSCR_RECESSION = 1.35;
