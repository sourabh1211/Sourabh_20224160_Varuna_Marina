import { BankingRepository } from "../ports/BankingRepository.js";
import { ComplianceRepository } from "../ports/ComplianceRepository.js";
import { RouteRepository } from "../ports/RouteRepository.js";
import { ComputeCB } from "./ComputeCB.js";
import { AppError } from "../../shared/errors.js";

export class GetAdjustedCB {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository,
    private routesRepo: RouteRepository
  ) {}

  async run(shipId: string, year: number) {
    const route = await this.routesRepo.getByRouteId(shipId);
    if (!route || route.year !== year) throw new AppError("Route/ship not found for year", 404);

    const compute = new ComputeCB(this.complianceRepo);
    const cb = await compute.computeAndStore(shipId, year, route);

    const records = await this.bankingRepo.listRecords(shipId, year);
    const applied = records.filter(r => r.amount_gco2eq < 0).reduce((s, r) => s + r.amount_gco2eq, 0);
    const adjusted = cb + applied;
    return { cb_before: cb, applied: -applied, cb_after: adjusted };
  }
}
