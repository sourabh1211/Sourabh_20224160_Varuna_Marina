export type Route = {
  id: number
  routeId: string
  shipId: string
  vesselType: string
  fuelType: string
  year: number
  ghgIntensity: number
  fuelConsumption: number
  distance: number
  totalEmissions: number
  isBaseline: boolean
}
export type ComparisonRow = {
  year: number
  baseline: { routeId: string; ghgIntensity: number }
  comparison: { routeId: string; ghgIntensity: number }
  percentDiff: number
  compliant: boolean
}
