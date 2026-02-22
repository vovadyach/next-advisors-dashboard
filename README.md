# Advisor Dashboard

A full-stack application for managing and analyzing financial advisor data. Built with Next.js, Drizzle ORM, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-24-2496ED?logo=docker&logoColor=white)

## Tech Stack
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL, Drizzle ORM
- **Dev Tools:** Docker

## Quick Start
```bash
# 1. Install dependencies
npm i

# 2. Start database
docker compose up -d

# 3. Push schema to database
npm run db:push

# 4. Start development server
npm run dev

# 5. Seed database with sample data (in another terminal)
curl -X POST http://localhost:3000/api/seed
```

App will be running at [http://localhost:3000](http://localhost:3000)

---

## Data Processing

### Input Files

Place data files in the `/data` directory:

| File | Description |
|------|-------------|
| `advisors.json` | Advisor records with custodian relationships |
| `accounts.json` | Account records with holdings |
| `securities.json` | Security reference data |

### Run Seed Script
```bash
  curl -X POST http://localhost:3000/api/seed
```

The script will:
1. Parse and validate input files
2. Populate database tables
3. Calculate and output statistics:
    - Total value across all accounts
    - Top securities by value (risk exposure)
    - Assets by custodian with advisors ranked

### Testing with Different Data

To test with your own data files:
```bash
 # Replace sample files
cp your-advisors.json data/advisors.json
cp your-accounts.json data/accounts.json
cp your-securities.json data/securities.json

# Re-run seed
curl -X POST http://localhost:3000/api/seed
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Aggregated statistics |
| GET | `/api/advisors` | List all advisors |
| GET | `/api/advisors/:id` | Advisor detail with accounts |
| GET | `/api/accounts/:id` | Account detail with holdings |

### 🧪 Testing API Endpoints
```bash
  # Get dashboard stats
curl http://localhost:3000/api/stats | jq

# Response:
# {
#   "data": {
#     "totalValue": 39469.51,
#     "advisorCount": 1,
#     "accountCount": 2
#   }
# }

# Sorting
curl "http://localhost:3000/api/advisors?sortBy=name&order=desc" | jq
```

---

## Scripts

| Command                | Description |
|------------------------|-------------|
| `npm run dev`          | Start development server |
| `npm run build`        | Build for production |
| `npm run db:push`      | Push schema to database |
| `npm run generate`     | Generate migrations |
| `npm run lint`         | Run ESLint |
| `npm run format`       | Run Prettier |


---

## Project Structure
```
├── data/                    # Input JSON files
│   ├── advisors.json
│   ├── accounts.json
│   └── securities.json
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── libs/            # Shared utilities (API, data, stats)   
│   │   ├── components/      # Reusable building blocks
│   │   ├── shared/          # Common constants/hooks
│   │   └── page.tsx         # Page UI
│   ├── components/          # React components
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema
│   │   ├── schema.types.ts  # Schema types
│   │   └── index.ts         # DB connection
│   ├── lib/                 # Utilities
├── docs/
│   └── PRODUCTION_TODOS.md
```

---

## Documentation

- [Production TODOs](docs/PRODUCTION_TODOS.md)

---

## Environment Variables

Copy `.env.example` to `.env`:
```bash
  cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

---