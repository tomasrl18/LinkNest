-- Threads feature schema for LinkNest
-- Run this in your Supabase SQL editor

-- Ensure pgcrypto is available for gen_random_uuid
create extension if not exists pgcrypto;

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  tags text[] default '{}'::text[],
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.thread_links (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  link_id uuid not null references public.links(id) on delete cascade,
  position integer not null default 0,
  note text,
  created_at timestamptz not null default now(),
  unique (thread_id, link_id)
);

-- Simple updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists threads_set_updated_at on public.threads;
create trigger threads_set_updated_at
before update on public.threads
for each row execute function public.set_updated_at();

-- RLS policies
alter table public.threads enable row level security;
alter table public.thread_links enable row level security;

-- Threads: owners can manage; public readable
drop policy if exists threads_select on public.threads;
create policy threads_select on public.threads
for select using (
  is_public or auth.uid() = user_id
);

drop policy if exists threads_insert on public.threads;
create policy threads_insert on public.threads
for insert with check (
  auth.uid() = user_id
);

drop policy if exists threads_update on public.threads;
create policy threads_update on public.threads
for update using (
  auth.uid() = user_id
);

drop policy if exists threads_delete on public.threads;
create policy threads_delete on public.threads
for delete using (
  auth.uid() = user_id
);

-- Thread links: readable if thread readable; writeable by owner
drop policy if exists thread_links_select on public.thread_links;
create policy thread_links_select on public.thread_links
for select using (
  exists (
    select 1 from public.threads t
    where t.id = thread_id and (t.is_public or t.user_id = auth.uid())
  )
);

drop policy if exists thread_links_insert on public.thread_links;
create policy thread_links_insert on public.thread_links
for insert with check (
  exists (
    select 1 from public.threads t
    where t.id = thread_id and t.user_id = auth.uid()
  )
);

drop policy if exists thread_links_update on public.thread_links;
create policy thread_links_update on public.thread_links
for update using (
  exists (
    select 1 from public.threads t
    where t.id = thread_id and t.user_id = auth.uid()
  )
);

drop policy if exists thread_links_delete on public.thread_links;
create policy thread_links_delete on public.thread_links
for delete using (
  exists (
    select 1 from public.threads t
    where t.id = thread_id and t.user_id = auth.uid()
  )
);

