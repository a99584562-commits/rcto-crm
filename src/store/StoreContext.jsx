import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { buildInitialState, FUNNELS } from '../data/seed.js'
import { DEAL_FIELDS, FUNNEL_CONFIG } from '../data/schema.js'
import { uid } from '../data/model.js'
import { buildSampleTemplate } from '../docs/docxEngine.js'

const KEY = 'rcto-crm-v7'
const VERSION = 7

const ddmmyyyy = (iso) => {
  if (!iso || !iso.includes('-')) return iso || ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

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

const COLLECTIONS = ['companies', 'contacts', 'camps', 'shifts', 'templates', 'documents', 'users', 'tasks', 'kb']

function mapDeal(state, funnelId, dealId, fn) {
  return { ...state, deals: { ...state.deals, [funnelId]: state.deals[funnelId].map((d) => (d.id === dealId ? fn(d) : d)) } }
}
const funnelKind = (id) => FUNNELS.find((f) => f.id === id)?.kind
const stageName = (funnelId, stageId) => FUNNELS.find((f) => f.id === funnelId)?.stages.find((s) => s.id === stageId)?.name || ''

// добавить событие в ленту (newest-first)
function withEvent(state, dealId, funnelId, type, text) {
  if (!dealId) return state.events
  const ev = { id: uid('ev'), dealId, funnelId, type, text, userId: state.currentUserId, at: new Date().toISOString() }
  return [ev, ...state.events]
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return freshState()
    case 'SET_USER':
      return { ...state, currentUserId: action.id }

    case 'ADD':
      return { ...state, [action.coll]: [action.item, ...state[action.coll]] }
    case 'UPDATE':
      return { ...state, [action.coll]: state[action.coll].map((x) => (x.id === action.id ? { ...x, ...action.patch } : x)) }
    case 'REMOVE':
      return { ...state, [action.coll]: state[action.coll].filter((x) => x.id !== action.id) }

    case 'DEAL_ADD':
      return { ...state, deals: { ...state.deals, [action.funnelId]: [action.deal, ...state.deals[action.funnelId]] } }
    case 'DEAL_REMOVE':
      return { ...state, deals: { ...state.deals, [action.funnelId]: state.deals[action.funnelId].filter((d) => d.id !== action.dealId) } }

    case 'DEAL_MOVE': {
      const deal = state.deals[action.funnelId].find((d) => d.id === action.dealId)
      if (!deal || deal.stageId === action.stageId) return state
      const text = `Стадия: «${stageName(action.funnelId, deal.stageId)}» → «${stageName(action.funnelId, action.stageId)}»`
      const ns = mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, stageId: action.stageId }))
      return { ...ns, events: withEvent(state, action.dealId, action.funnelId, 'stage', text) }
    }
    case 'DEAL_UPDATE': {
      const ns = mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, ...action.patch }))
      const fields = DEAL_FIELDS[funnelKind(action.funnelId)] || []
      const labels = Object.keys(action.patch).map((k) => fields.find((f) => f.key === k)?.label || k)
      return { ...ns, events: withEvent(state, action.dealId, action.funnelId, 'edit', `Изменено: ${labels.join(', ')}`) }
    }

    case 'MEMBER_ADD': {
      const ns = mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, members: [...(d.members || []), action.member] }))
      return { ...ns, events: withEvent(state, action.dealId, action.funnelId, 'member', `Добавлен участник: ${action.member.label}`) }
    }
    case 'MEMBER_UPDATE': {
      const ns = mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d, members: (d.members || []).map((m) => (m.id === action.memberId ? { ...m, ...action.patch } : m)),
      }))
      if (action.patch.contractStatus) {
        const m = state.deals[action.funnelId].find((d) => d.id === action.dealId)?.members?.find((x) => x.id === action.memberId)
        return { ...ns, events: withEvent(state, action.dealId, action.funnelId, 'status', `Статус договора «${m?.label || ''}»: ${action.patch.contractStatus}`) }
      }
      return ns
    }
    case 'MEMBER_REMOVE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({ ...d, members: (d.members || []).filter((m) => m.id !== action.memberId) }))

    case 'BEN_ADD': {
      const ns = mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d, members: (d.members || []).map((m) => (m.id === action.memberId ? { ...m, beneficiaries: [...(m.beneficiaries || []), action.ben] } : m)),
      }))
      const cfg = FUNNEL_CONFIG[funnelKind(action.funnelId)] || {}
      return { ...ns, events: withEvent(state, action.dealId, action.funnelId, 'member', `Добавлен: ${cfg.beneficiaryLabel || 'бенефициар'}`) }
    }
    case 'BEN_UPDATE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d, members: (d.members || []).map((m) =>
          m.id === action.memberId ? { ...m, beneficiaries: (m.beneficiaries || []).map((b) => (b.id === action.benId ? { ...b, ...action.patch } : b)) } : m),
      }))
    case 'BEN_REMOVE':
      return mapDeal(state, action.funnelId, action.dealId, (d) => ({
        ...d, members: (d.members || []).map((m) => (m.id === action.memberId ? { ...m, beneficiaries: (m.beneficiaries || []).filter((b) => b.id !== action.benId) } : m)),
      }))

    case 'TASK_ADD': {
      const ns = { ...state, tasks: [action.task, ...state.tasks] }
      if (action.task.dealId) {
        const due = action.task.dueDate ? ` (до ${ddmmyyyy(action.task.dueDate)}${action.task.dueTime ? ' ' + action.task.dueTime : ''})` : ''
        ns.events = withEvent(state, action.task.dealId, action.task.funnelId, 'task', `Поставлено дело: ${action.task.title}${due}`)
      }
      return ns
    }
    case 'TASK_TOGGLE': {
      const t = state.tasks.find((x) => x.id === action.id)
      if (!t) return state
      const done = !t.done
      const ns = { ...state, tasks: state.tasks.map((x) => (x.id === action.id ? { ...x, done } : x)) }
      if (done && t.dealId) ns.events = withEvent(state, t.dealId, t.funnelId, 'task', `Дело выполнено: ${t.title}`)
      return ns
    }

    case 'LOG_EVENT':
      return { ...state, events: withEvent(state, action.dealId, action.funnelId, action.eventType, action.text) }

    case 'CHAT_SEND':
      return {
        ...state,
        chats: state.chats.map((c) => (c.id === action.chatId ? { ...c, messages: [...c.messages, { id: uid('m'), userId: state.currentUserId, text: action.text, at: new Date().toISOString() }] } : c)),
      }
    case 'CHAT_ADD':
      return { ...state, chats: [...state.chats, action.chat] }

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
      users: reg('users'),
      tasks: reg('tasks'),
      kb: reg('kb'),
      addTask: (task) => dispatch({ type: 'TASK_ADD', task }),
      toggleTask: (id) => dispatch({ type: 'TASK_TOGGLE', id }),
      setCurrentUser: (id) => dispatch({ type: 'SET_USER', id }),
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
      logEvent: (dealId, funnelId, eventType, text) => dispatch({ type: 'LOG_EVENT', dealId, funnelId, eventType, text }),
      addComment: (dealId, funnelId, text) => dispatch({ type: 'LOG_EVENT', dealId, funnelId, eventType: 'comment', text }),
      sendMessage: (chatId, text) => dispatch({ type: 'CHAT_SEND', chatId, text }),
      addChat: (chat) => dispatch({ type: 'CHAT_ADD', chat }),
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
