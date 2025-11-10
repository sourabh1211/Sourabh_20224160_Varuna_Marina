import { RouteRepository } from "../../../core/ports/RouteRepository.js";
import { Route } from "../../../core/domain/Route.js";

export class MemoryRouteRepository implements RouteRepository {
  private routes: Route[] = [];

  constructor(seed?: Route[]) {
    if (seed) this.routes = seed;
  }

  async list(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    return this.routes.filter(r =>
      (!filters?.vesselType || r.vesselType === filters.vesselType) &&
      (!filters?.fuelType || r.fuelType === filters.fuelType) &&
      (!filters?.year || r.year === filters.year)
    );
  }

  async getByRouteId(routeId: string): Promise<Route | null> {
    return this.routes.find(r => r.routeId === routeId) || null;
  }

  async getBaselineByYear(year: number): Promise<Route | null> {
    return this.routes.find(r => r.year === year && r.isBaseline) || null;
  }

  async setBaseline(routeId: string): Promise<void> {
    const route = this.routes.find(r => r.routeId === routeId);
    if (!route) return;
    for (const r of this.routes) if (r.year === route.year) r.isBaseline = false;
    route.isBaseline = true;
  }
}
