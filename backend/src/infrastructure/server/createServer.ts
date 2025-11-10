import express from "express";
import cors from "cors";
import { routesRouter } from "../../adapters/inbound/http/routesRouter.js";
import { complianceRouter } from "../../adapters/inbound/http/complianceRouter.js";
import { poolsRouter } from "../../adapters/inbound/http/poolsRouter.js";
import { bankingRouter } from "../../adapters/inbound/http/bankingRouter.js";
import { PgRouteRepository } from "../../adapters/outbound/postgres/PgRouteRepository.js";
import { PgComplianceRepository } from "../../adapters/outbound/postgres/PgComplianceRepository.js";
import { PgBankingRepository } from "../../adapters/outbound/postgres/PgBankingRepository.js";
import { PgPoolRepository } from "../../adapters/outbound/postgres/PgPoolRepository.js";
import { MemoryRouteRepository } from "../../adapters/outbound/memory/MemoryRouteRepository.js";
import { MemoryComplianceRepository } from "../../adapters/outbound/memory/MemoryComplianceRepository.js";
import { MemoryBankingRepository } from "../../adapters/outbound/memory/MemoryBankingRepository.js";
import { MemoryPoolRepository } from "../../adapters/outbound/memory/MemoryPoolRepository.js";
import { AppError } from "../../shared/errors.js";

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const useMemory = process.env.USE_INMEMORY === "true";

  // seed for in-memory mode
  const seedRoutes = [
    { id:1, routeId:"R001", shipId:"R001", vesselType:"Container", fuelType:"HFO", year:2024, ghgIntensity:91.0, fuelConsumption:5000, distance:12000, totalEmissions:4500, isBaseline:true },
    { id:2, routeId:"R002", shipId:"R002", vesselType:"BulkCarrier", fuelType:"LNG", year:2024, ghgIntensity:88.0, fuelConsumption:4800, distance:11500, totalEmissions:4200, isBaseline:false },
    { id:3, routeId:"R003", shipId:"R003", vesselType:"Tanker",     fuelType:"MGO", year:2024, ghgIntensity:93.5, fuelConsumption:5100, distance:12500, totalEmissions:4700, isBaseline:false },
    { id:4, routeId:"R004", shipId:"R004", vesselType:"RoRo",       fuelType:"HFO", year:2025, ghgIntensity:89.2, fuelConsumption:4900, distance:11800, totalEmissions:4300, isBaseline:true },
    { id:5, routeId:"R005", shipId:"R005", vesselType:"Container",  fuelType:"LNG", year:2025, ghgIntensity:90.5, fuelConsumption:4950, distance:11900, totalEmissions:4400, isBaseline:false },
  ];

  const routesRepo = useMemory ? new MemoryRouteRepository(seedRoutes as any) : new PgRouteRepository();
  const complianceRepo = useMemory ? new MemoryComplianceRepository() : new PgComplianceRepository();
  const bankingRepo    = useMemory ? new MemoryBankingRepository()    : new PgBankingRepository();
  const poolRepo       = useMemory ? new MemoryPoolRepository()       : new PgPoolRepository();

  app.use("/routes", routesRouter(routesRepo));
  app.use("/compliance", complianceRouter(routesRepo, complianceRepo, bankingRepo));
  app.use("/banking", bankingRouter(bankingRepo, complianceRepo, routesRepo));
  app.use("/pools", poolsRouter(poolRepo, bankingRepo, complianceRepo, routesRepo));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err instanceof AppError ? err.status : 500;
    res.status(status).json({ error: err.message || "Internal Error" });
  });

  return app;
}
