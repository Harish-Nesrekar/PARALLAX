-- PARALLAX single-admin CRM additions.
-- Authentication credentials remain in server-only environment variables;
-- no public/admin password table is required for a single administrator.
create table if not exists public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.contact_enquiries(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 5000),
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists enquiry_notes_enquiry_created_idx
  on public.enquiry_notes (enquiry_id, created_at desc);

create table if not exists public.enquiry_activity (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.contact_enquiries(id) on delete cascade,
  action varchar(50) not null,
  details jsonb not null default '{}'::jsonb,
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists enquiry_activity_enquiry_created_idx
  on public.enquiry_activity (enquiry_id, created_at desc);
