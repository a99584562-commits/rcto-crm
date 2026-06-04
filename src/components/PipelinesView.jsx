import { useMemo, useState } from 'react'
import { FUNNELS } from '../data/seed.js'
import { getDealAmount, getMembers, memberContacts, byId } from '../data/model.js'
import { useStore } from '../store/StoreContext.jsx'
import TopBar from './TopBar.jsx'
import Board from './Board.jsx'
import DealView from './deal/DealView.jsx'
import IntegrationsModal from './IntegrationsModal.jsx'

export default function PipelinesView() {
  const { state, actions } = useStore()
  const [activeId, setActiveId] = useState('leads')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [showIntegrations, setShowIntegrations] = useState(false)

  const funnel = FUNNELS.find((f) => f.id === activeId)
  const deals = state.deals[activeId] || []

  const counts = useMemo(() => {
    const out = {}
    for (const f of FUNNELS) {
      const arr = state.deals[f.id] || []
      out[f.id] = { count: arr.length, sum: arr.reduce((s, d) => s + (getDealAmount(d) || 0), 0) }
    }
    return out
  }, [state.deals])

  const visibleDeals = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return deals
    return deals.filter((d) => {
      const parts = [d.title, d.phone, d.id]
      const company = byId(state.companies, d.companyId)
      if (company) parts.push(company.name)
      for (const m of getMembers(d)) {
        parts.push(m.label)
        memberContacts(m, state.contacts).forEach((c) => parts.push(c.fullName, c.phone))
        ;(m.beneficiaries || []).forEach((b) => parts.push(b.fullName))
      }
      return parts.filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    })
  }, [deals, query, state.companies, state.contacts])

  const selectedDeal = selectedId ? deals.find((d) => d.id === selectedId) : null

  return (
    <div className="flex h-full flex-col">
      <TopBar
        funnels={FUNNELS}
        activeId={activeId}
        onSelect={setActiveId}
        query={query}
        setQuery={setQuery}
        counts={counts}
        onOpenIntegrations={() => setShowIntegrations(true)}
      />
      <Board funnel={funnel} deals={visibleDeals} onMove={(dealId, stageId) => actions.moveDeal(activeId, dealId, stageId)} onOpenDeal={(d) => setSelectedId(d.id)} />

      {selectedDeal && <DealView deal={selectedDeal} funnel={funnel} onClose={() => setSelectedId(null)} />}
      {showIntegrations && <IntegrationsModal onClose={() => setShowIntegrations(false)} />}
    </div>
  )
}
