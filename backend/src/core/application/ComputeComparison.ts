import { RouteRepository } from "../ports/RouteRepository.js";
import { TARGET_INTENSITY } from "../../shared/constants.js";

export class ComputeComparison {
  constructor(private routesRepo: RouteRepository) {}

  async run(year?: number) {
    const routes = await this.routesRepo.list(year ? { year } : undefined);
    const byYear = new Map<number, { baseline: any | null; others: any[] }>();

    for (const r of routes) {
      const entry = byYear.get(r.year) || { baseline: null, others: [] };
      if (r.isBaseline) entry.baseline = r;
      else entry.others.push(r);
      byYear.set(r.year, entry);
    }

    const result: any[] = [];
    for (const [y, { baseline, others }] of byYear.entries()) {
      if (!baseline) continue;
      for (const cmp of others) {
        const percentDiff = ((cmp.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
        result.push({
          year: y,
          baseline: { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity },
          comparison: { routeId: cmp.routeId, ghgIntensity: cmp.ghgIntensity },
          percentDiff,
          compliant: cmp.ghgIntensity <= TARGET_INTENSITY
        });
      }
    }
    return result;
  }
}
