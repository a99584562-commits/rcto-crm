import { useStore } from '../store/StoreContext.jsx'
import { IconLayers, IconUser, IconBuilding, IconGlobe, IconDoc, IconBolt } from './Icons.jsx'

const NAV = [
  { id: 'pipelines', label: 'Воронки', icon: IconLayers },
  { id: 'contacts', label: 'Контакты', icon: IconUser },
  { id: 'companies', label: 'Компании', icon: IconBuilding },
  { id: 'camps', label: 'Лагеря и смены', icon: IconGlobe },
  { id: 'documents', label: 'Документы', icon: IconDoc },
  { id: 'templates', label: 'Шаблоны', icon: IconBolt },
]

export default function Sidebar({ view, setView }) {
  const { state, actions } = useStore()
  const counts = {
    contacts: state.contacts.length,
    companies: state.companies.length,
    camps: state.camps.length,
    documents: state.documents.length,
    templates: state.templates.length,
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

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = view === item.id
          const Icon = item.icon
          const c = counts[item.id]
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-300 ease-spring active:scale-[0.98] ${
                active ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-900/[0.04]'
              }`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-xl text-[17px] transition-colors ${active ? 'bg-brand-600 text-white' : 'text-ink-400 group-hover:text-ink-700'}`}>
                <Icon />
              </span>
              <span className="flex-1 text-[13.5px] font-bold tracking-tight">{item.label}</span>
              {c != null && c > 0 && (
                <span className={`rounded-full px-1.5 text-[10.5px] font-bold ${active ? 'bg-brand-600/15 text-brand-700' : 'bg-ink-900/[0.05] text-ink-400'}`}>{c}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-ink-900/[0.06] p-3">
        <button
          onClick={() => {
            if (confirm('Сбросить демо-данные к исходным? Все правки будут потеряны.')) actions.reset()
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4" />
          </svg>
          Сбросить демо
        </button>
      </div>
    </aside>
  )
}
