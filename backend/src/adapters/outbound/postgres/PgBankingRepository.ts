import { BankingRepository } from "../../../core/ports/BankingRepository.js";
import { BankEntry } from "../../../core/domain/BankEntry.js";
import { pgPool } from "./index.js";

export class PgBankingRepository implements BankingRepository {
  async listRecords(shipId: string, year?: number): Promise<BankEntry[]> {
    const res = await pgPool.query(
      `SELECT * FROM bank_entries WHERE ship_id = $1 ${year ? "AND year = $2" : ""} ORDER BY created_at`,
      year ? [shipId, year] : [shipId]
    );
    return res.rows.map((row: any) => ({
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amount_gco2eq: Number(row.amount_gco2eq),
      createdAt: row.created_at
    }));
  }
  async addEntry(entry: Omit<BankEntry, "id" | "createdAt">): Promise<void> {
    await pgPool.query(`INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3)`, [entry.shipId, entry.year, entry.amount_gco2eq]);
  }
  async totalBanked(shipId: string): Promise<number> {
    const res = await pgPool.query(`SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1`, [shipId]);
    return Number(res.rows[0].total || 0);
  }
}
