import { BankingRepository } from "../ports/BankingRepository.js";
import { ComplianceRepository } from "../ports/ComplianceRepository.js";
import { RouteRepository } from "../ports/RouteRepository.js";
import { ComputeCB } from "./ComputeCB.js";
import { AppError } from "../../shared/errors.js";

export class BankSurplus {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository,
    private routesRepo: RouteRepository
  ) {}

  async run(shipId: string, year: number, amount: number) {
    if (amount <= 0) throw new AppError("Amount must be positive");

    const route = await this.routesRepo.getByRouteId(shipId);
    if (!route || route.year !== year) throw new AppError("Route/ship not found for year", 404);

    const compute = new ComputeCB(this.complianceRepo);
    const cb = await compute.computeAndStore(shipId, year, route);
    if (cb <= 0) throw new AppError("CB is not positive; nothing to bank");
    if (amount > cb) throw new AppError("Cannot bank more than current CB");

    await this.bankingRepo.addEntry({ shipId, year, amount_gco2eq: amount });
    return { cb_before: cb, applied: amount, cb_after: cb - amount };
  }
}

export class ApplyBanked {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository,
    private routesRepo: RouteRepository
  ) {}

  async run(shipId: string, year: number, amount: number) {
    if (amount <= 0) throw new AppError("Amount must be positive");

    const route = await this.routesRepo.getByRouteId(shipId);
    if (!route || route.year !== year) throw new AppError("Route/ship not found for year", 404);

    const compute = new ComputeCB(this.complianceRepo);
    const cb = await compute.computeAndStore(shipId, year, route);
    if (cb >= 0) throw new AppError("No deficit to apply against");

    const available = await this.bankingRepo.totalBanked(shipId);
    if (amount > available) throw new AppError("Insufficient banked surplus");

    const deficitMagnitude = -cb;
    if (amount > deficitMagnitude) throw new AppError("Cannot apply more than the deficit");

    await this.bankingRepo.addEntry({ shipId, year, amount_gco2eq: -amount });
    return { cb_before: cb, applied: amount, cb_after: cb + amount };
  }
}
