-- Link events tracking

create table if not exists public.link_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    link_id uuid not null references public.links(id) on delete cascade,
    event_type text not null check (event_type = 'open'),
    created_at timestamptz not null default now()
);

-- indexes for performance
create index if not exists link_events_user_created_at_idx on public.link_events(user_id, created_at);
create index if not exists link_events_user_link_idx on public.link_events(user_id, link_id);

-- optional quick access fields in links
alter table public.links add column if not exists open_count int default 0;
alter table public.links add column if not exists last_opened_at timestamptz;

-- row level security
alter table public.link_events enable row level security;
create policy if not exists "link_events_select" on public.link_events
    for select using (auth.uid() = user_id);
create policy if not exists "link_events_insert" on public.link_events
    for insert with check (auth.uid() = user_id);

alter table public.links enable row level security;
create policy if not exists "links_owner" on public.links
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- function to track link openings
create or replace function public.track_open(_link_id uuid)
returns void
language plpgsql
security definer
as $$
begin
    insert into public.link_events(user_id, link_id, event_type)
    values (auth.uid(), _link_id, 'open');

    update public.links
    set open_count = coalesce(open_count, 0) + 1,
        last_opened_at = now()
    where id = _link_id
      and user_id = auth.uid();
end;
$$;

grant execute on function public.track_open(uuid) to authenticated;

-- function to get usage summary
create or replace function public.get_usage_summary(_from timestamptz, _to timestamptz)
returns table (
    total_links bigint,
    top_links jsonb,
    never_opened jsonb
)
language plpgsql
security definer
as $$
declare
    top jsonb;
    never jsonb;
begin
    select count(*)
    into total_links
    from public.links
    where user_id = auth.uid();

    top := (
        select coalesce(jsonb_agg(t), '[]'::jsonb)
        from (
            select l.id, l.title, l.url, count(e.id) as open_count
            from public.links l
            join public.link_events e on e.link_id = l.id
            where l.user_id = auth.uid()
              and e.user_id = auth.uid()
              and e.created_at between _from and _to
            group by l.id, l.title
            order by count(e.id) desc
            limit 5
        ) t
    );

    never := (
        select coalesce(jsonb_agg(t), '[]'::jsonb)
        from (
            select l.id, l.title, l.url
            from public.links l
            left join public.link_events e
              on e.link_id = l.id
             and e.user_id = auth.uid()
             and e.created_at between _from and _to
            where l.user_id = auth.uid() and e.id is null
        ) t
    );

    top_links := top;
    never_opened := never;
    return next;
end;
$$;

grant execute on function public.get_usage_summary(timestamptz, timestamptz) to authenticated;
