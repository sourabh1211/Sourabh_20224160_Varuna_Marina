import { Route } from "../domain/Route.js";
import { ComplianceRepository } from "../ports/ComplianceRepository.js";
import { ENERGY_PER_TONNE_MJ, TARGET_INTENSITY } from "../../shared/constants.js";

export class ComputeCB {
  constructor(private complianceRepo: ComplianceRepository) {}

  computeForRoute(route: Route): number {
    const energy = route.fuelConsumption * ENERGY_PER_TONNE_MJ;
    const delta = TARGET_INTENSITY - route.ghgIntensity;
    return delta * energy;
  }

  async computeAndStore(shipId: string, year: number, route: Route): Promise<number> {
    const cb = this.computeForRoute(route);
    await this.complianceRepo.saveSnapshot({ shipId, year, cb_gco2eq: cb });
    return cb;
  }
}
