import { useMemo, useState } from 'react'
import { FUNNELS } from './data/funnels.js'
import TopBar from './components/TopBar.jsx'
import Board from './components/Board.jsx'
import DealModal from './components/DealModal.jsx'
import IntegrationsModal from './components/IntegrationsModal.jsx'

// Начальное состояние: сделки по воронкам { funnelId: [deal, ...] }
const initialDeals = Object.fromEntries(FUNNELS.map((f) => [f.id, f.deals.map((d) => ({ ...d }))]))

export default function App() {
  const [dealsByFunnel, setDealsByFunnel] = useState(initialDeals)
  const [activeId, setActiveId] = useState('leads')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [showIntegrations, setShowIntegrations] = useState(false)

  const funnel = FUNNELS.find((f) => f.id === activeId)
  const deals = dealsByFunnel[activeId]

  // Бейджи воронок (по всем сделкам, без учёта поиска)
  const counts = useMemo(() => {
    const out = {}
    for (const f of FUNNELS) {
      const arr = dealsByFunnel[f.id]
      out[f.id] = { count: arr.length, sum: arr.reduce((s, d) => s + (d.amount || 0), 0) }
    }
    return out
  }, [dealsByFunnel])

  // Поиск внутри активной воронки
  const visibleDeals = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return deals
    return deals.filter((d) =>
      [d.title, d.phone, d.id, d.child, d.sanatorium, d.tour, d.camp, d.region]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [deals, query])

  function moveDeal(dealId, toStageId) {
    setDealsByFunnel((prev) => ({
      ...prev,
      [activeId]: prev[activeId].map((d) => (d.id === dealId ? { ...d, stageId: toStageId } : d)),
    }))
  }

  const selectedDeal = selectedId ? deals.find((d) => d.id === selectedId) : null

  return (
    <div className="flex h-screen min-h-[100dvh] flex-col bg-canvas">
      <TopBar
        funnels={FUNNELS}
        activeId={activeId}
        onSelect={setActiveId}
        query={query}
        setQuery={setQuery}
        counts={counts}
        onOpenIntegrations={() => setShowIntegrations(true)}
      />

      <Board funnel={funnel} deals={visibleDeals} onMove={moveDeal} onOpenDeal={(d) => setSelectedId(d.id)} />

      {selectedDeal && (
        <DealModal deal={selectedDeal} funnel={funnel} onClose={() => setSelectedId(null)} onMove={moveDeal} />
      )}
      {showIntegrations && <IntegrationsModal onClose={() => setShowIntegrations(false)} />}
    </div>
  )
}
