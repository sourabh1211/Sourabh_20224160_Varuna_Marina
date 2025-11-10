import { Router } from "express";
import { RouteRepository } from "../../../core/ports/RouteRepository.js";
import { ComputeComparison } from "../../../core/application/ComputeComparison.js";

export function routesRouter(repo: RouteRepository) {
  const r = Router();

  r.get("/", async (req, res, next) => {
    try {
      const { vesselType, fuelType, year } = req.query;
      const list = await repo.list({
        vesselType: vesselType ? String(vesselType) : undefined,
        fuelType: fuelType ? String(fuelType) : undefined,
        year: year ? Number(year) : undefined
      });
      res.json(list);
    } catch (e) { next(e); }
  });

  r.post("/:routeId/baseline", async (req, res, next) => {
    try {
      await repo.setBaseline(req.params.routeId);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  r.get("/comparison", async (req, res, next) => {
    try {
      const cc = new ComputeComparison(repo);
      const data = await cc.run();
      res.json({ target: 89.3368, data });
    } catch (e) { next(e); }
  });

  return r;
}
