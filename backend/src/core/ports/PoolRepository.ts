import { Pool } from "../domain/Pool.js";
export interface PoolRepository {
  createPool(year: number, members: Array<{ shipId: string; cb_before: number; cb_after: number }>): Promise<Pool>;
}
