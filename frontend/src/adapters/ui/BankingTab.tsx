import { useEffect, useState } from 'react'
import type { ApiPort } from '../../core/ports/ApiPort'

export default function BankingTab({ api }: { api: ApiPort }) {
  const [shipId, setShipId] = useState('R001')
  const [year, setYear] = useState(2024)
  const [cb, setCb] = useState<number | null>(null)
  const [adjusted, setAdjusted] = useState<{ cb_before: number; applied: number; cb_after: number } | null>(null)
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setError(null)
    try {
      const c = await api.getCB(shipId, year)
      setCb(c.cb)
      const a = await api.getAdjustedCB(shipId, year)
      setAdjusted({ cb_before: a.cb_before, applied: a.applied, cb_after: a.cb_after })
    } catch (e: any) {
      setError(e?.response?.data?.error ?? String(e))
    }
  }

  useEffect(() => { refresh() }, [shipId, year])

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1" value={shipId} onChange={e => setShipId(e.target.value)} />
        <input className="border rounded px-2 py-1 w-28" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
        <button className="px-3 py-1 rounded bg-black text-white" onClick={refresh}>Refresh</button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="border rounded p-3 space-y-1">
        <div>CB (before): <b>{cb?.toFixed(0)}</b></div>
        <div>Applied (banking): <b>{adjusted?.applied.toFixed(0)}</b></div>
        <div>CB (after): <b>{adjusted?.cb_after.toFixed(0)}</b></div>
      </div>

      <div className="flex items-center gap-2">
        <input className="border rounded px-2 py-1 w-40" type="number" placeholder="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        <button className="px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-50"
          disabled={(cb ?? 0) <= 0}
          onClick={async () => { try { await api.bank(shipId, year, amount); await refresh() } catch (e:any) { setError(e?.response?.data?.error ?? String(e)) } }}>
          Bank
        </button>
        <button className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50"
          disabled={(cb ?? 0) >= 0}
          onClick={async () => { try { await api.apply(shipId, year, amount); await refresh() } catch (e:any) { setError(e?.response?.data?.error ?? String(e)) } }}>
          Apply
        </button>
      </div>
    </div>
  )
}
