create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text,
  display_name text not null,
  age integer,
  email text,
  profession text,
  learner_level text not null default 'Junior',
  grade text,
  school_name text,
  school_location text,
  curriculum text,
  learning_goal text,
  avatar text,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

create or replace function public.is_username_available(candidate text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.profiles
    where lower(username) = lower(trim(candidate))
  );
$$;

grant execute on function public.is_username_available(text) to anon, authenticated;

create table if not exists public.chapters (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  order_number integer not null unique,
  required_xp integer not null default 0
);

create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  description text,
  lesson_content jsonb not null default '{}'::jsonb,
  order_number integer not null,
  xp_reward integer not null default 50
);

create table if not exists public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text
);

create table if not exists public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  quiz_score integer,
  xp_earned integer not null default 0,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

create table if not exists public.badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  icon text,
  requirement jsonb not null default '{}'::jsonb
);

create table if not exists public.student_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key(user_id, badge_id)
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.student_badges enable row level security;

alter table public.profiles add column if not exists credits integer not null default 100;
alter table public.profiles add column if not exists learner_level text not null default 'Junior';

create table if not exists public.activity_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_key text not null,
  hints_used integer not null default 0,
  credits_spent integer not null default 0,
  xp_earned integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  unique(user_id, activity_key)
);

alter table public.activity_progress enable row level security;
drop policy if exists "activity progress own rows" on public.activity_progress;
drop policy if exists "activity progress select own rows" on public.activity_progress;
create policy "activity progress select own rows"
on public.activity_progress for select
using (auth.uid() = user_id);

create or replace function public.use_activity_hint(activity text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_credits integer;
  next_hints integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select credits into current_credits from public.profiles where user_id = auth.uid() for update;
  if current_credits is null then raise exception 'profile_not_found'; end if;
  if current_credits < 1 then raise exception 'insufficient_credits'; end if;

  insert into public.activity_progress (user_id, activity_key, hints_used, credits_spent)
  values (auth.uid(), activity, 1, 1)
  on conflict (user_id, activity_key) do update set
    hints_used = activity_progress.hints_used + 1,
    credits_spent = activity_progress.credits_spent + 1;

  select hints_used into next_hints from public.activity_progress where user_id = auth.uid() and activity_key = activity;
  update public.profiles set credits = credits - 1, updated_at = now() where user_id = auth.uid();
  return jsonb_build_object('credits', current_credits - 1, 'hints_used', next_hints);
end;
$$;

create or replace function public.complete_activity(activity text, base_xp integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  activity_row public.activity_progress;
  awarded integer;
  current_xp integer;
  current_level integer;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  base_xp := least(greatest(base_xp, 0), 100);

  insert into public.activity_progress (user_id, activity_key)
  values (auth.uid(), activity)
  on conflict (user_id, activity_key) do nothing;
  select * into activity_row from public.activity_progress where user_id = auth.uid() and activity_key = activity for update;
  if activity_row.completed then
    select xp, level into current_xp, current_level from public.profiles where user_id = auth.uid();
    return jsonb_build_object('xp', current_xp, 'level', current_level, 'awarded', 0, 'already_completed', true);
  end if;

  awarded := greatest(0, base_xp - activity_row.hints_used * 5);
  update public.activity_progress set xp_earned = awarded, completed = true, completed_at = now() where id = activity_row.id;
  update public.profiles as profile
  set xp = profile.xp + awarded,
      level = greatest(1, floor((profile.xp + awarded) / 250.0)::integer + 1),
      updated_at = now()
  where profile.user_id = auth.uid()
  returning profile.xp, profile.level into current_xp, current_level;
  return jsonb_build_object('xp', current_xp, 'level', current_level, 'awarded', awarded, 'already_completed', false);
end;
$$;

grant execute on function public.use_activity_hint(text) to authenticated;
grant execute on function public.complete_activity(text, integer) to authenticated;

notify pgrst, 'reload schema';

drop policy if exists "profiles own row" on public.profiles;
drop policy if exists "profiles select own row" on public.profiles;
drop policy if exists "profiles insert own row" on public.profiles;
drop policy if exists "profiles update own row" on public.profiles;

create policy "profiles select own row"
on public.profiles for select
using (auth.uid() = user_id);

create policy "profiles insert own row"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "profiles update own row"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Row-level policy only proves *which* row a client may touch, not which
-- columns. Without this, a client could pass the "own row" check above and
-- still set xp/level/credits/streak directly, bypassing complete_activity
-- and use_activity_hint. Those columns are only writable via the
-- security-definer RPCs above (use_activity_hint, complete_activity), which
-- run as table owner and bypass RLS.
revoke update on public.profiles from authenticated;
grant update (
  username, display_name, age, email, profession, learner_level, grade,
  school_name, school_location, curriculum, learning_goal, avatar, updated_at
) on public.profiles to authenticated;

drop policy if exists "progress own rows" on public.lesson_progress;
create policy "progress own rows"
on public.lesson_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "badges own rows" on public.student_badges;
create policy "badges own rows"
on public.student_badges for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into public.chapters (title, description, order_number, required_xp) values
('Meet Python', 'Print, variables, numbers, strings and calculations', 1, 0),
('Make Decisions', 'Booleans, comparisons, if, elif and else', 2, 250),
('Repeat Yourself', 'for, while and range', 3, 600),
('Lists', 'Store collections of information', 4, 1000),
('Functions', 'Build reusable powers', 5, 1500)
on conflict (order_number) do nothing;

insert into public.badges (name, description, icon) values
('Python Explorer', 'Completed your first Python lesson', '🐍'),
('Variable Explorer', 'Mastered Python variables', '📦'),
('Decision Maker', 'Completed conditional logic', '🧭'),
('Loop Hero', 'Mastered repetition', '🔁'),
('Function Builder', 'Created reusable functions', '🧩')
on conflict (name) do nothing;
