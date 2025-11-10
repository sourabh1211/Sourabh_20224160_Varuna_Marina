export interface Pool {
  id: number;
  year: number;
  createdAt: Date;
}
export interface PoolMember {
  id: number;
  poolId: number;
  shipId: string;
  cb_before: number;
  cb_after: number;
}
