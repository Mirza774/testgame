-- ============================================================================
-- RUMAH CERMIN / THE MIRROR HOUSE — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard -> SQL -> New query).
-- Safe to run more than once.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Rooms table
-- ---------------------------------------------------------------------------
create table if not exists public.rooms (
  id         text        primary key,
  state      jsonb       not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.rooms is
  'One row per two-player game. id is the 5-character room code.';

create index if not exists rooms_created_at_idx
  on public.rooms (created_at);

-- Needed so Realtime UPDATE payloads always carry the full new state and
-- filters on the primary key behave consistently.
alter table public.rooms replica identity full;

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
--    This is a casual, code-only game with no user accounts, so the anon
--    role needs read/write access. Codes are short, so treat a room code as
--    the only secret: do not put private information in a room state.
-- ---------------------------------------------------------------------------
alter table public.rooms enable row level security;

drop policy if exists "rooms_select_anon" on public.rooms;
create policy "rooms_select_anon"
  on public.rooms for select
  to anon, authenticated
  using (true);

drop policy if exists "rooms_insert_anon" on public.rooms;
create policy "rooms_insert_anon"
  on public.rooms for insert
  to anon, authenticated
  with check (true);

drop policy if exists "rooms_update_anon" on public.rooms;
create policy "rooms_update_anon"
  on public.rooms for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "rooms_delete_anon" on public.rooms;
create policy "rooms_delete_anon"
  on public.rooms for delete
  to anon, authenticated
  using (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.rooms to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Atomic path patch
--    Instead of writing the whole state (which loses concurrent updates),
--    each click calls room_set_path('CODE', '{clock,minute}', '41').
--    jsonb_set runs inside a single row update, so simultaneous changes from
--    both players are serialized by the row lock.
--
--    coalesce() turns SQL NULL into JSON null, which is how "a player left
--    their role" is stored (players -> {"A": null}).
-- ---------------------------------------------------------------------------
create or replace function public.room_set_path(
  p_id    text,
  p_path  text[],
  p_value jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.rooms
     set state      = jsonb_set(state, p_path, coalesce(p_value, 'null'::jsonb), true),
         updated_at = now()
   where id = p_id;
end;
$$;

revoke all on function public.room_set_path(text, text[], jsonb) from public;
grant execute on function public.room_set_path(text, text[], jsonb)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Realtime
--    The client subscribes to postgres_changes UPDATE events on rooms.
--    Without the publication entry, no updates ever arrive.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
      from pg_publication_tables
     where pubname    = 'supabase_realtime'
       and schemaname = 'public'
       and tablename  = 'rooms'
  ) then
    alter publication supabase_realtime add table public.rooms;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 5. Optional cleanup
--    Finished or abandoned rooms pile up. Run this from pg_cron, or manually
--    from time to time. Keep at least a day so players can resume.
-- ---------------------------------------------------------------------------
-- delete from public.rooms where created_at < now() - interval '7 days';

-- ---------------------------------------------------------------------------
-- 6. Smoke test (optional, safe)
-- ---------------------------------------------------------------------------
-- insert into public.rooms (id, state)
-- values ('TEST1', '{"v":1,"chapter":0}'::jsonb)
-- on conflict (id) do nothing;
--
-- select public.room_set_path('TEST1', '{chapter}', '2'::jsonb);
-- select state from public.rooms where id = 'TEST1';
-- delete from public.rooms where id = 'TEST1';
