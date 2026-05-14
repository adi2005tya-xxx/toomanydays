# Debt Management App – Monorepo (API-first scaffold)

## Structure
- `api/` – Node + Express (TypeScript), Prisma schema for PostgreSQL, SMS-ready hooks.
- `web/` – (placeholder) React/TypeScript app to be scaffolded next.

## Quick start (API)
1) Install deps: `cd api && npm install`
2) Copy env: `cp .env.example .env` (on Windows: `copy .env.example .env`)
3) Set `DATABASE_URL` in `.env`
4) Generate Prisma client: `npx prisma generate`
5) Run dev server: `npm run dev`

## Roadmap
- Add DB migrations (`npx prisma migrate dev`)
- Implement routes (auth, debtors, debts, payments, reminders, reports)
- Add background job runner for SMS scheduling
- Scaffold `web/` (Vite React TS) consuming API
