import { useEffect, useMemo, useState } from 'react'
import type { ApiPort } from '../../core/ports/ApiPort'
import type { Route } from '../../core/domain/types'

export default function RoutesTab({ api }: { api: ApiPort }) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filters, setFilters] = useState<{ vesselType?: string; fuelType?: string; year?: number }>({})

  useEffect(() => {
    api.listRoutes(filters).then(setRoutes).catch(console.error)
  }, [JSON.stringify(filters)])

  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))), [routes])
  const fuelTypes   = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))), [routes])
  const years       = useMemo(() => Array.from(new Set(routes.map(r => r.year))).sort(), [routes])

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select className="border rounded px-2 py-1" onChange={e => setFilters(f => ({...f, vesselType: e.target.value || undefined}))}>
          <option value="">All vessels</option>
          {vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className="border rounded px-2 py-1" onChange={e => setFilters(f => ({...f, fuelType: e.target.value || undefined}))}>
          <option value="">All fuels</option>
          {fuelTypes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className="border rounded px-2 py-1" onChange={e => setFilters(f => ({...f, year: e.target.value ? Number(e.target.value) : undefined}))}>
          <option value="">All years</option>
          {years.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              {['routeId','vesselType','fuelType','year','ghgIntensity','fuelConsumption','distance','totalEmissions','baseline','actions'].map(h => (
                <th key={h} className="py-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r.id} className="border-b">
                <td className="py-1 pr-4">{r.routeId}</td>
                <td className="py-1 pr-4">{r.vesselType}</td>
                <td className="py-1 pr-4">{r.fuelType}</td>
                <td className="py-1 pr-4">{r.year}</td>
                <td className="py-1 pr-4">{r.ghgIntensity.toFixed(2)}</td>
                <td className="py-1 pr-4">{r.fuelConsumption}</td>
                <td className="py-1 pr-4">{r.distance}</td>
                <td className="py-1 pr-4">{r.totalEmissions}</td>
                <td className="py-1 pr-4">{r.isBaseline ? '✅' : '—'}</td>
                <td className="py-1 pr-4">
                  <button className="px-2 py-1 rounded bg-slate-900 text-white"
                    onClick={async () => { await api.setBaseline(r.routeId); const list = await api.listRoutes(filters); setRoutes(list); }}>
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
