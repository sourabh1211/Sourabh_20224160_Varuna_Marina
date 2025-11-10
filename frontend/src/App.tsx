import { useState } from 'react'
import RoutesTab from './adapters/ui/RoutesTab'
import CompareTab from './adapters/ui/CompareTab'
import BankingTab from './adapters/ui/BankingTab'
import PoolingTab from './adapters/ui/PoolingTab'
import { httpClient } from './adapters/infrastructure/httpClient'

const TABS = ['Routes', 'Compare', 'Banking', 'Pooling'] as const

export default function App() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Routes')
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FuelEU Compliance Dashboard</h1>
        <nav className="flex gap-2">
          {TABS.map(t => (
            <button key={t} className={`px-3 py-1 rounded-lg border ${tab===t? 'bg-black text-white' : 'bg-white'}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main className="bg-white rounded-xl p-4 shadow-sm">
        {tab === 'Routes' && <RoutesTab api={httpClient} />}
        {tab === 'Compare' && <CompareTab api={httpClient} />}
        {tab === 'Banking' && <BankingTab api={httpClient} />}
        {tab === 'Pooling' && <PoolingTab api={httpClient} />}
      </main>
    </div>
  )
}
