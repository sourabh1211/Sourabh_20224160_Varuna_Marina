import axios from 'axios'
import type { ApiPort } from '../../core/ports/ApiPort'
import type { Route, ComparisonRow } from '../../core/domain/types'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const httpClient: ApiPort = {
  async listRoutes(params) {
    const res = await axios.get<Route[]>(`${BASE}/routes`, { params })
    return res.data
  },
  async setBaseline(routeId) {
    await axios.post(`${BASE}/routes/${routeId}/baseline`)
  },
  async getComparison() {
    const res = await axios.get<{ target: number; data: ComparisonRow[] }>(`${BASE}/routes/comparison`)
    return res.data
  },
  async getCB(shipId, year) {
    const res = await axios.get(`${BASE}/compliance/cb`, { params: { shipId, year } })
    return res.data
  },
  async getAdjustedCB(shipId, year) {
    const res = await axios.get(`${BASE}/compliance/adjusted-cb`, { params: { shipId, year } })
    return res.data
  },
  async listBanking(shipId, year) {
    const res = await axios.get(`${BASE}/banking/records`, { params: { shipId, year } })
    return res.data
  },
  async bank(shipId, year, amount) {
    const res = await axios.post(`${BASE}/banking/bank`, { shipId, year, amount })
    return res.data
  },
  async apply(shipId, year, amount) {
    const res = await axios.post(`${BASE}/banking/apply`, { shipId, year, amount })
    return res.data
  },
  async createPool(year, members) {
    const res = await axios.post(`${BASE}/pools`, { year, members })
    return res.data
  }
}
