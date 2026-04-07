export const GAME_CONFIG = {
  realSecondsPerGameDay: 60,
  realMinutesPerGameMonth: 60,
  realHoursPerGameYear: 12,
  speedMultipliers: [1, 2, 5] as const,

  startingCash: {
    agent: 50000,
    new_investor: 75000,
    w2_employee: 50000,
    business_owner: 60000,
  },
  businessOwnerCreditLine: 25000,
  businessOwnerCreditRate: 0.07,

  mortgageDefaults: {
    propertyTaxRate: 0.018,
    insuranceRate: 0.0075,
    maintenanceReserve: 0.05,
    capexReserve: 0.05,
    managementRate: 0.09,
  },

  dscrMinNormal: 1.2,
  dscrMinRecession: 1.35,

  listingsPerZone: { min: 8, max: 15 },
  newListingsPerWeek: { min: 2, max: 3 },
  propertyExpiryDays: 60,
  priceReductionPerMonth: 0.02,

  forcedSaleDiscount: 0.1,

  wolfPackLoanAmount: 250000,
  wolfPackTriggerLevel: 5,
  wolfPackRetriggerLevels: [10, 15],

  creatorRefCode: 'LYLE',
  creatorRecruitingUrl: 'https://join.exprealty.com/lyle',
  creatorCalendarUrl: 'https://calendly.com/freedominvestor',
  creatorTRECNumber: '581169-SA',
  creatorName: 'Lyle',

  freeTierMaxProperties: 5,
  freeTierMaxCities: 1,

  xp: {
    firstProperty: 500,
    propertyPurchase: 100,
    profitableFlip: 300,
    brrrCapitalRecovered: 400,
    marketEventSurvived: 150,
    educationCardComplete: 50,
    annualTaxFiling: 200,
    llcFormed: 150,
    cpaHired: 100,
    loanRepaid: 300,
    loanDefault: 100,
    wolfPackCurious: 250,
    wolfPackMember: 2500,
    packRecruited: 500,
    syndicationFunded: 200,
    costSegOrdered: 150,
    repsQuestStarted: 500,
    repsActivated: 1000,
    annualReviewComplete: 300,
  },
} as const;

export type XPEventType = keyof typeof GAME_CONFIG.xp;
