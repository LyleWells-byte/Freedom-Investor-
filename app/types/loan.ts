export interface LoanTier {
  id: string;
  name: string;
  realPrice: number;
  inGameCapital: number;
  annualRate: number;
  termMonths: number;
  prepaySchedule: Record<string, unknown>;
  monthlyPayment: number;
  educationBlurb: string;
  realWorldAnalogy: string;
  icon: string;
  color: string;
  stripeProductId: string;
}

export interface ActiveLoan {
  id: string;
  playerId: string;
  tierId: string;
  principal: number;
  remainingBalance: number;
  annualRate: number;
  termMonths: number;
  monthsActive: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  stripePaymentId: string;
  status: 'current' | 'warning' | 'default';
  originationDate: string;
}

export interface DebtServiceStatus {
  status: 'healthy' | 'warning' | 'danger';
  totalDebtService: number;
  coverageRatio: number;
  shortfall?: number;
  monthsUntilDefault?: number;
  recommendation: string;
}

export interface LoanPaymentResult {
  loansProcessed: number;
  totalPaid: number;
  defaultsTriggered: string[];
  loansClosed: string[];
}
