import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { SchemaField } from '../common/SchemaField.jsx'
import { IconClose, IconSearch } from '../Icons.jsx'

// Универсальный реестр: таблица с инлайн-редактированием строк.
// columns: [{ key, label, type, options?, width? }]  (type — как в schema.js)
export default function RegistryView({ title, subtitle, coll, columns, makeNew, searchKeys = [] }) {
  const { state, actions } = useStore()
  const rows = state[coll]
  const [q, setQ] = useState('')

  const filtered = q.trim()
    ? rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase())))
    : rows

  const grid = columns.map((c) => c.width || '1fr').join(' ') + ' 40px'

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">{title}</h1>
          <p className="text-[11.5px] font-medium text-ink-400">{subtitle} · {rows.length}</p>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск…" className="w-48 rounded-full bg-white py-2 pl-9 pr-3 text-[13px] font-medium text-ink-900 shadow-soft outline-none ring-1 ring-ink-900/[0.05] transition-all focus:w-64 focus:ring-2 focus:ring-brand-500" />
          </div>
          <button onClick={() => actions[coll].add(makeNew())} className="rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-[0.98]">+ Добавить</button>
        </div>
      </header>

      <div className="scroll-thin flex-1 overflow-auto px-7 py-5">
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/[0.05]">
          <div className="grid items-center gap-2 border-b border-ink-900/[0.06] bg-canvas/60 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-400" style={{ gridTemplateColumns: grid }}>
            {columns.map((c) => (<div key={c.key} className="px-1">{c.label}</div>))}
            <div />
          </div>
          {filtered.length === 0 && <div className="px-4 py-10 text-center text-[13px] text-ink-300">Ничего не найдено</div>}
          {filtered.map((row) => (
            <div key={row.id} className="grid items-center gap-2 border-b border-ink-900/[0.04] px-3 py-1.5 transition-colors hover:bg-canvas/50" style={{ gridTemplateColumns: grid }}>
              {columns.map((c) => (
                <SchemaField key={c.key} field={c} value={row[c.key]} onChange={(v) => actions[coll].update(row.id, { [c.key]: v })} boxed={false} ctx={{ campId: row.campId }} />
              ))}
              <button onClick={() => actions[coll].remove(row.id)} className="grid h-7 w-7 place-items-center rounded-lg text-ink-300 transition-colors hover:bg-rose-50 hover:text-rose-500" title="Удалить"><IconClose className="text-[15px]" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
