export interface EducationScreen {
  headline: string;
  body: string;
  visual: 'number_example' | 'comparison' | 'formula' | 'checklist' | 'story';
  visualData?: Record<string, unknown>;
}

export interface EducationCardContent {
  id: string;
  title: string;
  assetClass: string;
  unlockLevel: number;
  screens: EducationScreen[];
  keyTakeaway: string;
  xpReward: number;
}

export const EDUCATION_CARDS: EducationCardContent[] = [
  {
    id: 'the_1pct_rule',
    title: 'The 1% Rule',
    assetClass: 'sfr',
    unlockLevel: 1,
    screens: [
      {
        headline: 'The 1% Rule',
        body: 'A fast filter for rental deals: monthly rent should equal at least 1% of the purchase price.',
        visual: 'formula',
        visualData: { formula: 'Monthly Rent / Purchase Price ≥ 1%' },
      },
      {
        headline: 'Real Numbers',
        body: 'A $150K B-class home renting for $1,500/mo passes. A $300K home renting for $1,800/mo (0.6%) does not.',
        visual: 'number_example',
        visualData: { good: '$150K → $1,500', bad: '$300K → $1,800' },
      },
      {
        headline: 'Why It Matters',
        body: 'Properties that hit the 1% rule almost always cashflow positive after expenses. It is a screen, not the final answer.',
        visual: 'story',
      },
    ],
    keyTakeaway: 'Use the 1% rule as a quick screen. Always verify with full cashflow analysis.',
    xpReward: 50,
  },
  {
    id: 'arv_explained',
    title: 'ARV Explained',
    assetClass: 'flip',
    unlockLevel: 1,
    screens: [
      { headline: 'After Repair Value', body: 'ARV is what your property will be worth after renovation. It is your finish line.', visual: 'story' },
      { headline: 'How To Calculate', body: 'Pull 3-5 sold comparable properties within 1 mile, sold within 6 months, similar size and condition.', visual: 'checklist' },
      { headline: 'Why It Matters', body: 'Every flip and BRRRR decision is anchored to ARV. Get it wrong and your margin disappears.', visual: 'story' },
    ],
    keyTakeaway: 'ARV is the foundation of every flip. Be conservative.',
    xpReward: 75,
  },
  {
    id: '70pct_rule',
    title: 'The 70% Rule',
    assetClass: 'flip',
    unlockLevel: 1,
    screens: [
      { headline: 'The Formula', body: 'Max Offer = (ARV × 0.70) - Rehab Cost', visual: 'formula', visualData: { formula: '(ARV × 0.70) − Rehab = Max Offer' } },
      { headline: 'Real Deal', body: 'ARV $240K, rehab $45K. Max offer = ($240K × 0.70) - $45K = $123K. Pay more, lose margin.', visual: 'number_example' },
      { headline: 'Why 70%', body: '30% covers holding costs, financing, closing costs both ways, and your profit.', visual: 'story' },
    ],
    keyTakeaway: 'Never pay more than 70% of ARV minus rehab. Discipline = profit.',
    xpReward: 75,
  },
  {
    id: 'brrrr_explained',
    title: 'BRRRR Explained',
    assetClass: 'brrrr',
    unlockLevel: 3,
    screens: [
      { headline: 'B-R-R-R-R', body: 'Buy, Rehab, Rent, Refinance, Repeat. The capital recycling strategy.', visual: 'checklist' },
      { headline: 'Buy', body: 'Find a distressed property below market. Cash or hard money close.', visual: 'story' },
      { headline: 'Rehab', body: 'Force appreciation through renovation. Target ARV.', visual: 'story' },
      { headline: 'Refinance', body: 'After seasoning, cash-out refi at 75% LTV. Pull your capital back out.', visual: 'story' },
      { headline: 'Repeat', body: 'Use recovered capital to buy the next one. Same dollars, multiple properties.', visual: 'story' },
    ],
    keyTakeaway: 'BRRRR recycles capital. Same dollars, more doors.',
    xpReward: 100,
  },
  {
    id: 'infinite_returns',
    title: 'Infinite Returns',
    assetClass: 'brrrr',
    unlockLevel: 3,
    screens: [
      { headline: 'The Math', body: 'When you pull 100% of capital out via refi, your cash invested is $0. Any positive cashflow = infinite return.', visual: 'formula', visualData: { formula: 'CoC = Annual CF / Cash Invested' } },
      { headline: 'Real Example', body: '$80K buy + $40K rehab = $120K all-in. Refi at 75% LTV of $175K ARV = $131K out. You recovered everything.', visual: 'number_example' },
      { headline: 'The Catch', body: 'You still have a mortgage. Cashflow must cover the new payment with margin.', visual: 'story' },
    ],
    keyTakeaway: 'Capital recovered = infinite return. Just verify the new cashflow.',
    xpReward: 100,
  },
  {
    id: 'cash_out_refi',
    title: 'Cash Out Refinance',
    assetClass: 'brrrr',
    unlockLevel: 3,
    screens: [
      { headline: 'How It Works', body: 'Replace your existing loan with a larger one and pocket the difference in cash.', visual: 'story' },
      { headline: 'LTV Limits', body: 'Investment property: typically 75% LTV cap. Owner-occupied: up to 80%.', visual: 'number_example' },
      { headline: 'DSCR Required', body: 'New payment must still hit minimum DSCR. Higher loan = higher payment = harder to qualify.', visual: 'story' },
    ],
    keyTakeaway: 'Cash-out refi turns equity into deployable capital.',
    xpReward: 75,
  },
  {
    id: 'dscr_explained',
    title: 'DSCR Explained',
    assetClass: 'small_mf',
    unlockLevel: 8,
    screens: [
      { headline: 'Debt Service Coverage Ratio', body: 'How much income covers debt payments. Lenders use this to qualify investment loans.', visual: 'formula', visualData: { formula: '(Rent × (1 - Vacancy)) / (Payment + Expenses)' } },
      { headline: '1.20 Minimum', body: '1.20 means rent covers 120% of obligations. Margin for vacancy and surprises.', visual: 'number_example' },
      { headline: 'Recession Tightens', body: 'In recession, lenders raise the bar to 1.35. Same property may stop qualifying.', visual: 'story' },
    ],
    keyTakeaway: 'DSCR is the language of investment lending. Memorize the formula.',
    xpReward: 100,
  },
  {
    id: 'noi_explained',
    title: 'NOI Explained',
    assetClass: 'large_mf',
    unlockLevel: 14,
    screens: [
      { headline: 'Net Operating Income', body: 'Gross income minus operating expenses, BEFORE debt service. The pure performance number.', visual: 'formula', visualData: { formula: 'Gross Rent − OpEx = NOI' } },
      { headline: 'Why It Matters', body: 'Commercial properties trade on NOI. It is the unit of value in commercial real estate.', visual: 'story' },
    ],
    keyTakeaway: 'NOI is the heartbeat of commercial valuation.',
    xpReward: 100,
  },
  {
    id: 'cap_rate_explained',
    title: 'Cap Rate Explained',
    assetClass: 'large_mf',
    unlockLevel: 14,
    screens: [
      { headline: 'The Formula', body: 'Cap Rate = NOI / Property Value. The unlevered yield on the asset.', visual: 'formula', visualData: { formula: 'NOI / Value = Cap Rate' } },
      { headline: 'Compression Creates Equity', body: 'When market cap rates drop from 7% to 5%, the same NOI is worth more. Value goes up.', visual: 'number_example' },
    ],
    keyTakeaway: 'Lower cap rate = higher value at the same NOI.',
    xpReward: 100,
  },
  {
    id: 'forced_appreciation',
    title: 'Forced Appreciation',
    assetClass: 'large_mf',
    unlockLevel: 14,
    screens: [
      { headline: 'You Control Value', body: 'Commercial properties are valued on income. Raise NOI = raise value. You force appreciation.', visual: 'story' },
      { headline: '20-Unit Example', body: 'Raise rents $100/unit/mo = $24K/yr NOI. At 6% cap rate = $400K of new equity.', visual: 'number_example' },
    ],
    keyTakeaway: 'Force NOI up. Force value up. Build equity by operating.',
    xpReward: 125,
  },
  {
    id: 'depreciation_explained',
    title: 'Depreciation Explained',
    assetClass: 'sfr',
    unlockLevel: 1,
    screens: [
      { headline: 'The Paper Loss', body: 'IRS lets you deduct property value over 27.5 years (residential). It is a deduction without spending cash.', visual: 'story' },
      { headline: 'The Magic', body: 'Your property generates positive cash AND a tax loss. The tax loss can offset other income.', visual: 'story' },
    ],
    keyTakeaway: 'Depreciation is the wealthy investor\'s greatest legal advantage.',
    xpReward: 150,
  },
  {
    id: 'reps_explained',
    title: 'REPS Explained',
    assetClass: 'sfr',
    unlockLevel: 1,
    screens: [
      { headline: 'Real Estate Professional', body: '750+ hours/yr in real estate, more than any other profession. Unlocks active loss treatment.', visual: 'checklist' },
      { headline: 'The Benefit', body: 'Depreciation can offset W2 income dollar for dollar. Without REPS, it cannot.', visual: 'story' },
    ],
    keyTakeaway: 'REPS unlocks the full power of depreciation against active income.',
    xpReward: 150,
  },
  {
    id: 'cost_seg_explained',
    title: 'Cost Segregation',
    assetClass: 'large_mf',
    unlockLevel: 14,
    screens: [
      { headline: 'Accelerate Depreciation', body: 'A study identifies components that depreciate over 5, 7, or 15 years instead of 27.5/39.', visual: 'story' },
      { headline: 'Bonus Depreciation', body: 'Pull years of deductions into year 1. On a $1M asset, that can mean $200K+ first-year deduction.', visual: 'number_example' },
      { headline: 'When It Pays', body: 'Properties over $500K with REPS-active owner. Otherwise the study cost outweighs the benefit.', visual: 'checklist' },
    ],
    keyTakeaway: 'Cost seg + REPS = the most powerful tax move in real estate.',
    xpReward: 150,
  },
  {
    id: 'str_vs_ltr',
    title: 'STR vs LTR',
    assetClass: 'str',
    unlockLevel: 5,
    screens: [
      { headline: 'Same Property, Two Models', body: 'Long term: stable, low touch. Short term: 2-3x revenue, more work, more variance.', visual: 'comparison' },
      { headline: 'Risk Factors', body: 'STR: ordinance risk, seasonality, platform dependency. LTR: tenant turnover, slow appreciation.', visual: 'checklist' },
    ],
    keyTakeaway: 'STR wins in the right market. Verify ordinances first.',
    xpReward: 75,
  },
  {
    id: 'house_hacking',
    title: 'House Hacking',
    assetClass: 'small_mf',
    unlockLevel: 8,
    screens: [
      { headline: 'Live for Free', body: 'Buy a duplex/triplex/quadplex with FHA. Live in one unit. Tenants cover the mortgage.', visual: 'story' },
      { headline: 'The Math', body: '$320K quadplex, FHA 3.5% down = $11.2K. 3 units rent $2,700/mo. Your housing cost: $0.', visual: 'number_example' },
    ],
    keyTakeaway: 'House hacking is the cheapest path to your first 4 doors.',
    xpReward: 100,
  },
  {
    id: 'value_add_apartments',
    title: 'Value-Add Apartments',
    assetClass: 'large_mf',
    unlockLevel: 14,
    screens: [
      { headline: 'Buy Below Potential', body: 'Find properties with rents below market, deferred capex, or operational inefficiency.', visual: 'checklist' },
      { headline: 'Execute the Plan', body: 'Renovate units, raise rents, cut expenses. Higher NOI = higher value.', visual: 'story' },
    ],
    keyTakeaway: 'Value-add is forced appreciation in apartment form.',
    xpReward: 125,
  },
  {
    id: 'nnn_explained',
    title: 'NNN Leases',
    assetClass: 'commercial',
    unlockLevel: 16,
    screens: [
      { headline: 'Triple Net', body: 'Tenant pays property tax, insurance, and maintenance. Landlord collects pure NOI.', visual: 'story' },
      { headline: 'Credit Tenant', body: 'Quality of NNN income depends on tenant credit. Investment-grade tenants = lower cap rates.', visual: 'story' },
    ],
    keyTakeaway: 'NNN is the most passive form of commercial real estate.',
    xpReward: 100,
  },
  {
    id: '1031_exchange',
    title: '1031 Exchange',
    assetClass: 'sfr',
    unlockLevel: 1,
    screens: [
      { headline: 'Like-Kind Exchange', body: 'Sell and reinvest into another investment property — defer capital gains tax indefinitely.', visual: 'story' },
      { headline: 'The Windows', body: '45 days to identify replacement. 180 days to close.', visual: 'number_example' },
      { headline: 'Step-Up at Death', body: 'Heirs receive stepped-up basis. The deferred gains can become permanent tax-free.', visual: 'story' },
    ],
    keyTakeaway: 'Defer, defer, die. 1031 + step-up = generational wealth.',
    xpReward: 150,
  },
  {
    id: 'storage_recession_proof',
    title: 'Storage in Recessions',
    assetClass: 'storage',
    unlockLevel: 10,
    screens: [
      { headline: 'Counter-Cyclical', body: 'When people downsize, divorce, or move, they need storage. Demand often grows in downturns.', visual: 'story' },
      { headline: 'Low Operating Costs', body: 'No tenants in the units, minimal maintenance, no leasing complexity. NOI margins hit 60%+.', visual: 'number_example' },
    ],
    keyTakeaway: 'Storage is the closest thing to a recession-proof real estate asset.',
    xpReward: 100,
  },
  {
    id: 'adr_revpar_explained',
    title: 'ADR & RevPAR',
    assetClass: 'hotel',
    unlockLevel: 20,
    screens: [
      { headline: 'ADR', body: 'Average Daily Rate. Revenue / rooms sold. Tells you pricing power.', visual: 'formula', visualData: { formula: 'Room Revenue / Rooms Sold' } },
      { headline: 'RevPAR', body: 'Revenue Per Available Room. Combines ADR and occupancy. The hotel KPI.', visual: 'formula', visualData: { formula: 'ADR × Occupancy' } },
    ],
    keyTakeaway: 'RevPAR is the single number that defines a hotel\'s performance.',
    xpReward: 100,
  },
];

export function getEducationCard(id: string): EducationCardContent | undefined {
  return EDUCATION_CARDS.find((c) => c.id === id);
}
