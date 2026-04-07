-- Freedom Investor: The Game - Initial Schema
-- Migration: 001_initial_schema

create extension if not exists "pgcrypto";

-- players
create table players (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique,
  display_name text,
  avatar_type text,
  w2_income numeric,
  goals jsonb,
  vision_image_url text,
  level integer default 1,
  xp integer default 0,
  cash_balance numeric default 50000,
  created_at timestamptz default now()
);

-- properties
create table properties (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  neighborhood_class text,
  asset_class text,
  purchase_price numeric,
  mortgage_type text,
  mortgage_balance numeric,
  mortgage_rate numeric,
  monthly_payment numeric,
  current_value numeric,
  monthly_rent numeric,
  vacancy_rate numeric,
  acquisition_date timestamptz,
  prepay_penalty_schedule jsonb
);

-- market_state
create table market_state (
  id uuid primary key default gen_random_uuid(),
  city_id text,
  current_phase text,
  interest_rate_conventional numeric,
  interest_rate_dscr numeric,
  price_index_a numeric,
  price_index_b numeric,
  price_index_c numeric,
  price_index_d numeric,
  last_updated timestamptz
);

-- market_events
create table market_events (
  id uuid primary key default gen_random_uuid(),
  city_id text,
  event_type text,
  event_data jsonb,
  fired_at timestamptz,
  expires_at timestamptz
);

-- loans
create table loans (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  loan_type text,
  principal numeric,
  rate numeric,
  term_months integer,
  monthly_payment numeric,
  origination_date timestamptz,
  stripe_payment_id text
);

-- tax_records
create table tax_records (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  game_year integer,
  w2_income numeric,
  total_depreciation numeric,
  reps_status boolean,
  tax_savings numeric,
  cpa_cost numeric
);

-- clans
create table clans (
  id uuid primary key default gen_random_uuid(),
  name text,
  creator_id uuid references players(id),
  member_count integer default 1,
  pack_points integer default 0,
  created_at timestamptz default now()
);

-- clan_members
create table clan_members (
  id uuid primary key default gen_random_uuid(),
  clan_id uuid references clans(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  role text,
  joined_at timestamptz default now()
);

-- referrals
create table referrals (
  id uuid primary key default gen_random_uuid(),
  referred_player_id uuid references players(id) on delete cascade,
  referrer_code text,
  signup_date timestamptz,
  level5_triggered_at timestamptz,
  cta_clicked_at timestamptz,
  license_transferred_at timestamptz,
  notes text
);

-- creator_accounts
create table creator_accounts (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  ref_code text unique,
  is_creator boolean default false,
  event_mode_active boolean default false
);

-- wolf_pack_pitch_events
create table wolf_pack_pitch_events (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  trigger_level integer,
  step_reached integer,
  cta_clicked boolean default false,
  timestamp timestamptz default now()
);

-- education_cards
create table education_cards (
  id uuid primary key default gen_random_uuid(),
  topic text,
  content_json jsonb,
  unlock_level integer,
  asset_class text
);
