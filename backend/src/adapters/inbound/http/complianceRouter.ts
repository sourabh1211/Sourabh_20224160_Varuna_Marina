import { Router } from "express";
import { RouteRepository } from "../../../core/ports/RouteRepository.js";
import { ComplianceRepository } from "../../../core/ports/ComplianceRepository.js";
import { BankingRepository } from "../../../core/ports/BankingRepository.js";
import { ComputeCB } from "../../../core/application/ComputeCB.js";
import { GetAdjustedCB } from "../../../core/application/GetAdjustedCB.js";

export function complianceRouter(
  routesRepo: RouteRepository,
  complianceRepo: ComplianceRepository,
  bankingRepo: BankingRepository
) {
  const r = Router();

  r.get("/cb", async (req, res, next) => {
    try {
      const shipId = String(req.query.shipId);
      const year = Number(req.query.year);
      const route = await routesRepo.getByRouteId(shipId);
      if (!route || route.year !== year) return res.status(404).json({ error: "Route/ship not found for year" });

      const compute = new ComputeCB(complianceRepo);
      const cb = await compute.computeAndStore(shipId, year, route);
      res.json({ shipId, year, cb });
    } catch (e) { next(e); }
  });

  r.get("/adjusted-cb", async (req, res, next) => {
    try {
      const shipId = String(req.query.shipId);
      const year = Number(req.query.year);
      const svc = new GetAdjustedCB(bankingRepo, complianceRepo, routesRepo);
      const data = await svc.run(shipId, year);
      res.json({ shipId, year, ...data });
    } catch (e) { next(e); }
  });

  return r;
}
