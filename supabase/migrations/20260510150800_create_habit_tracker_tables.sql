create extension if not exists pgcrypto;

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  day_index integer not null check (day_index between 1 and 31),
  coins_earned integer not null check (coins_earned between 0 and 10),
  date date not null,
  unique (habit_id, date)
);

create index if not exists completions_habit_id_idx
  on public.completions (habit_id);

create index if not exists completions_date_idx
  on public.completions (date);

alter table public.habits enable row level security;
alter table public.completions enable row level security;

drop policy if exists "Prototype public read habits" on public.habits;
create policy "Prototype public read habits"
  on public.habits
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Prototype public insert habits" on public.habits;
create policy "Prototype public insert habits"
  on public.habits
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Prototype public read completions" on public.completions;
create policy "Prototype public read completions"
  on public.completions
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Prototype public insert completions" on public.completions;
create policy "Prototype public insert completions"
  on public.completions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Prototype public delete completions" on public.completions;
create policy "Prototype public delete completions"
  on public.completions
  for delete
  to anon, authenticated
  using (true);
