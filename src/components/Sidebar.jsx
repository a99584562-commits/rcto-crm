import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import { currentUser, canManageUsers, ROLE_LABELS, ROLE_COLORS } from '../data/perm.js'
import { IconLayers, IconUser, IconBuilding, IconGlobe, IconDoc, IconBolt, IconChat, IconUsers, IconTask } from './Icons.jsx'

const NAV = [
  { id: 'pipelines', label: 'Воронки', icon: IconLayers },
  { id: 'tasks', label: 'Задачи', icon: IconTask },
  { id: 'chats', label: 'Чаты', icon: IconChat },
  { id: 'contacts', label: 'Контакты', icon: IconUser },
  { id: 'companies', label: 'Компании', icon: IconBuilding },
  { id: 'camps', label: 'Лагеря и смены', icon: IconGlobe },
  { id: 'documents', label: 'Документы', icon: IconDoc },
  { id: 'templates', label: 'Шаблоны', icon: IconBolt },
  { id: 'users', label: 'Пользователи', icon: IconUsers, adminOnly: true },
]

export default function Sidebar({ view, setView }) {
  const { state, actions } = useStore()
  const me = currentUser(state)
  const admin = canManageUsers(state)
  const [switcher, setSwitcher] = useState(false)
  const counts = {
    tasks: state.tasks.filter((t) => !t.done).length,
    chats: state.chats.length,
    contacts: state.contacts.length,
    companies: state.companies.length,
    camps: state.camps.length,
    documents: state.documents.length,
    templates: state.templates.length,
    users: state.users.length,
  }

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-ink-900/[0.06] bg-white">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-[17px] font-extrabold text-white shadow-glow">Р</div>
        <div className="leading-tight">
          <div className="text-[15px] font-extrabold tracking-tight text-ink-900">РЦТО</div>
          <div className="text-[10.5px] font-medium text-ink-400">CRM путёвок и туров</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scroll-thin">
        {NAV.filter((n) => !n.adminOnly || admin).map((item) => {
          const active = view === item.id
          const Icon = item.icon
          const c = counts[item.id]
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-300 ease-spring active:scale-[0.98] ${active ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-900/[0.04]'}`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-xl text-[17px] transition-colors ${active ? 'bg-brand-600 text-white' : 'text-ink-400 group-hover:text-ink-700'}`}><Icon /></span>
              <span className="flex-1 text-[13.5px] font-bold tracking-tight">{item.label}</span>
              {c != null && c > 0 && <span className={`rounded-full px-1.5 text-[10.5px] font-bold ${active ? 'bg-brand-600/15 text-brand-700' : 'bg-ink-900/[0.05] text-ink-400'}`}>{c}</span>}
            </button>
          )
        })}
      </nav>

      {/* Текущий пользователь + переключатель */}
      <div className="relative border-t border-ink-900/[0.06] p-3">
        {switcher && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setSwitcher(false)} />
            <div className="absolute bottom-[64px] left-3 right-3 z-20 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-ink-900/[0.08] animate-fade-up">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-ink-400">Войти как (демо)</div>
              {state.users.map((u) => (
                <button key={u.id} onClick={() => { actions.setCurrentUser(u.id); setSwitcher(false) }} className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-canvas ${u.id === me?.id ? 'bg-brand-50' : ''}`}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: u.color }}>{u.initials}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-bold text-ink-900">{u.name}</span>
                    <span className="block text-[10px] font-semibold" style={{ color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <button onClick={() => setSwitcher((s) => !s)} className="flex w-full items-center gap-2.5 rounded-2xl bg-canvas px-2.5 py-2 ring-1 ring-ink-900/[0.05] transition-all hover:ring-brand-500/30 active:scale-[0.99]">
          <span className="relative">
            <span className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: me?.color }}>{me?.initials}</span>
            {me?.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[12.5px] font-bold text-ink-900">{me?.name}</span>
            <span className="block text-[10px] font-bold" style={{ color: ROLE_COLORS[me?.role] }}>{ROLE_LABELS[me?.role]}</span>
          </span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-300"><path d="M8 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <button onClick={() => { if (confirm('Сбросить демо-данные к исходным? Все правки будут потеряны.')) actions.reset() }} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4" /></svg>
          Сбросить демо
        </button>
      </div>
    </aside>
  )
}
