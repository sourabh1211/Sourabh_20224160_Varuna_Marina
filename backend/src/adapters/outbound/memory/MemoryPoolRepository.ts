import { PoolRepository } from "../../../core/ports/PoolRepository.js";
import { Pool } from "../../../core/domain/Pool.js";

export class MemoryPoolRepository implements PoolRepository {
  private pools: Pool[] = [];
  private members: any[] = [];
  private id = 1;

  async createPool(year: number, members: Array<{ shipId: string; cb_before: number; cb_after: number }>): Promise<Pool> {
    const pool: Pool = { id: this.id++, year, createdAt: new Date() };
    this.pools.push(pool);
    for (const m of members) this.members.push({ poolId: pool.id, ...m });
    return pool;
  }
}
