-- Ejecuta este archivo en Supabase > SQL Editor después de crear el proyecto.
create extension if not exists pgcrypto;

create table if not exists public.app_settings (
  id integer primary key default 1 check (id = 1),
  owner_id uuid references auth.users(id) on delete set null
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.perfumes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null,
  description text not null default '',
  gender text not null default 'Unisex' check (gender in ('Mujer','Hombre','Unisex')),
  family text not null default 'Fresca',
  notes jsonb not null default '{"top":[],"heart":[],"base":[]}'::jsonb,
  size_ml integer not null default 50 check (size_ml > 0),
  price numeric(10,2) not null default 0 check (price >= 0),
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  published boolean not null default true,
  is_new boolean not null default false,
  occasions text[] not null default '{}',
  season text[] not null default '{}',
  intensity text not null default 'Moderada',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.banner (
  id integer primary key default 1 check (id = 1), active boolean not null default false,
  image text not null default '', title text not null default '', body text not null default '', button_text text not null default '', button_url text not null default '', updated_at timestamptz not null default now()
);
insert into public.banner (id) values (1) on conflict (id) do nothing;

create table if not exists public.business (
  id integer primary key default 1 check (id = 1), name text not null default 'Maison de Parfum', story text not null default '',
  address text not null default '', hours text not null default '', phone text not null default '', whatsapp text not null default '',
  instagram text not null default '', order_message text not null default 'Hola, quisiera hacer este pedido:', updated_at timestamptz not null default now()
);
insert into public.business (id) values (1) on conflict (id) do nothing;

alter table public.app_settings enable row level security;
alter table public.perfumes enable row level security;
alter table public.banner enable row level security;
alter table public.business enable row level security;

drop policy if exists "Owner can read app settings" on public.app_settings;
create policy "Owner can read app settings" on public.app_settings for select to authenticated using (owner_id = auth.uid());

create or replace function public.is_store_owner() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.app_settings where id = 1 and owner_id = auth.uid());
$$;

-- El público puede leer productos publicados (incluidos los agotados para mostrarlos como tales), banner activo y datos de contacto.
drop policy if exists "Public can read in-stock perfumes" on public.perfumes;
create policy "Public can read in-stock perfumes" on public.perfumes for select to anon, authenticated using (published = true);
drop policy if exists "Owner can manage all perfumes" on public.perfumes;
create policy "Owner can manage all perfumes" on public.perfumes for all to authenticated using (public.is_store_owner()) with check (public.is_store_owner());
drop policy if exists "Public can read active banner" on public.banner;
create policy "Public can read active banner" on public.banner for select to anon, authenticated using (active = true);
drop policy if exists "Owner can manage banner" on public.banner;
create policy "Owner can manage banner" on public.banner for all to authenticated using (public.is_store_owner()) with check (public.is_store_owner());
drop policy if exists "Public can read business info" on public.business;
create policy "Public can read business info" on public.business for select to anon, authenticated using (true);
drop policy if exists "Owner can manage business info" on public.business;
create policy "Owner can manage business info" on public.business for all to authenticated using (public.is_store_owner()) with check (public.is_store_owner());

-- Storage: crea un bucket público llamado product-images. El dueño autenticado puede subir/editar/borrar.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "Owner can upload product images" on storage.objects;
create policy "Owner can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_store_owner());
drop policy if exists "Owner can update product images" on storage.objects;
create policy "Owner can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_store_owner()) with check (bucket_id = 'product-images' and public.is_store_owner());
drop policy if exists "Owner can delete product images" on storage.objects;
create policy "Owner can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_store_owner());

-- Después de registrar la cuenta del dueño en Authentication > Users, copia su UUID y ejecuta:
-- update public.app_settings set owner_id = 'UUID-DE-LA-CUENTA-DEL-DUENO' where id = 1;
