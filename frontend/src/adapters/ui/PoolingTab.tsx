import { useState } from 'react'
import type { ApiPort } from '../../core/ports/ApiPort'

export default function PoolingTab({ api }: { api: ApiPort }) {
  const [year, setYear] = useState(2024)
  const [members, setMembers] = useState<string>('R001,R002,R003')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function create() {
    setError(null)
    try {
      const mem = members.split(',').map(s => ({ shipId: s.trim() })).filter(m => m.shipId)
      const res = await api.createPool(year, mem)
      setResult(res)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? String(e))
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1 w-28" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
        <input className="border rounded px-2 py-1 flex-1" value={members} onChange={e => setMembers(e.target.value)} />
        <button className="px-3 py-1 rounded bg-black text-white" onClick={create}>Create Pool</button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {result && (
        <div className="space-y-2">
          <div>Pool Sum: <b className={result.poolSum >= 0 ? 'text-emerald-600' : 'text-red-600'}>{Math.round(result.poolSum)}</b></div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  {['shipId','cb_before','cb_after'].map(h => <th key={h} className="py-2 pr-4">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {result.members.map((m:any, i:number) => (
                  <tr key={i} className="border-b">
                    <td className="py-1 pr-4">{m.shipId}</td>
                    <td className="py-1 pr-4">{m.cb_before.toFixed(0)}</td>
                    <td className="py-1 pr-4">{m.cb_after.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
