-- PARALLAX contact enquiries (Neon PostgreSQL)
create extension if not exists pgcrypto;

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name varchar(100) not null,
  email varchar(254) not null,
  company varchar(150),
  project_type varchar(60) not null,
  budget varchar(60),
  timeline varchar(60),
  message text not null,
  consent_at timestamptz not null,
  status varchar(30) not null default 'new'
    check (status in ('new','reviewing','contacted','qualified','proposal_sent','converted','closed')),
  source varchar(50) not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_name_length check (char_length(name) between 2 and 100),
  constraint contact_email_length check (char_length(email) between 5 and 254),
  constraint contact_message_length check (char_length(message) between 20 and 5000)
);

create index if not exists contact_enquiries_created_at_idx
  on public.contact_enquiries (created_at desc);
create index if not exists contact_enquiries_status_idx
  on public.contact_enquiries (status);

create or replace function public.set_contact_enquiry_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists contact_enquiries_updated_at on public.contact_enquiries;
create trigger contact_enquiries_updated_at before update on public.contact_enquiries
for each row execute function public.set_contact_enquiry_updated_at();

-- The application connects using a server-only Neon connection string.
-- Never expose DATABASE_URL to browser code or commit it to source control.
