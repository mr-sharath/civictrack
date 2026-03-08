# CivicTrack — Public Sector CRM + Analytics Dashboard

> Byteable AI Engineering Challenge — Built by Sharath Reddy

A functional MVP for a Government CRM system with a real-time analytics dashboard. Tracks constituents (citizens and organizations), manages service cases across departments, and surfaces actionable insights.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional — runs on mock data without it)
cp .env.example .env
# Fill in your Supabase URL and anon key

# 3. Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗 Features

### Dashboard
- KPI cards: total, open, in-progress, resolved, escalated cases
- Cases by status (pie chart)
- Cases by department (bar chart)
- Case type breakdown (horizontal bar)
- Recent activity feed

### Cases Management
- Full CRUD — create, update status, delete cases
- Filter by status, department, search by title
- Inline status updates (click dropdown in table)
- Priority levels: Low / Medium / High / Critical
- Case types: Permit, Complaint, Infrastructure, Public Records, Social Services, Tax, Licensing

### Constituents
- Card-based view with case counts
- Register individuals or organizations
- Search by name or email

### Departments
- Overview cards for each department
- Per-department case breakdown (active, resolved, escalated)
- Visual progress bar by status

---

## 🗄 Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → New Query
3. Paste and run the contents of `supabase/schema.sql`
4. Copy your Project URL and anon key into `.env`

The app works with **mock data** out of the box — Supabase connection is optional.

---

## 🛠 Tech Stack

| | |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Supabase (Postgres) |
| Fonts | Sora + IBM Plex Sans |

---

## 📁 Project Structure

```
gov-crm/
├── src/
│   ├── App.jsx          # All components (single-file MVP)
│   ├── main.jsx         # React entry point
│   ├── index.css        # Tailwind + custom fonts
│   └── lib/
│       └── supabase.js  # Supabase client
├── supabase/
│   └── schema.sql       # DB schema + seed data
├── .env.example         # Environment template
└── SPECS.md             # Architecture & planning doc
```
