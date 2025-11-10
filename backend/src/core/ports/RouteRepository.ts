import { Route } from "../domain/Route.js";
export interface RouteRepository {
  list(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  getByRouteId(routeId: string): Promise<Route | null>;
  getBaselineByYear(year: number): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
}
