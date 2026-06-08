import { useMemo, useState } from 'react'
import { FUNNELS } from '../data/seed.js'
import { getDealAmount, getMembers, memberContacts, byId } from '../data/model.js'
import { canEdit } from '../data/perm.js'
import { useStore } from '../store/StoreContext.jsx'

const ID_PREFIX = { leads: 'L', fiz: 'Ф', ul: 'Ю', to: 'Т' }
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
  const editable = canEdit(state)

  function createDeal(stageId) {
    const kind = funnel.kind
    const id = `${ID_PREFIX[kind] || 'D'}-${Math.floor(1000 + Math.random() * 9000)}`
    const base = { id, funnelId: activeId, stageId: stageId || funnel.stages[0].id, manager: 'shutova' }
    let deal
    if (kind === 'leads') deal = { ...base, title: 'Новый лид', source: 'site', phone: '', note: '', amount: null, paid: null, createdAt: 'только что' }
    else if (kind === 'fiz') deal = { ...base, title: 'Новая сделка', companyId: null, sourceContactId: null, members: [] }
    else if (kind === 'ul') deal = { ...base, title: 'Новая сделка', companyId: null, payType: 'Предоплата', members: [] }
    else deal = { ...base, title: 'Новая сделка', companyId: null, tour: '', dates: '', region: '', members: [] }
    actions.addDeal(activeId, deal)
    actions.logEvent(id, activeId, 'created', kind === 'leads' ? 'Лид создан вручную' : 'Сделка создана вручную')
    setSelectedId(id)
  }

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
        canCreate={editable}
        onCreate={() => createDeal()}
        onOpenIntegrations={() => setShowIntegrations(true)}
      />
      <Board funnel={funnel} deals={visibleDeals} editable={editable} onCreate={createDeal} onMove={(dealId, stageId) => actions.moveDeal(activeId, dealId, stageId)} onOpenDeal={(d) => setSelectedId(d.id)} />

      {selectedDeal && <DealView deal={selectedDeal} funnel={funnel} onClose={() => setSelectedId(null)} />}
      {showIntegrations && <IntegrationsModal onClose={() => setShowIntegrations(false)} />}
    </div>
  )
}
