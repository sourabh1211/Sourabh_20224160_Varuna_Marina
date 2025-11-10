import { ComplianceRepository } from "../../../core/ports/ComplianceRepository.js";
import { ShipCompliance } from "../../../core/domain/ShipCompliance.js";
import { pgPool } from "./index.js";

export class PgComplianceRepository implements ComplianceRepository {
  async saveSnapshot(entry: Omit<ShipCompliance, "id" | "createdAt">): Promise<void> {
    await pgPool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq) VALUES ($1, $2, $3)`,
      [entry.shipId, entry.year, entry.cb_gco2eq]
    );
  }
  async getLatest(shipId: string, year: number) {
    const res = await pgPool.query(
      `SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2 ORDER BY created_at DESC LIMIT 1`,
      [shipId, year]
    );
    const row = res.rows[0];
    return row ? { id: row.id, shipId: row.ship_id, year: row.year, cb_gco2eq: Number(row.cb_gco2eq), createdAt: row.created_at } : null;
  }
}
