# FuelEU Maritime — Full-Stack Demo (Hexagonal)

Backend: Node.js + TS + Express + PostgreSQL (`pg`)  
Frontend: React + Vite + TS + Tailwind  
Architecture: Hexagonal (ports & adapters)  
Tests: Jest + Supertest

## Quick Start

### Backend (in-memory, no Docker)
```bash
cd backend
copy .env.example .env   # Windows (PowerShell)
# set USE_INMEMORY=true in .env
npm install
npm run dev
```
Health: http://localhost:4000/health

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Endpoints
- `GET /routes`, `POST /routes/:routeId/baseline`, `GET /routes/comparison`
- `GET /compliance/cb?shipId&year`, `GET /compliance/adjusted-cb?shipId&year`
- `GET /banking/records?shipId&year`, `POST /banking/bank`, `POST /banking/apply`
- `POST /pools`

## Notes
- `shipId = routeId` (demo)
- Target intensity = **89.3368 gCO₂e/MJ**
- Energy = `fuelConsumption × 41_000 MJ/t`
- CB = `(Target − Actual) × Energy` (positive = surplus, negative = deficit)
