import { ICONS, IconSearch, IconPhone, IconDoc, IconLayers } from './Icons.jsx'
import { formatMoneyShort } from '../data/seed.js'

function IntegrationPill({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-soft ring-1 ring-ink-900/[0.05] transition-all duration-300 ease-spring hover:ring-brand-500/40 active:scale-[0.97]"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <Icon className="text-[15px] text-ink-500" />
      <span className="hidden text-[12px] font-semibold text-ink-700 md:inline">{label}</span>
    </button>
  )
}

export default function TopBar({ funnels, activeId, onSelect, query, setQuery, counts, canCreate, onCreate, onOpenIntegrations }) {
  const createLabel = funnels.find((f) => f.id === activeId)?.kind === 'leads' ? '+ Лид' : '+ Сделка'
  return (
    <header className="z-20 border-b border-ink-900/[0.06] bg-canvas/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-5 pt-4 sm:px-7">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Сделки по воронкам</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Канбан · перетаскивайте сделки между стадиями</p>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {canCreate && (
            <button
              onClick={onCreate}
              className="rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-[0.98]"
            >
              {createLabel}
            </button>
          )}
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск сделки, телефона…"
              className="w-44 rounded-full bg-white py-2 pl-9 pr-3 text-[13px] font-medium text-ink-900 shadow-soft outline-none ring-1 ring-ink-900/[0.05] transition-all duration-300 placeholder:text-ink-300 focus:w-64 focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <IntegrationPill icon={IconPhone} label="Телефония" onClick={onOpenIntegrations} />
          <IntegrationPill icon={IconDoc} label="1С" onClick={onOpenIntegrations} />
        </div>
      </div>

      <nav className="scroll-thin flex items-center gap-2 overflow-x-auto px-5 pb-3 pt-3 sm:px-7">
        {funnels.map((f) => {
          const Icon = ICONS[f.icon] || IconLayers
          const active = f.id === activeId
          const c = counts[f.id] || { count: 0, sum: 0 }
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`group flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2 transition-all duration-300 ease-spring active:scale-[0.98] ${
                active ? 'bg-white shadow-soft ring-1 ring-ink-900/[0.06]' : 'hover:bg-white/60'
              }`}
            >
              <span
                className="grid h-7 w-7 place-items-center rounded-xl text-[15px] transition-colors"
                style={{ backgroundColor: active ? f.accent + '18' : 'transparent', color: active ? f.accent : '#838ca0' }}
              >
                <Icon />
              </span>
              <span className="text-left leading-tight">
                <span className={`block text-[13px] font-bold tracking-tight ${active ? 'text-ink-900' : 'text-ink-500'}`}>{f.name}</span>
                <span className="block text-[10.5px] font-medium text-ink-400">{c.count} сделок · {formatMoneyShort(c.sum)}</span>
              </span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
