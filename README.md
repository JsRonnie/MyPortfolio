# Developer Portfolio (React + Vite + Supabase)

Animated single-page portfolio with a lightweight admin surface backed by Supabase for projects, contact messages, and viewer analytics.

## Highlights

- Animated hero/skills/projects powered by `framer-motion` + `react-icons`
- Supabase viewer tracking via the `viewer_events` table on every visit
- Contact form writes to `contact_messages` with inline validation feedback
- `/admin` route with a simple login (`admin` / `admin001`) that surfaces metrics, latest contact submissions, and full project CRUD
- Project cards gracefully fall back to local data and a default image when Supabase is unavailable
- SQL + storage provisioning script lives in `supabase/schema.sql`
- Showcases a Full-Stack Capstone: Student Voting System (React + Supabase, role-based access) — https://studvote.vercel.app/

## Requirements

- Node 20+
- Supabase project (free tier works)
- Modern browser (Vite serves native ES modules)

## 1. Install Dependencies

```
npm install
```

## 2. Environment Variables

Create `.env.local` in the repo root (or any other Vite-supported env file):

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

- Leave these blank if you only want the static fallback data; the UI still renders.
- Restart `npm run dev` when env values change.

## 3. Provision Supabase

1. Open Supabase → SQL Editor → New query from file.
2. Paste `supabase/schema.sql` and execute once per project.

- Tables created: `viewer_events`, `contact_messages`, `projects`.
- Trigger keeps `projects.updated_at` current.
- Sample rows match the local fallback projects.

3. Storage: the script creates a public bucket named `project-images`.

- Drop screenshots in this bucket and copy the public URL into the admin project editor.
- Swap the bucket name in the script if you already have one; re-run the storage section only.

## 4. Run Locally / Build

```
npm run dev
npm run build
npm run preview
```

## 5. Deploying to Vercel

Vercel needs a rewrite so every request (like `/admin`) falls back to `index.html` instead of returning a 404. The repo now ships `vercel.json` with a catch-all rewrite:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Steps:

1. Push to GitHub with this file included.
2. In Vercel, set the project Framework Preset to **Vite** (or leave "Other" and set `npm run build` / `dist`).
3. Redeploy. Visiting `https://<your-app>.vercel.app/admin` will now serve the SPA correctly.

## Admin Dashboard Overview

- Visit `/admin` locally or in production.
- Login with `admin` / `admin001` (session stored in `sessionStorage`).
- Sections:
  - **Metrics cards**: total projects, total contact messages, distinct viewer sessions. Cards are clickable for future drilldowns.
  - **Latest contact messages**: name, email, subject, message snippet, timestamp direct from Supabase.
  - **Project editor**: add/update/delete rows in `projects`. Image URL accepts any public asset; blank fields fall back to `https://placehold.co/600x400/111111/FFFFFF?text=Project`.
- Security: Supabase RLS policies currently allow open CRUD from the browser to mirror the requested behavior. Harden before production (Supabase Auth, service role API, etc.).

## Customizing Skills & Fallback Projects

- `src/App.jsx` exports the skills array and `fallbackProjects`. Update those to adjust the offline/default experience.
- Icons map through `iconMap` inside `src/components/Skills.jsx`. Import any glyph from `react-icons` and map it to the matching label.

## Testing Checklist

- Load `/` → confirm `viewer_events` receives a new row (use Supabase table view).
- Submit the contact form → verify toast message and a new `contact_messages` row.
- Add/edit/delete projects inside `/admin` → confirm homepage reflects changes and Supabase `projects` updates.

## Roadmap Ideas

- Replace hardcoded admin credentials with Supabase Auth or a serverless login.
- Add viewer/message charts to the dashboard.
- Upload images directly into the `project-images` bucket using signed URLs.
- Add e2e coverage for the public + admin flows (Playwright/Cypress).

---

Built with Vite + React 19 and tailored for Supabase-backed portfolio deployments.
