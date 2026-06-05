import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { FUNNELS } from '../../data/seed.js'
import { buildAutoMapping } from '../../data/schema.js'
import { uid, getMembers } from '../../data/model.js'
import { buildDocxBase64FromText, parseTextTags, renderToText, buildData } from '../../docs/docxEngine.js'
import FieldCatalog from './FieldCatalog.jsx'
import { IconClose, IconCheck, IconDoc } from '../Icons.jsx'

const DEFAULT_BODY = `ДОГОВОР № {номер_договора}
г. Ижевск                                        {дата}

{наше_юл} (Исполнитель) и {фио_родителя} (Заказчик)
заключили настоящий договор о реализации путёвок.
Телефон заказчика: {телефон_родителя}

Список детей:
{#дети}
  •  {фио}, {дата_рождения}, лагерь «{лагерь}», {смена}
{/дети}

Общая сумма по договору: {сумма}
Исполнитель: {наше_юл}, ИНН {наш_инн}`

export default function TemplateBuilder({ onClose }) {
  const { state, actions } = useStore()
  const [name, setName] = useState('Новый документ')
  const [funnelId, setFunnelId] = useState('fiz')
  const [entity, setEntity] = useState('member')
  const [body, setBody] = useState(DEFAULT_BODY)
  const [tab, setTab] = useState('edit')
  const taRef = useRef(null)
  const caret = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  useEffect(() => {
    if (caret.current != null && taRef.current) {
      taRef.current.focus()
      taRef.current.setSelectionRange(caret.current, caret.current)
      caret.current = null
    }
  }, [body])

  function insert(snippet) {
    if (tab !== 'edit') setTab('edit')
    const ta = taRef.current
    const start = ta ? ta.selectionStart : body.length
    const end = ta ? ta.selectionEnd : body.length
    const next = body.slice(0, start) + snippet + body.slice(end)
    caret.current = start + snippet.length
    setBody(next)
  }

  const preview = useMemo(() => {
    if (tab !== 'preview') return ''
    const { tags, loops } = parseTextTags(body)
    const { mapping, loopMapping } = buildAutoMapping(tags, loops, funnelId)
    const tpl = { funnelId, entity, fileBase64: buildDocxBase64FromText(body), mapping, loopMapping, tags, loops }
    const deals = state.deals[funnelId] || []
    const deal = deals.find((d) => getMembers(d).length) || deals[0]
    if (!deal) return 'Нет сделки для предпросмотра.'
    const member = entity === 'member' ? getMembers(deal)[0] : null
    const stage = FUNNELS.find((f) => f.id === funnelId)?.stages.find((s) => s.id === deal.stageId)
    return renderToText(tpl, buildData(tpl, deal, member, { ...state, stageName: stage?.name || '' }))
  }, [tab, body, funnelId, entity, state])

  function save() {
    const { tags, loops } = parseTextTags(body)
    const { mapping, loopMapping } = buildAutoMapping(tags, loops, funnelId)
    actions.templates.add({
      id: uid('tpl'), name: name.trim() || 'Документ', funnelId, entity,
      fileName: (name.trim() || 'dokument') + '.docx',
      fileBase64: buildDocxBase64FromText(body), builtIn: false, source: 'builder',
      tags, loops, mapping, loopMapping,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative flex h-[90vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-4xl bg-canvas shadow-lift animate-scale-in">
        <header className="flex items-center gap-3 bg-white px-6 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600"><IconDoc className="text-[19px]" /></span>
          <div className="flex-1">
            <h2 className="text-[17px] font-extrabold tracking-tight text-ink-900">Конструктор документа</h2>
            <p className="text-[12px] font-medium text-ink-400">Пишите текст и вставляйте поля — Word не нужен</p>
          </div>
          <button onClick={save} className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-95"><IconCheck className="text-[15px]" /> Сохранить</button>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-900/[0.06]"><IconClose className="text-[18px]" /></button>
        </header>

        <div className="grid grid-cols-3 gap-2 border-b border-ink-900/[0.06] bg-white px-6 pb-4">
          <label className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Название
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold normal-case tracking-normal text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
          </label>
          <label className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Воронка
            <select value={funnelId} onChange={(e) => setFunnelId(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold normal-case tracking-normal text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
              {FUNNELS.filter((f) => f.kind !== 'leads').map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </label>
          <label className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Для кого
            <select value={entity} onChange={(e) => setEntity(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold normal-case tracking-normal text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
              <option value="member">Свой документ для каждого участника</option>
              <option value="deal">Один на всю сделку</option>
            </select>
          </label>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px]">
          {/* Текст / предпросмотр */}
          <div className="flex min-h-0 flex-col border-r border-ink-900/[0.06]">
            <div className="flex gap-1 px-4 pt-3">
              {[['edit', 'Текст'], ['preview', 'Предпросмотр']].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-colors ${tab === id ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-900/[0.05]'}`}>{label}</button>
              ))}
            </div>
            {tab === 'edit' ? (
              <textarea
                ref={taRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck={false}
                className="scroll-thin m-4 mt-3 flex-1 resize-none rounded-2xl bg-white p-4 font-mono text-[12.5px] leading-relaxed text-ink-800 shadow-soft outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500"
              />
            ) : (
              <div className="scroll-thin m-4 mt-3 flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-5 text-[13px] leading-relaxed text-ink-800 shadow-soft ring-1 ring-ink-900/[0.06]">
                {preview}
              </div>
            )}
          </div>

          {/* Каталог полей */}
          <div className="scroll-thin overflow-y-auto p-4">
            <FieldCatalog funnelKind={funnelId} onInsert={insert} />
          </div>
        </div>
      </div>
    </div>
  )
}
