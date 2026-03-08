# CivicTrack — Public Sector CRM + Analytics Dashboard
## Byteable AI Engineering Challenge — Specs & Plan

---

## 1. Problem Statement

Government departments struggle to track citizen service requests, manage inter-departmental cases, and surface actionable analytics. CivicTrack solves this with a clean, working MVP: a CRM built for public sector workflows.

---

## 2. Industry: Public Sector & Government

### Target Users
- **Case Officers** — manage constituent cases day-to-day
- **Department Heads** — monitor team performance and workload
- **Administrators** — oversee all departments, view analytics

### Core Entities
| Entity | Description |
|---|---|
| Constituent | Citizen or organization interacting with government |
| Case | A service request, complaint, permit, or inquiry |
| Department | Government unit (e.g. Housing, Licensing, Infrastructure) |
| Staff Member | Government employee assigned to cases |

---

## 3. Feature Scope (MVP)

### Must Have (4-hour budget)
- [x] Constituent management — add, view, search citizens
- [x] Case management — create, update status, assign to department
- [x] Analytics Dashboard — KPIs, case trends, department load
- [x] Supabase backend — full CRUD with real-time support
- [x] Status workflow: Open → In Progress → Resolved / Escalated

### Out of Scope (post-MVP)
- Email/SMS notifications
- Document attachments
- Public-facing citizen portal
- Role-based access control

---

## 4. Data Model

### `constituents`
```sql
id, name, email, phone, address, type (individual|organization), created_at
```

### `departments`
```sql
id, name, head_officer, description, created_at
```

### `staff`
```sql
id, name, email, department_id, role, created_at
```

### `cases`
```sql
id, title, description, type, status, priority, constituent_id, 
department_id, assigned_to, created_at, updated_at, resolved_at
```

### Case Types
`permit_application | complaint | infrastructure_request | public_records | social_services | tax_query | licensing`

### Case Statuses
`open | in_progress | resolved | escalated | closed`

---

## 5. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite | Fast, modern, component-driven |
| Styling | Tailwind CSS | Rapid utility-first styling |
| Charts | Recharts | Lightweight, composable |
| Backend | Supabase | Free tier, Postgres, real-time |
| State | React useState/useEffect | Simple enough for MVP |

---

## 6. Architecture

```
src/
├── App.jsx              # Root with router
├── lib/
│   └── supabase.js      # Supabase client
├── components/
│   ├── Sidebar.jsx
│   ├── Dashboard.jsx    # Analytics + KPI cards
│   ├── Constituents.jsx # CRUD table
│   ├── Cases.jsx        # Case management
│   └── Departments.jsx  # Department overview
└── hooks/
    └── useData.js       # Data fetching hooks
```

---

## 7. Build Plan (4 Hours)

| Time | Task |
|---|---|
| 0:00–0:30 | Supabase schema + seed data |
| 0:30–1:30 | Dashboard + KPI analytics |
| 1:30–2:30 | Constituents + Cases CRUD |
| 2:30–3:30 | Departments view + wiring |
| 3:30–4:00 | Polish, test, README |

---

## 8. Supabase Setup

See `supabase/schema.sql` for full migration.

1. Create a new Supabase project
2. Run `schema.sql` in the SQL editor
3. Run `seed.sql` to populate sample data
4. Copy `.env.example` → `.env` and fill in your keys
