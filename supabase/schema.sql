-- CivicTrack: Public Sector CRM Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Departments
create table departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  head_officer text,
  description text,
  created_at timestamptz default now()
);

-- Staff
create table staff (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  department_id uuid references departments(id) on delete set null,
  role text default 'officer',
  created_at timestamptz default now()
);

-- Constituents
create table constituents (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  address text,
  type text default 'individual' check (type in ('individual', 'organization')),
  created_at timestamptz default now()
);

-- Cases
create table cases (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text not null check (type in (
    'permit_application', 'complaint', 'infrastructure_request',
    'public_records', 'social_services', 'tax_query', 'licensing'
  )),
  status text not null default 'open' check (status in (
    'open', 'in_progress', 'resolved', 'escalated', 'closed'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  constituent_id uuid references constituents(id) on delete set null,
  department_id uuid references departments(id) on delete set null,
  assigned_to uuid references staff(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  resolved_at timestamptz
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cases_updated_at
  before update on cases
  for each row execute function update_updated_at();

-- Seed Data
insert into departments (name, head_officer, description) values
  ('Housing & Planning', 'Director Sarah Mitchell', 'Permits, zoning, housing assistance'),
  ('Infrastructure & Roads', 'Director James Okafor', 'Road maintenance, utilities, public works'),
  ('Licensing & Compliance', 'Director Ana Reyes', 'Business licenses, permits, code enforcement'),
  ('Social Services', 'Director David Chen', 'Welfare, community support, benefits'),
  ('Tax & Revenue', 'Director Patricia Hall', 'Property tax, billing, collections');

insert into staff (name, email, department_id, role) 
select 'Officer Marcus Webb', 'marcus.webb@city.gov', id, 'senior_officer'
from departments where name = 'Housing & Planning';

insert into staff (name, email, department_id, role)
select 'Officer Priya Sharma', 'priya.sharma@city.gov', id, 'officer'
from departments where name = 'Infrastructure & Roads';

insert into staff (name, email, department_id, role)
select 'Officer Leon Baptiste', 'leon.baptiste@city.gov', id, 'officer'
from departments where name = 'Licensing & Compliance';

-- Sample Constituents
insert into constituents (name, email, phone, address, type) values
  ('Robert Harrington', 'r.harrington@email.com', '555-0101', '142 Oak Street, Springfield', 'individual'),
  ('Sandra Kowalski', 's.kowalski@email.com', '555-0102', '89 Maple Ave, Springfield', 'individual'),
  ('Acme Construction LLC', 'info@acmeconstruct.com', '555-0200', '500 Industrial Blvd, Springfield', 'organization'),
  ('Thomas Nguyen', 't.nguyen@email.com', '555-0103', '33 Pine Road, Springfield', 'individual'),
  ('City Diner Group', 'ops@citydiner.com', '555-0201', '10 Main Street, Springfield', 'organization'),
  ('Maria Gonzalez', 'm.gonzalez@email.com', '555-0104', '78 Birch Lane, Springfield', 'individual'),
  ('Frank Osei', 'f.osei@email.com', '555-0105', '201 Elm Street, Springfield', 'individual');
