import type { MarketEvent } from './MarketEngine';

let Notifications: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifications = require('expo-notifications');
} catch {
  Notifications = null;
}

export async function registerForNotifications(_playerId: string): Promise<string | null> {
  if (!Notifications) return null;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return null;
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    // TODO: persist token to player record
    return token;
  } catch {
    return null;
  }
}

async function schedule(content: any, trigger: any = null) {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({ content, trigger });
  } catch {
    /* ignore */
  }
}

export function scheduleMarketEventNotification(event: MarketEvent): void {
  schedule({
    title: '⚡ Market Alert',
    body: event.player_message,
    data: { type: 'market_event', eventId: event.id },
  });
}

export function scheduleMonthlyReport(gameDate: string): void {
  schedule({
    title: '📊 Monthly Report Ready',
    body: `Your ${gameDate} cashflow report is ready. How did your portfolio perform?`,
    data: { type: 'monthly_report' },
  });
}

export function scheduleWolfPackAlert(playerName: string, playerId: string): void {
  schedule({
    title: '🔥 Wolf Pack Lead!',
    body: `${playerName} just clicked Join the Wolf Pack. Strike while hot.`,
    data: { type: 'wolf_pack_lead', playerId },
  });
}

export function scheduleLevelUpAlert(newLevel: number, unlockName?: string): void {
  schedule({
    title: '🏆 Level Up!',
    body: unlockName
      ? `Level ${newLevel} reached. ${unlockName} is now available.`
      : `Level ${newLevel} reached. Keep building.`,
    data: { type: 'level_up', newLevel },
  });
}

export function scheduleDebtWarning(monthsUntilDefault: number): void {
  schedule({
    title: '⚠️ Debt Service Warning',
    body: `Your cashflow won't cover your loans in ${monthsUntilDefault} months. Take action now.`,
    data: { type: 'debt_warning' },
  });
}
