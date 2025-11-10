import { useEffect, useState } from 'react'
import type { ApiPort } from '../../core/ports/ApiPort'
import type { ComparisonRow } from '../../core/domain/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

export default function CompareTab({ api }: { api: ApiPort }) {
  const [data, setData] = useState<ComparisonRow[]>([])
  const [target, setTarget] = useState<number>(89.3368)

  useEffect(() => {
    api.getComparison().then(res => { setData(res.data); setTarget(res.target) }).catch(console.error)
  }, [])

  const chartData = data.map(d => ({
    name: `${d.baseline.routeId} vs ${d.comparison.routeId}`,
    baseline: d.baseline.ghgIntensity,
    comparison: d.comparison.ghgIntensity
  }))

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">Target intensity: <b>{target.toFixed(4)} gCO₂e/MJ</b></p>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              {['year','baseline (gCO₂e/MJ)','comparison (gCO₂e/MJ)','% diff','compliant'].map(h => <th key={h} className="py-2 pr-4">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-b">
                <td className="py-1 pr-4">{d.year}</td>
                <td className="py-1 pr-4">{d.baseline.ghgIntensity.toFixed(2)}</td>
                <td className="py-1 pr-4">{d.comparison.ghgIntensity.toFixed(2)}</td>
                <td className="py-1 pr-4">{d.percentDiff.toFixed(2)}%</td>
                <td className="py-1 pr-4">{d.compliant ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" />
            <Bar dataKey="comparison" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
