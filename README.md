# TMTODDS (Demo)

TMTODDS is a Ghana-focused betting slips web app demo with:

- Free slips
- Premium tiers (Fixed / Confirmed / Correct Score)
- User accounts + dashboard (demo session + plan access + expiry display)
- Proof / results ledger
- Sportsbook-style slips board + demo betslip (localStorage)

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind
- Frontend-only demo mode (mock data + localStorage)

## Local setup

1) Install dependencies

```bash
npm install
```

2) Start dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo sign-in credentials

- Admin: `admin@tmtodds.com` / `admin12345`
- User: `demo@tmtodds.com` / `demo12345`

## Key routes

- Public: `/`, `/slips`, `/slips/[slug]`, `/proof`, `/blog`
- Auth: `/login`, `/register`, `/account`
- Admin: `/admin`, `/admin/slips`, `/admin/slips/new`

## Notes

- This repo is intentionally **frontend-only for demos** (no API routes). Payments/auth can be re-enabled later.
