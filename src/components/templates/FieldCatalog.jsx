import { useState } from 'react'
import { DOC_SCALAR_SOURCES, DOC_GROUPS, BENEFICIARY_FIELDS, FUNNEL_CONFIG } from '../../data/schema.js'
import { IconCheck, IconDoc } from '../Icons.jsx'

export function loopBlock(funnelKind) {
  const cfg = FUNNEL_CONFIG[funnelKind] || {}
  const ln = cfg.loopName || 'список'
  const fields = BENEFICIARY_FIELDS[funnelKind] || []
  const inner = fields.slice(0, 4).map((f) => `{${f.tag}}`).join(', ')
  return `{#${ln}}\n  •  ${inner}\n{/${ln}}`
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } catch (e2) { /* noop */ }
    document.body.removeChild(ta)
    return true
  }
}

// onInsert(snippet) → режим «вставить»; без него → режим «копировать»
export default function FieldCatalog({ funnelKind, onInsert }) {
  const [hit, setHit] = useState(null)
  const insertMode = typeof onInsert === 'function'
  const cfg = FUNNEL_CONFIG[funnelKind] || {}

  function act(snippet, key) {
    if (insertMode) onInsert(snippet)
    else copy(snippet)
    setHit(key)
    setTimeout(() => setHit((h) => (h === key ? null : h)), 1100)
  }

  function Chip({ tag, label, k }) {
    const snippet = `{${tag}}`
    const active = hit === k
    return (
      <button
        onClick={() => act(snippet, k)}
        title={insertMode ? `Вставить ${snippet}` : `Копировать ${snippet}`}
        className={`group flex items-center gap-1.5 rounded-lg px-2 py-1 text-left text-[11.5px] font-semibold ring-1 transition-all active:scale-95 ${active ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-white text-ink-700 ring-ink-900/[0.08] hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-500/30'}`}
      >
        <span className="truncate">{label}</span>
        {active ? <IconCheck className="text-[13px]" /> : <span className="font-mono text-[10px] text-ink-300 group-hover:text-brand-400">{`{${tag}}`}</span>}
      </button>
    )
  }

  const beneficiaryFields = BENEFICIARY_FIELDS[funnelKind] || []

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-brand-50/60 px-3 py-2 text-[11px] font-medium leading-snug text-brand-800">
        {insertMode ? 'Нажмите на поле — оно вставится в текст в месте курсора.' : 'Нажмите на поле — метка скопируется. Вставьте её в свой Word.'}
      </div>

      {DOC_GROUPS.map((group) => {
        const items = DOC_SCALAR_SOURCES.filter((s) => s.group === group)
        if (!items.length) return null
        return (
          <div key={group}>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-400">{group}</div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((s) => <Chip key={s.path} tag={s.tag} label={s.label} k={s.path} />)}
            </div>
          </div>
        )
      })}

      {/* Список (цикл) */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink-400">{cfg.beneficiaryLabelPlural || 'Список'} — повторяется для каждого</span>
          <button
            onClick={() => act(loopBlock(funnelKind), 'loop')}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10.5px] font-bold ring-1 transition-all active:scale-95 ${hit === 'loop' ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-violet-50 text-violet-700 ring-violet-200 hover:bg-violet-100'}`}
          >
            {hit === 'loop' ? <IconCheck className="text-[12px]" /> : <IconDoc className="text-[12px]" />}
            {insertMode ? 'Вставить весь список' : 'Скопировать блок списка'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {beneficiaryFields.map((f) => <Chip key={f.key} tag={f.tag} label={f.label} k={'b-' + f.key} />)}
        </div>
      </div>
    </div>
  )
}
