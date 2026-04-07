export interface TutorialStep {
  id: number;
  title: string;
  body: string;
  targetElement?: string;
  navigateTo?: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to Freedom Investor',
    body:
      "This is not just a game.\nEverything you learn here works in real life too.\nLet's make your first move.",
  },
  { id: 2, title: 'The Map', body: 'This is your city. 4 neighborhoods. Different risks. Different rewards.', targetElement: 'cityMap' },
  { id: 3, title: 'Browse Properties', body: 'Every property shows you projected cashflow before you buy. No guessing. Just math.', targetElement: 'propertyCard' },
  { id: 4, title: 'The Cashflow Calculator', body: 'This is the full picture. Rent minus every expense. What is left is yours.', targetElement: 'cashflowCalc' },
  { id: 5, title: 'Buy Your First Property', body: 'Ready? Your first deal changes everything. Tap Buy Now.', targetElement: 'buyBtn' },
  { id: 6, title: 'Mortgage Selection', body: 'Most investors use DSCR loans. No W2 verification. The property qualifies itself.', targetElement: 'dscrCard' },
  { id: 7, title: 'Confirm Purchase', body: 'Check your numbers. Check your reserves. Then close the deal.', targetElement: 'confirmBtn' },
  { id: 8, title: 'Dashboard', body: 'Watch this number grow. Every in-game month it collects. This is passive income in action.', targetElement: 'cashflowTicker' },
  { id: 9, title: 'Market Events', body: 'The market moves every month. Events change everything. Stay alert.', targetElement: 'eventRow' },
  { id: 10, title: 'Freedom Academy', body: 'Every strategy has a lesson. Start with DSCR Explained.', targetElement: 'academyTab' },
  { id: 11, title: 'Vision Board', body: 'Your goals are in here. Check your progress every time you play.', targetElement: 'profileTab' },
  {
    id: 12,
    title: 'Tutorial Complete',
    body: "You know enough to start building.\nThe rest you'll learn by doing. That's how real investors learn too.",
  },
];

export function getTutorialStep(id: number): TutorialStep | undefined {
  return TUTORIAL_STEPS.find((s) => s.id === id);
}

export function totalTutorialSteps(): number {
  return TUTORIAL_STEPS.length;
}
