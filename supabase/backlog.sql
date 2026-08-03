create table if not exists public.backlog_entries (
  id text primary key,
  title text not null,
  status text not null check (status in ('playing', 'completed', 'backlog', 'dropped', 'replaying')),
  platforms text[] not null default '{}',
  rating integer,
  rank integer,
  added_at date,
  started_at date,
  finished_at date,
  playtime text,
  time_to_beat text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_backlog_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists backlog_entries_set_updated_at on public.backlog_entries;

create trigger backlog_entries_set_updated_at
before update on public.backlog_entries
for each row
execute function public.set_backlog_updated_at();

create index if not exists backlog_entries_rank_idx on public.backlog_entries (rank asc nulls last);
create index if not exists backlog_entries_status_idx on public.backlog_entries (status);
