import { ICONS, IconSearch, IconPhone, IconDoc, IconLayers } from './Icons.jsx'
import { formatMoneyShort } from '../data/funnels.js'

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-[17px] font-extrabold text-white shadow-glow">
        Р
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-extrabold tracking-tight text-ink-900">РЦТО</span>
          <span className="hidden rounded-full bg-ink-900/[0.05] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-400 sm:inline">
            CRM
          </span>
        </div>
        <span className="hidden text-[11px] font-medium text-ink-400 sm:block">Откройте для себя — путёвки, лагеря, туры</span>
      </div>
    </div>
  )
}

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

export default function TopBar({ funnels, activeId, onSelect, query, setQuery, counts, onOpenIntegrations }) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-900/[0.06] bg-canvas/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-8">
        <BrandMark />
        <div className="ml-auto flex items-center gap-2.5">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск сделки, телефона…"
              className="w-40 rounded-full bg-white py-2 pl-9 pr-3 text-[13px] font-medium text-ink-900 shadow-soft outline-none ring-1 ring-ink-900/[0.05] transition-all duration-300 placeholder:text-ink-300 focus:w-60 focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <IntegrationPill icon={IconPhone} label="Телефония" onClick={onOpenIntegrations} />
          <IntegrationPill icon={IconDoc} label="1С" onClick={onOpenIntegrations} />
        </div>
      </div>

      {/* Табы воронок */}
      <nav className="flex items-center gap-2 overflow-x-auto px-5 pb-3 sm:px-8 scroll-thin">
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
                style={{
                  backgroundColor: active ? f.accent + '18' : 'transparent',
                  color: active ? f.accent : '#838ca0',
                }}
              >
                <Icon />
              </span>
              <span className="text-left leading-tight">
                <span className={`block text-[13px] font-bold tracking-tight ${active ? 'text-ink-900' : 'text-ink-500'}`}>
                  {f.name}
                </span>
                <span className="block text-[10.5px] font-medium text-ink-400">
                  {c.count} сделок · {formatMoneyShort(c.sum)}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
