-- Supabase SQL Editor에서 한 번 실행하세요.
create table if not exists public.fortune_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fortune_date date not null,
  result_json jsonb,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, fortune_date)
);

alter table public.fortune_logs enable row level security;

create policy "Users can view their own fortune logs"
on public.fortune_logs for select
using (auth.uid() = user_id);

create policy "Users can insert their own fortune logs"
on public.fortune_logs for insert
with check (auth.uid() = user_id);

create policy "Users can update their own fortune logs"
on public.fortune_logs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own fortune logs"
on public.fortune_logs for delete
using (auth.uid() = user_id);
