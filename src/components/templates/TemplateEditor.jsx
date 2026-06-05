import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { FUNNELS } from '../../data/seed.js'
import { BENEFICIARY_FIELDS, DOC_SCALAR_SOURCES, DOC_GROUPS, buildAutoMapping } from '../../data/schema.js'
import { getMembers } from '../../data/model.js'
import { renderToText, buildData } from '../../docs/docxEngine.js'
import FieldCatalog from './FieldCatalog.jsx'
import { IconClose, IconCheck, IconBolt } from '../Icons.jsx'

export default function TemplateEditor({ template, onClose }) {
  const { state, actions } = useStore()
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(template)))
  const [showCatalog, setShowCatalog] = useState(false)
  const benFields = BENEFICIARY_FIELDS[draft.funnelId] || []

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const setMap = (tag, path) => setDraft((d) => ({ ...d, mapping: { ...d.mapping, [tag]: path } }))
  const setLoopField = (loopName, innerTag, key) =>
    setDraft((d) => ({ ...d, loopMapping: { ...d.loopMapping, [loopName]: { source: 'beneficiaries', fields: { ...(d.loopMapping?.[loopName]?.fields || {}), [innerTag]: key } } } }))

  function setFunnel(funnelId) {
    setDraft((d) => {
      const { mapping, loopMapping } = buildAutoMapping(d.tags, d.loops, funnelId)
      return { ...d, funnelId, mapping, loopMapping }
    })
  }

  function save() {
    actions.templates.update(draft.id, { name: draft.name, funnelId: draft.funnelId, entity: draft.entity, mapping: draft.mapping, loopMapping: draft.loopMapping })
    onClose()
  }

  const scalarTags = draft.tags || []
  const loops = draft.loops || {}
  const mappedCount = scalarTags.filter((t) => draft.mapping?.[t]).length
  const allMapped = mappedCount === scalarTags.length

  // Предпросмотр на реальной сделке
  const preview = useMemo(() => {
    const deals = state.deals[draft.funnelId] || []
    const deal = deals.find((d) => getMembers(d).length) || deals[0]
    if (!deal) return 'Нет сделки для предпросмотра в этой воронке.'
    const member = draft.entity === 'member' ? getMembers(deal)[0] : null
    const stage = FUNNELS.find((f) => f.id === draft.funnelId)?.stages.find((s) => s.id === deal.stageId)
    return renderToText(draft, buildData(draft, deal, member, { ...state, stageName: stage?.name || '' }))
  }, [draft, state])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative flex h-[88vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-4xl bg-canvas shadow-lift animate-scale-in">
        <header className="flex items-center gap-3 bg-white px-6 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600"><IconBolt className="text-[19px]" /></span>
          <div className="flex-1">
            <h2 className="text-[17px] font-extrabold tracking-tight text-ink-900">Настройка шаблона</h2>
            <p className="text-[12px] font-medium text-ink-400">{draft.fileName}</p>
          </div>
          <button onClick={save} className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-95"><IconCheck className="text-[15px]" /> Сохранить</button>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-900/[0.06]"><IconClose className="text-[18px]" /></button>
        </header>

        <div className="grid grid-cols-3 gap-2 border-b border-ink-900/[0.06] bg-white px-6 pb-4">
          <label className="text-[10.5px] font-bold uppercase tracking-wide text-ink-400">Название
            <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold normal-case tracking-normal text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
          </label>
          <label className="text-[10.5px] font-bold uppercase tracking-wide text-ink-400">Воронка
            <select value={draft.funnelId} onChange={(e) => setFunnel(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold normal-case tracking-normal text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
              {FUNNELS.filter((f) => f.kind !== 'leads').map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </label>
          <label className="text-[10.5px] font-bold uppercase tracking-wide text-ink-400">Для кого
            <select value={draft.entity} onChange={(e) => setDraft((d) => ({ ...d, entity: e.target.value }))} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold normal-case tracking-normal text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
              <option value="member">Для каждого участника</option>
              <option value="deal">Один на всю сделку</option>
            </select>
          </label>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_1fr]">
          {/* Сопоставление */}
          <div className="scroll-thin space-y-4 overflow-y-auto border-r border-ink-900/[0.06] px-5 py-4">
            <div className={`rounded-xl px-3 py-2 text-[12px] font-semibold ${allMapped ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {scalarTags.length === 0 ? 'В документе не найдено полей вида {поле}. Откройте «Каталог полей» справа и добавьте их в Word.' : allMapped ? `Все поля сопоставлены автоматически ✓ (${mappedCount}/${scalarTags.length})` : `Сопоставлено ${mappedCount} из ${scalarTags.length}. Проверьте отмеченные поля.`}
            </div>

            {scalarTags.length > 0 && (
              <div>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Поля документа</h3>
                <div className="space-y-1.5">
                  {scalarTags.map((tag) => {
                    const empty = !draft.mapping?.[tag]
                    return (
                      <div key={tag} className={`grid grid-cols-[150px_1fr] items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ${empty ? 'ring-amber-300' : 'ring-ink-900/[0.05]'}`}>
                        <code className="truncate font-mono text-[12px] font-bold text-brand-700">{'{' + tag + '}'}</code>
                        <select value={draft.mapping?.[tag] || ''} onChange={(e) => setMap(tag, e.target.value)} className="w-full rounded-lg bg-canvas px-2 py-1.5 text-[12.5px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                          <option value="">— не заполнять —</option>
                          {DOC_GROUPS.map((g) => (
                            <optgroup key={g} label={g}>
                              {DOC_SCALAR_SOURCES.filter((s) => s.group === g).map((s) => <option key={s.path} value={s.path}>{s.label}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {Object.keys(loops).length > 0 && (
              <div>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Списки (повторяющиеся строки)</h3>
                {Object.entries(loops).map(([loopName, inner]) => (
                  <div key={loopName} className="mb-2 rounded-2xl bg-white p-3 ring-1 ring-ink-900/[0.05]">
                    <div className="mb-2 text-[12px] font-bold text-ink-900"><code className="font-mono text-brand-700">{'{#' + loopName + '}'}</code> — для каждого получателя</div>
                    <div className="space-y-1.5">
                      {inner.map((it) => (
                        <div key={it} className="grid grid-cols-[150px_1fr] items-center gap-2">
                          <code className="truncate font-mono text-[12px] font-bold text-ink-700">{'{' + it + '}'}</code>
                          <select value={draft.loopMapping?.[loopName]?.fields?.[it] || ''} onChange={(e) => setLoopField(loopName, it, e.target.value)} className="w-full rounded-lg bg-canvas px-2 py-1.5 text-[12.5px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                            <option value="">— не заполнять —</option>
                            {benFields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Предпросмотр + каталог */}
          <div className="scroll-thin space-y-3 overflow-y-auto px-5 py-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Предпросмотр</h3>
                <span className="text-[10.5px] font-medium text-ink-400">на примере реальной сделки</span>
              </div>
              <div className="scroll-thin max-h-[300px] overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-[12.5px] leading-relaxed text-ink-800 shadow-soft ring-1 ring-ink-900/[0.05]">{preview}</div>
            </div>

            <div>
              <button onClick={() => setShowCatalog((s) => !s)} className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-[12.5px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06] hover:bg-brand-50 hover:text-brand-700">
                <span>Каталог полей для Word</span>
                <span className="text-ink-300">{showCatalog ? '−' : '+'}</span>
              </button>
              {showCatalog && <div className="mt-2"><FieldCatalog funnelKind={draft.funnelId} /></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
