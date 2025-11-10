import { Route, ComparisonRow } from '../domain/types'
export interface ApiPort {
  listRoutes(params?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>
  setBaseline(routeId: string): Promise<void>
  getComparison(): Promise<{ target: number; data: ComparisonRow[] }>
  getCB(shipId: string, year: number): Promise<{ shipId: string; year: number; cb: number }>
  getAdjustedCB(shipId: string, year: number): Promise<{ shipId: string; year: number; cb_before: number; applied: number; cb_after: number }>
  listBanking(shipId: string, year?: number): Promise<Array<{ id: number; shipId: string; year: number; amount_gco2eq: number; createdAt: string }>>

  bank(shipId: string, year: number, amount: number): Promise<{ cb_before: number; applied: number; cb_after: number }>
  apply(shipId: string, year: number, amount: number): Promise<{ cb_before: number; applied: number; cb_after: number }>

  createPool(year: number, members: { shipId: string }[]): Promise<{ pool: { id: number; year: number }; members: { shipId: string; cb_before: number; cb_after: number }[]; poolSum: number }>
}
