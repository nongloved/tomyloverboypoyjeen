-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Creates the table that holds the curated photos/videos/songs/poster that
-- used to be bundled into the site's JS (src/data/relationship.ts). Separate
-- from gallery_items/board_items (the tables behind the "+" add buttons) so
-- this migration can't touch anything already live.

create table content_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (
    section in ('timeline', 'sillyUs', 'favoritePhotosOfYou', 'songs', 'watched')
  ),
  -- almost always one URL; a timeline slot can hold a few (shown as a
  -- stacked-polaroid group), which is why this is an array, not a single url
  media_urls text[] not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  caption text,
  date_label text,
  title_label text,
  role text,
  artist text,
  note text,
  link_url text,
  -- preserves the exact order written in relationship.ts (created_at can't
  -- be trusted for that once uploads happen concurrently)
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table content_items enable row level security;

create policy "anyone can read" on content_items
  for select using (true);

create policy "anyone can insert" on content_items
  for insert with check (true);

-- storage: reuses the existing public "gallery" bucket and its policies
-- (see SUPABASE_SETUP.md step 2) — nothing new to create there.
