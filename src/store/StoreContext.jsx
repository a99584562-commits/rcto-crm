import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { buildInitialState } from '../data/seed.js'
import { buildSampleTemplate } from '../docs/docxEngine.js'

const KEY = 'rcto-crm-v2'
const VERSION = 2

function freshState() {
  const s = buildInitialState()
  s.templates = [buildSampleTemplate()]
  return s
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.v === VERSION && parsed.state) return parsed.state
    }
  } catch (e) {
    /* ignore */
  }
  return freshState()
}

// Коллекции-реестры (плоские массивы)
const COLLECTIONS = ['companies', 'contacts', 'camps', 'shifts', 'templates', 'documents']

function mapDeal(state, funnelId, dealId, fn) {
  return {
    ...state,
    deals: {
      ...state.deals,
      [funnelId]: state.deals[funnelId].map((d) => (d.id === dealId ? fn(d) : d)),
    },
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return freshState()

    case 'ADD':
      return { ...state, [action.coll]: [action.item, ...state[action.coll]] }
    case 'UPDATE':
      return { ...state, [action.coll]: state[action.coll].map((x) => (x.id === action.id ? { ...x, ...action.patch } : x)) }
    case 'REMOVE':
      return { ...state, [action.coll]: state[action.coll].filter((x) => x.id !== action.id) }

    case 'DEAL_ADD':
      return { ...state, deals: { ...state.deals, [action.funnelId]: [action.deal, ...state.deals[action.funnelId]] } }
    case 'DEAL_MOVE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, stageId: action.stageId }))
    case 'DEAL_UPDATE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, ...action.patch }))
    case 'DEAL_REMOVE':
      return { ...state, deals: { ...state.deals, [action.funnelId]: state.deals[action.funnelId].filter((d) => d.id !== action.dealId) } }

    case 'MEMBER_ADD':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, members: [...(d.members || []), action.member] }))
    case 'MEMBER_UPDATE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d,
        members: (d.members || []).map((m) => (m.id === action.memberId ? { ...m, ...action.patch } : m)),
      }))
    case 'MEMBER_REMOVE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, members: (d.members || []).filter((m) => m.id !== action.memberId) }))

    case 'BEN_ADD':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d,
        members: (d.members || []).map((m) => (m.id === action.memberId ? { ...m, beneficiaries: [...(m.beneficiaries || []), action.ben] } : m)),
      }))
    case 'BEN_UPDATE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d,
        members: (d.members || []).map((m) =>
          m.id === action.memberId
            ? { ...m, beneficiaries: (m.beneficiaries || []).map((b) => (b.id === action.benId ? { ...b, ...action.patch } : b)) }
            : m,
        ),
      }))
    case 'BEN_REMOVE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d,
        members: (d.members || []).map((m) =>
          m.id === action.memberId ? { ...m, beneficiaries: (m.beneficiaries || []).filter((b) => b.id !== action.benId) } : m,
        ),
      }))

    default:
      return state
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: VERSION, state }))
    } catch (e) {
      /* quota — ignore for demo */
    }
  }, [state])

  const actions = useMemo(() => {
    const reg = (coll) => ({
      add: (item) => dispatch({ type: 'ADD', coll, item }),
      update: (id, patch) => dispatch({ type: 'UPDATE', coll, id, patch }),
      remove: (id) => dispatch({ type: 'REMOVE', coll, id }),
    })
    return {
      companies: reg('companies'),
      contacts: reg('contacts'),
      camps: reg('camps'),
      shifts: reg('shifts'),
      templates: reg('templates'),
      documents: reg('documents'),
      addDeal: (funnelId, deal) => dispatch({ type: 'DEAL_ADD', funnelId, deal }),
      moveDeal: (funnelId, dealId, stageId) => dispatch({ type: 'DEAL_MOVE', funnelId, dealId, stageId }),
      updateDeal: (funnelId, dealId, patch) => dispatch({ type: 'DEAL_UPDATE', funnelId, dealId, patch }),
      removeDeal: (funnelId, dealId) => dispatch({ type: 'DEAL_REMOVE', funnelId, dealId }),
      addMember: (funnelId, dealId, member) => dispatch({ type: 'MEMBER_ADD', funnelId, dealId, member }),
      updateMember: (funnelId, dealId, memberId, patch) => dispatch({ type: 'MEMBER_UPDATE', funnelId, dealId, memberId, patch }),
      removeMember: (funnelId, dealId, memberId) => dispatch({ type: 'MEMBER_REMOVE', funnelId, dealId, memberId }),
      addBeneficiary: (funnelId, dealId, memberId, ben) => dispatch({ type: 'BEN_ADD', funnelId, dealId, memberId, ben }),
      updateBeneficiary: (funnelId, dealId, memberId, benId, patch) => dispatch({ type: 'BEN_UPDATE', funnelId, dealId, memberId, benId, patch }),
      removeBeneficiary: (funnelId, dealId, memberId, benId) => dispatch({ type: 'BEN_REMOVE', funnelId, dealId, memberId, benId }),
      reset: () => dispatch({ type: 'RESET' }),
    }
  }, [])

  const value = useMemo(() => ({ state, actions, COLLECTIONS }), [state, actions])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
