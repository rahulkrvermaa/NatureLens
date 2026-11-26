-- NatureLens Supabase Schema & Realtime Setup
-- Run this once in your Supabase Dashboard -> SQL Editor

create extension if not exists "uuid-ossp";

-- 1. Profiles
create table if not exists public.profiles (
  id text primary key,
  username text unique not null,
  full_name text not null,
  bio text,
  avatar_url text,
  banner_url text,
  location text,
  website text,
  interests text[] default '{}',
  is_verified boolean default false,
  ethical_pledge_signed boolean default true,
  photos_count integer default 0,
  followers_count integer default 0,
  following_count integer default 0,
  likes_received_count integer default 0,
  created_at timestamptz default now()
);

-- 2. Photos
create table if not exists public.photos (
  id text primary key,
  user_id text references public.profiles(id) on delete set null,
  category_id text not null,
  title text not null,
  description text,
  slug text not null,
  original_storage_path text,
  display_url text not null,
  thumbnail_url text not null,
  aspect_ratio numeric default 1.5,
  width integer default 1920,
  height integer default 1280,
  file_size_bytes bigint default 0,
  mime_type text default 'image/jpeg',
  exif jsonb default '{}'::jsonb,
  location_name text,
  country text,
  status text default 'published',
  is_featured boolean default false,
  is_editor_choice boolean default false,
  views_count integer default 0,
  likes_count integer default 0,
  comments_count integer default 0,
  saves_count integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Comments
create table if not exists public.comments (
  id text primary key,
  photo_id text not null references public.photos(id) on delete cascade,
  user_id text not null,
  parent_id text,
  content text not null,
  author_snapshot jsonb not null,
  is_edited boolean default false,
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- 4. Challenges
create table if not exists public.challenges (
  id text primary key,
  title text not null,
  slug text unique not null,
  description text not null,
  rules text not null,
  cover_image_url text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text default 'active',
  prizes text,
  entries_count integer default 0
);

-- 5. Enable Row Level Security (public read + open demo write; tighten with auth.uid() for production)
alter table public.profiles enable row level security;
alter table public.photos enable row level security;
alter table public.comments enable row level security;
alter table public.challenges enable row level security;

drop policy if exists "Public profiles access" on public.profiles;
create policy "Public profiles access" on public.profiles for all using (true) with check (true);

drop policy if exists "Public photos access" on public.photos;
create policy "Public photos access" on public.photos for all using (true) with check (true);

drop policy if exists "Public comments access" on public.comments;
create policy "Public comments access" on public.comments for all using (true) with check (true);

drop policy if exists "Public challenges access" on public.challenges;
create policy "Public challenges access" on public.challenges for all using (true) with check (true);

-- 6. Storage Bucket for Uploaded Photos
insert into storage.buckets (id, name, public)
values ('naturelens-photos', 'naturelens-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public photo storage read" on storage.objects;
create policy "Public photo storage read" on storage.objects
  for select using (bucket_id = 'naturelens-photos');

drop policy if exists "Public photo storage upload" on storage.objects;
create policy "Public photo storage upload" on storage.objects
  for insert with check (bucket_id = 'naturelens-photos');

-- 7. Enable Realtime Publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'photos'
  ) then
    alter publication supabase_realtime add table public.photos;
  end if;
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'comments'
  ) then
    alter publication supabase_realtime add table public.comments;
  end if;
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'challenges'
  ) then
    alter publication supabase_realtime add table public.challenges;
  end if;
end $$;
