export type AvatarType = 'agent' | 'new_investor' | 'w2_employee' | 'business_owner';

export interface PlayerGoals {
  types: string[];
  passive_income_target: number;
  timeline_years: number;
  vision_description: string;
  vision_image_url?: string;
}

export interface Player {
  id: string;
  clerk_user_id: string;
  display_name: string;
  avatar_type: AvatarType;
  w2_income: number;
  goals: PlayerGoals;
  level: number;
  xp: number;
  cash_balance: number;
  reps_status: boolean;
  llc_formed: boolean;
  created_at: string;
}
