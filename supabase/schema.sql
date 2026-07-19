create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  company text,
  job_title text,
  email text,
  phone text,
  website text,
  address text,
  met_at text,
  date_met date,
  conversation_notes text,
  card_image_url text,
  email_subject text,
  email_body text,
  email_status text not null default 'draft' check (email_status in ('draft','approved','sent','skipped','failed')),
  source text not null default 'business_card',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists contacts_email_unique
on public.contacts (lower(email)) where email is not null and email <> '';

create index if not exists contacts_name_company_idx
on public.contacts (lower(full_name), lower(company));

alter table public.contacts enable row level security;
