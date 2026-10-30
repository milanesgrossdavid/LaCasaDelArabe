-- Ejecuta este archivo en Supabase > SQL Editor después de crear el proyecto
-- y de haber ejecutado schema.sql (usa la función public.is_store_owner()).

create table if not exists public.announcement (
  id integer primary key default 1 check (id = 1),
  active boolean not null default false,
  messages text[] not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.announcement (id) values (1) on conflict (id) do nothing;

alter table public.announcement enable row level security;

drop policy if exists "Public can read active announcement" on public.announcement;
create policy "Public can read active announcement" on public.announcement for select to anon, authenticated using (active = true);

drop policy if exists "Owner can manage announcement" on public.announcement;
create policy "Owner can manage announcement" on public.announcement for all to authenticated using (public.is_store_owner()) with check (public.is_store_owner());
