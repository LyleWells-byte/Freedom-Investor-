export type NotificationType =
  | 'market_event'
  | 'monthly_report'
  | 'level_up'
  | 'wolf_pack_lead'
  | 'debt_warning'
  | 'pack_message'
  | 'achievement';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, unknown>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'gold' | 'market';
  title: string;
  subtitle?: string;
  duration?: number;
  navigateTo?: string;
}
