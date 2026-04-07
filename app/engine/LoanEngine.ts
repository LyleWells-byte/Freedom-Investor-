import type { ActiveLoan, DebtServiceStatus, LoanPaymentResult, LoanTier } from '../types/loan';

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return Math.round((principal / termMonths) * 100) / 100;
  const r = annualRate / 12;
  const pmt = (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
  return Math.round(pmt * 100) / 100;
}

export function calculatePrepayPenalty(
  loanTier: string,
  monthsActive: number,
  remainingBalance: number
): number {
  switch (loanTier) {
    case 'heloc':
      return 0;
    case 'hard_money':
      return monthsActive < 6 ? remainingBalance * 0.02 : 0;
    case 'private_lender':
      return monthsActive <= 12 ? remainingBalance * 0.01 : 0;
    case 'institutional_loc': {
      if (monthsActive <= 12) return remainingBalance * 0.03;
      if (monthsActive <= 24) return remainingBalance * 0.02;
      if (monthsActive <= 36) return remainingBalance * 0.01;
      return 0;
    }
    default:
      return 0;
  }
}

export function checkDebtServiceCoverage(
  playerMonthlyCashflow: number,
  playerCashReserves: number,
  allLoanPayments: number[]
): DebtServiceStatus {
  const totalDebtService = allLoanPayments.reduce((s, p) => s + p, 0);
  const coverageBase = playerMonthlyCashflow + playerCashReserves / 3;
  const coverageRatio = totalDebtService > 0 ? coverageBase / totalDebtService : 999;

  if (coverageBase < totalDebtService) {
    const shortfall = totalDebtService - playerMonthlyCashflow;
    const months = shortfall > 0 ? Math.floor(playerCashReserves / shortfall) : 0;
    return {
      status: 'danger',
      totalDebtService,
      coverageRatio: Math.round(coverageRatio * 100) / 100,
      shortfall: Math.round(shortfall),
      monthsUntilDefault: months,
      recommendation: 'You are over-leveraged. Sell an underperforming property or cut expenses now.',
    };
  }

  if (coverageRatio < 1.1) {
    return {
      status: 'warning',
      totalDebtService,
      coverageRatio: Math.round(coverageRatio * 100) / 100,
      recommendation: 'Tight coverage. Build cash reserves before adding new debt.',
    };
  }

  return {
    status: 'healthy',
    totalDebtService,
    coverageRatio: Math.round(coverageRatio * 100) / 100,
    recommendation: 'Healthy coverage. You have room to deploy more capital strategically.',
  };
}

export function processMonthlyLoanPayments(
  _playerId: string,
  loans: ActiveLoan[]
): LoanPaymentResult {
  const result: LoanPaymentResult = {
    loansProcessed: 0,
    totalPaid: 0,
    defaultsTriggered: [],
    loansClosed: [],
  };
  for (const loan of loans) {
    if (loan.status === 'default') continue;
    loan.monthsActive += 1;
    loan.remainingBalance = Math.max(0, loan.remainingBalance - loan.monthlyPayment);
    result.loansProcessed += 1;
    result.totalPaid += loan.monthlyPayment;
    if (loan.remainingBalance <= 0) {
      result.loansClosed.push(loan.id);
    }
  }
  return result;
}

export function triggerDefaultSequence(loan: ActiveLoan): void {
  loan.status = 'warning';
  // 30 in-game day countdown handled by tick loop
}

export interface ForcedSaleResult {
  propertyId: string;
  marketValue: number;
  forcedSalePrice: number;
  loss: number;
  netProceeds: number;
}

export function triggerForcedSale(
  _playerId: string,
  property: { id: string; current_value: number; mortgage_balance?: number },
  prepayPenalty = 0
): ForcedSaleResult {
  const marketValue = property.current_value;
  const forcedSalePrice = Math.round(marketValue * 0.9);
  const mortgagePayoff = property.mortgage_balance ?? 0;
  const netProceeds = Math.max(0, forcedSalePrice - mortgagePayoff - prepayPenalty);
  return {
    propertyId: property.id,
    marketValue,
    forcedSalePrice,
    loss: marketValue - forcedSalePrice,
    netProceeds,
  };
}

export const LOAN_TIERS: LoanTier[] = [
  {
    id: 'heloc',
    name: 'Personal HELOC',
    realPrice: 4.99,
    inGameCapital: 50000,
    annualRate: 0.09,
    termMonths: 12,
    prepaySchedule: { type: 'none' },
    monthlyPayment: calculateLoanPayment(50000, 0.09, 12),
    educationBlurb:
      'A Home Equity Line of Credit lets homeowners borrow against their equity. Fast access to capital at relatively low rates. Real investors use HELOCs to fund down payments on investment properties.',
    realWorldAnalogy:
      'This is exactly how thousands of investors funded their first deal — borrowing against their primary home to buy their first rental.',
    icon: '🏠',
    color: '#4A90E2',
    stripeProductId: 'price_heloc_499',
  },
  {
    id: 'hard_money',
    name: 'Hard Money Draw',
    realPrice: 9.99,
    inGameCapital: 150000,
    annualRate: 0.12,
    termMonths: 18,
    prepaySchedule: { type: 'short_term', threshold: 6, percent: 0.02 },
    monthlyPayment: calculateLoanPayment(150000, 0.12, 18),
    educationBlurb:
      'Hard money lenders are asset-based — they lend on the property value, not your credit. Fast close, high rate, short term. Built for flips and BRRRRs.',
    realWorldAnalogy:
      'The tool every serious flipper uses. Expensive by design — it forces you to move fast and execute.',
    icon: '⚡',
    color: '#F5A623',
    stripeProductId: 'price_hardmoney_999',
  },
  {
    id: 'private_lender',
    name: 'Private Lender Line',
    realPrice: 19.99,
    inGameCapital: 300000,
    annualRate: 0.08,
    termMonths: 24,
    prepaySchedule: { type: 'year_one', percent: 0.01 },
    monthlyPayment: calculateLoanPayment(300000, 0.08, 24),
    educationBlurb:
      'Private money comes from individuals — not banks. Often your network: friends, family, business contacts with capital sitting in low-yield accounts. More flexible than hard money, cheaper than most alternatives.',
    realWorldAnalogy:
      'The most powerful capital source in real estate. Relationships are your balance sheet.',
    icon: '🤝',
    color: '#7ED321',
    stripeProductId: 'price_private_1999',
  },
  {
    id: 'institutional_loc',
    name: 'Institutional Line of Credit',
    realPrice: 79.99,
    inGameCapital: 750000,
    annualRate: 0.065,
    termMonths: 36,
    prepaySchedule: { type: 'step_down', schedule: [3, 2, 1] },
    monthlyPayment: calculateLoanPayment(750000, 0.065, 36),
    educationBlurb:
      'Institutional credit lines are reserved for experienced investors with proven track records. Lower rates, larger capital, longer terms — but with strict covenants and prepay penalties.',
    realWorldAnalogy:
      'This is what separates amateur investors from operators. Access to institutional capital changes the size of deals you can do.',
    icon: '🏦',
    color: '#FFD700',
    stripeProductId: 'price_institutional_7999',
  },
];

export function getLoanTier(id: string): LoanTier | undefined {
  return LOAN_TIERS.find((t) => t.id === id);
}
