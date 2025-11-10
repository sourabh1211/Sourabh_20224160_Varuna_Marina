import { Router } from "express";
import { BankingRepository } from "../../../core/ports/BankingRepository.js";
import { ComplianceRepository } from "../../../core/ports/ComplianceRepository.js";
import { RouteRepository } from "../../../core/ports/RouteRepository.js";
import { BankSurplus, ApplyBanked } from "../../../core/application/Banking.js";

export function bankingRouter(
  bankingRepo: BankingRepository,
  complianceRepo: ComplianceRepository,
  routesRepo: RouteRepository
) {
  const r = Router();

  r.get("/records", async (req, res, next) => {
    try {
      const shipId = String(req.query.shipId);
      const year = req.query.year ? Number(req.query.year) : undefined;
      const list = await bankingRepo.listRecords(shipId, year);
      res.json(list);
    } catch (e) { next(e); }
  });

  r.post("/bank", async (req, res, next) => {
    try {
      const { shipId, year, amount } = req.body;
      const svc = new BankSurplus(bankingRepo, complianceRepo, routesRepo);
      const out = await svc.run(String(shipId), Number(year), Number(amount));
      res.json(out);
    } catch (e) { next(e); }
  });

  r.post("/apply", async (req, res, next) => {
    try {
      const { shipId, year, amount } = req.body;
      const svc = new ApplyBanked(bankingRepo, complianceRepo, routesRepo);
      const out = await svc.run(String(shipId), Number(year), Number(amount));
      res.json(out);
    } catch (e) { next(e); }
  });

  return r;
}
