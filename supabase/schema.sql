-- Enable uuid generation helpers
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Viewer tracking table
create table if not exists public.viewer_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists idx_viewer_events_created_at on public.viewer_events (created_at);

-- Contact / Let's Connect submissions
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);

-- Projects managed by the admin dashboard
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  badge text,
  tech_stack text[] default '{}',
  image_url text,
  repo_url text,
  live_url text,
  sort_order int default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index if not exists idx_projects_sort_order on public.projects (sort_order);

-- simple trigger to bump updated_at
create or replace function public.set_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_projects_updated_at();

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;
-- Make the bucket public so the site can reference direct URLs.
update storage.buckets set public = true where id = 'project-images';

-- ROW LEVEL SECURITY ------------------------------------------------------
alter table public.viewer_events enable row level security;
alter table public.contact_messages enable row level security;
alter table public.projects enable row level security;
alter table storage.objects enable row level security;

drop policy if exists "viewer events insert" on public.viewer_events;
create policy "viewer events insert" on public.viewer_events
for insert
with check (true);
drop policy if exists "viewer events select" on public.viewer_events;
create policy "viewer events select" on public.viewer_events
for select
using (true);

-- Contact form submissions / reads
drop policy if exists "contact messages insert" on public.contact_messages;
create policy "contact messages insert" on public.contact_messages
for insert
with check (true);
drop policy if exists "contact messages select" on public.contact_messages;
create policy "contact messages select" on public.contact_messages
for select
using (true);

-- Projects can be read/edited from the browser-admin (no security hardening).
drop policy if exists "projects select" on public.projects;
create policy "projects select" on public.projects
for select
using (true);
drop policy if exists "projects insert" on public.projects;
create policy "projects insert" on public.projects
for insert
with check (true);
drop policy if exists "projects update" on public.projects;
create policy "projects update" on public.projects
for update
using (true)
with check (true);
drop policy if exists "projects delete" on public.projects;
create policy "projects delete" on public.projects
for delete
using (true);

-- Storage bucket access for project images
drop policy if exists "project-images select" on storage.objects;
create policy "project-images select" on storage.objects
for select
using (bucket_id = 'project-images');

drop policy if exists "project-images insert" on storage.objects;
create policy "project-images insert" on storage.objects
for insert
with check (bucket_id = 'project-images');

drop policy if exists "project-images update" on storage.objects;
create policy "project-images update" on storage.objects
for update
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

drop policy if exists "project-images delete" on storage.objects;
create policy "project-images delete" on storage.objects
for delete
using (bucket_id = 'project-images');

-- SAMPLE DATA -------------------------------------------------------------
insert into public.projects (title, description, badge, tech_stack, image_url, repo_url, live_url, sort_order)
values
  ('Student Voting System', 'Secure voting with admin dashboards and audit logs.', 'JAVA / MYSQL', ARRAY['Java','MySQL','JDBC'], null, null, null, 1)
  on conflict do nothing;

insert into public.projects (title, description, badge, tech_stack, image_url, sort_order)
values
  ('Service Booking System', 'Self-serve booking with availability validation.', 'BOOKING', ARRAY['JavaScript','Responsive UI'], null, 2)
  on conflict do nothing;

insert into public.projects (title, description, badge, tech_stack, image_url, sort_order)
values
  ('Dog Match (Physical Traits)', 'Recommends breeds based on preferences.', 'MATCHING', ARRAY['Data Filtering','Trait Scoring'], null, 3)
  on conflict do nothing;
