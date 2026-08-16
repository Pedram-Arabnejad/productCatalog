# Product Catalog API

A production-grade **E-commerce Product Catalog API** built with **NestJS** and **TypeScript** — designed around **Domain-Driven Design (DDD)** with a modular architecture, Redis caching, and advanced authentication (JWT + OAuth).

> 🚧 **Work in progress** — built incrementally in feature sections. The full architecture documentation lands in the final section.

## Current Status

- ✅ NestJS 11 scaffolding with strict TypeScript
- ✅ Centralized config via `@nestjs/config` with environment validation
- ✅ PostgreSQL + Prisma schema (`User`, `Category`, `Product`) with migrations
- ✅ Seed data for categories and products
- ✅ Health check endpoint

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 |
| Language | TypeScript (strict) |
| ORM | Prisma 6 |
| Database | PostgreSQL |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit DATABASE_URL to point at your local PostgreSQL

# 3. Set up the database
npx prisma migrate dev

# 4. (Optional) Seed demo data
npm run prisma:seed

# 5. Start the server
npm run start:dev
```

Server runs at `http://localhost:3000` — health check at `GET /api/health`.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/product_catalog` |

## Project Structure

```
src/
├── main.ts                  # Bootstrap & global /api prefix
├── app.module.ts            # Root module wiring
├── config/                  # Environment validation
├── prisma/                  # PrismaService (global DB provider)
└── health/                  # Health check module
```

## License

MIT
