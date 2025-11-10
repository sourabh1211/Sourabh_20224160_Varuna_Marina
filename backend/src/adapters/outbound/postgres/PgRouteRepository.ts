import { RouteRepository } from "../../../core/ports/RouteRepository.js";
import { Route } from "../../../core/domain/Route.js";
import { pgPool } from "./index.js";

export class PgRouteRepository implements RouteRepository {
  async list(filters?: { vesselType?: string; fuelType?: string; year?: number; }): Promise<Route[]> {
    const clauses: string[] = [];
    const params: any[] = [];
    if (filters?.vesselType) { params.push(filters.vesselType); clauses.push(`vessel_type = $${params.length}`); }
    if (filters?.fuelType)   { params.push(filters.fuelType);   clauses.push(`fuel_type = $${params.length}`); }
    if (filters?.year)       { params.push(filters.year);       clauses.push(`year = $${params.length}`); }
    const where = clauses.length ? `WHERE ` + clauses.join(" AND ") : "";
    const res = await pgPool.query(`SELECT * FROM routes ${where} ORDER BY year, route_id` , params);
    return res.rows.map(this.map);
  }
  async getByRouteId(routeId: string): Promise<Route | null> {
    const res = await pgPool.query(`SELECT * FROM routes WHERE route_id = $1`, [routeId]);
    return res.rows[0] ? this.map(res.rows[0]) : null;
  }
  async getBaselineByYear(year: number): Promise<Route | null> {
    const res = await pgPool.query(`SELECT * FROM routes WHERE year = $1 AND is_baseline = true`, [year]);
    return res.rows[0] ? this.map(res.rows[0]) : null;
  }
  async setBaseline(routeId: string): Promise<void> {
    const r = await this.getByRouteId(routeId);
    if (!r) return;
    await pgPool.query(`UPDATE routes SET is_baseline = false WHERE year = $1`, [r.year]);
    await pgPool.query(`UPDATE routes SET is_baseline = true WHERE route_id = $1`, [routeId]);
  }
  private map = (row: any): Route => ({
    id: row.id,
    routeId: row.route_id,
    shipId: row.ship_id,
    vesselType: row.vessel_type,
    fuelType: row.fuel_type,
    year: row.year,
    ghgIntensity: Number(row.ghg_intensity),
    fuelConsumption: Number(row.fuel_consumption),
    distance: Number(row.distance_km),
    totalEmissions: Number(row.total_emissions),
    isBaseline: !!row.is_baseline
  });
}
