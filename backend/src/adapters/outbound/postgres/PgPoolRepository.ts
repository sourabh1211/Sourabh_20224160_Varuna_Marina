import { PoolRepository } from "../../../core/ports/PoolRepository.js";
import { Pool } from "../../../core/domain/Pool.js";
import { pgPool } from "./index.js";

export class PgPoolRepository implements PoolRepository {
  async createPool(year: number, members: Array<{ shipId: string; cb_before: number; cb_after: number }>): Promise<Pool> {
    const client = await pgPool.connect();
    try {
      await client.query("BEGIN");
      const res = await client.query(`INSERT INTO pools (year) VALUES ($1) RETURNING *`, [year]);
      const pool = res.rows[0];
      for (const m of members) {
        await client.query(
          `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)`,
          [pool.id, m.shipId, m.cb_before, m.cb_after]
        );
      }
      await client.query("COMMIT");
      return { id: pool.id, year: pool.year, createdAt: pool.created_at };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}
