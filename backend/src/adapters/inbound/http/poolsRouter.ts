import { Router } from "express";
import { PoolRepository } from "../../../core/ports/PoolRepository.js";
import { CreatePool } from "../../../core/application/CreatePool.js";
import { GetAdjustedCB } from "../../../core/application/GetAdjustedCB.js";
import { BankingRepository } from "../../../core/ports/BankingRepository.js";
import { ComplianceRepository } from "../../../core/ports/ComplianceRepository.js";
import { RouteRepository } from "../../../core/ports/RouteRepository.js";

export function poolsRouter(
  poolRepo: PoolRepository,
  bankingRepo: BankingRepository,
  complianceRepo: ComplianceRepository,
  routesRepo: RouteRepository
) {
  const r = Router();
  r.post("/", async (req, res, next) => {
    try {
      const { year, members } = req.body as { year: number; members: { shipId: string }[] };
      const getAdj = new GetAdjustedCB(bankingRepo, complianceRepo, routesRepo);
      const svc = new CreatePool(poolRepo, getAdj);
      const result = await svc.run(Number(year), members);
      res.json(result);
    } catch (e) { next(e); }
  });
  return r;
}
