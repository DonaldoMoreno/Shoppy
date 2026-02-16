# Shoppy — Personal Shopper Marketplace (MVP)

This repository contains an MVP Personal Shopper Marketplace built with:
- Backend: NestJS + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js + Tailwind
- Queue: BullMQ + Redis
- Object storage: MinIO (S3 stub)
- Payments: Stripe-compatible mock

Quick start (Codespaces / local with Docker):

1. Copy environment example:
   cp .env.example .env

2. Start required services:
   make up

3. Install dependencies (pnpm recommended):
   pnpm install

4. Seed database and run dev apps:
   make seed
   make dev

API: http://localhost:3001
Web: http://localhost:3000

Next steps: API endpoints, web UI flows, background workers and tests are included in the workspace.
