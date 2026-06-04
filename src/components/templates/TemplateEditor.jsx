import { useEffect, useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { FUNNELS } from '../../data/seed.js'
import { BENEFICIARY_FIELDS, DOC_SCALAR_SOURCES } from '../../data/schema.js'
import { IconClose, IconCheck, IconBolt } from '../Icons.jsx'

const norm = (s) => String(s).toLowerCase().replace(/[_\s]+/g, '')

export function guessScalar(tag) {
  const t = norm(tag)
  let best = ''
  for (const s of DOC_SCALAR_SOURCES) {
    const hay = norm(s.label + s.path)
    if (hay.includes(t) || t.includes(norm(s.path.split('.').pop()))) {
      best = s.path
      break
    }
  }
  return best
}
export function guessBenField(innerTag, funnelKind) {
  const t = norm(innerTag)
  const fields = BENEFICIARY_FIELDS[funnelKind] || []
  const hit = fields.find((f) => norm(f.label).includes(t) || t.includes(norm(f.key)) || norm(f.label).includes(norm(f.key)))
  // прямые соответствия по смыслу
  const map = { фио: 'fullName', датарождения: 'birthDate', свидетельство: 'birthCertNo', лагерь: 'campId', смена: 'shiftId', санаторий: 'campId', тур: 'note' }
  return map[t] || hit?.key || (fields[0]?.key ?? '')
}

export default function TemplateEditor({ template, onClose }) {
  const { state, actions } = useStore()
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(template)))
  const funnelKind = draft.funnelId
  const benFields = BENEFICIARY_FIELDS[funnelKind] || []

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function setMap(tag, path) {
    setDraft((d) => ({ ...d, mapping: { ...d.mapping, [tag]: path } }))
  }
  function setLoopField(loopName, innerTag, fieldKey) {
    setDraft((d) => ({
      ...d,
      loopMapping: {
        ...d.loopMapping,
        [loopName]: {
          source: 'beneficiaries',
          fields: { ...(d.loopMapping?.[loopName]?.fields || {}), [innerTag]: fieldKey },
        },
      },
    }))
  }
  function setFunnel(funnelId) {
    // переавтоматизировать поля циклов под новую воронку
    const lm = {}
    for (const [ln, inner] of Object.entries(draft.loops || {})) {
      lm[ln] = { source: 'beneficiaries', fields: {} }
      for (const it of inner) lm[ln].fields[it] = guessBenField(it, funnelId)
    }
    setDraft((d) => ({ ...d, funnelId, loopMapping: lm }))
  }
  function save() {
    actions.templates.update(draft.id, {
      name: draft.name,
      funnelId: draft.funnelId,
      entity: draft.entity,
      mapping: draft.mapping,
      loopMapping: draft.loopMapping,
    })
    onClose()
  }

  const scalarTags = draft.tags || []
  const loops = draft.loops || {}

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-4xl bg-canvas shadow-lift animate-scale-in">
        <header className="flex items-start gap-3 bg-white px-6 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600"><IconBolt className="text-[19px]" /></span>
          <div className="flex-1">
            <h2 className="text-[17px] font-extrabold tracking-tight text-ink-900">Настройка шаблона</h2>
            <p className="text-[12px] font-medium text-ink-400">{draft.fileName}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-ink-900/[0.06]"><IconClose className="text-[17px]" /></button>
        </header>

        <div className="scroll-thin flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Основное */}
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-3 sm:col-span-1">
              <span className="mb-1 block text-[10.5px] font-bold uppercase tracking-wide text-ink-400">Название</span>
              <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="w-full rounded-xl bg-white px-3 py-2 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
            </label>
            <label>
              <span className="mb-1 block text-[10.5px] font-bold uppercase tracking-wide text-ink-400">Воронка</span>
              <select value={draft.funnelId} onChange={(e) => setFunnel(e.target.value)} className="w-full rounded-xl bg-white px-3 py-2 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                {FUNNELS.filter((f) => f.kind !== 'leads').map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-[10.5px] font-bold uppercase tracking-wide text-ink-400">Формируется</span>
              <select value={draft.entity} onChange={(e) => setDraft((d) => ({ ...d, entity: e.target.value }))} className="w-full rounded-xl bg-white px-3 py-2 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                <option value="member">По участнику (договор)</option>
                <option value="deal">По сделке целиком</option>
              </select>
            </label>
          </div>

          {/* Скалярные теги */}
          <div>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Теги документа · {scalarTags.length}</h3>
            {scalarTags.length === 0 && <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-700">В документе не найдено тегов вида {'{поле}'}. Добавьте их в Word и загрузите снова.</p>}
            <div className="space-y-1.5">
              {scalarTags.map((tag) => (
                <div key={tag} className="grid grid-cols-[160px_1fr] items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-ink-900/[0.05]">
                  <code className="truncate font-mono text-[12px] font-bold text-brand-700">{'{' + tag + '}'}</code>
                  <select value={draft.mapping?.[tag] || ''} onChange={(e) => setMap(tag, e.target.value)} className="w-full rounded-lg bg-canvas px-2 py-1.5 text-[12.5px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                    <option value="">— не заполнять —</option>
                    {DOC_SCALAR_SOURCES.map((s) => (<option key={s.path} value={s.path}>{s.label}</option>))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Циклы (списки) */}
          {Object.keys(loops).length > 0 && (
            <div>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Списки (повторяющиеся строки)</h3>
              {Object.entries(loops).map(([loopName, inner]) => (
                <div key={loopName} className="mb-2 rounded-2xl bg-white p-3 ring-1 ring-ink-900/[0.05]">
                  <div className="mb-2 flex items-center gap-2 text-[12.5px] font-bold text-ink-900">
                    <code className="font-mono text-brand-700">{'{#' + loopName + '}…{/' + loopName + '}'}</code>
                    <span className="text-[11px] font-medium text-ink-400">→ список «{loopName}» (бенефициары)</span>
                  </div>
                  <div className="space-y-1.5">
                    {inner.map((it) => (
                      <div key={it} className="grid grid-cols-[160px_1fr] items-center gap-2">
                        <code className="truncate font-mono text-[12px] font-bold text-ink-700">{'{' + it + '}'}</code>
                        <select value={draft.loopMapping?.[loopName]?.fields?.[it] || ''} onChange={(e) => setLoopField(loopName, it, e.target.value)} className="w-full rounded-lg bg-canvas px-2 py-1.5 text-[12.5px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                          <option value="">— не заполнять —</option>
                          {benFields.map((f) => (<option key={f.key} value={f.key}>{f.label}</option>))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-ink-900/[0.06] bg-white px-6 py-3.5">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-[13px] font-bold text-ink-500 hover:bg-ink-900/[0.04]">Отмена</button>
          <button onClick={save} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-[0.98]"><IconCheck className="text-[16px]" /> Сохранить</button>
        </footer>
      </div>
    </div>
  )
}
