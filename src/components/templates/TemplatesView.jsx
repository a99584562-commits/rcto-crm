import { useRef, useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { FUNNELS } from '../../data/seed.js'
import { uid } from '../../data/model.js'
import { detectTags, downloadSampleTemplate } from '../../docs/docxEngine.js'
import TemplateEditor, { guessScalar, guessBenField } from './TemplateEditor.jsx'
import { IconBolt, IconClose, IconDoc, IconCheck } from '../Icons.jsx'

const funnelName = (id) => FUNNELS.find((f) => f.id === id)?.name || id

export default function TemplatesView() {
  const { state, actions } = useStore()
  const fileRef = useRef(null)
  const [editing, setEditing] = useState(null)
  const [err, setErr] = useState('')

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr('')
    try {
      const buf = await file.arrayBuffer()
      const { tags, loops, base64 } = await detectTags(buf)
      const funnelKind = 'fiz'
      const mapping = {}
      tags.forEach((t) => (mapping[t] = guessScalar(t)))
      const loopMapping = {}
      Object.entries(loops).forEach(([ln, inner]) => {
        loopMapping[ln] = { source: 'beneficiaries', fields: {} }
        inner.forEach((it) => (loopMapping[ln].fields[it] = guessBenField(it, funnelKind)))
      })
      const tpl = {
        id: uid('tpl'),
        name: file.name.replace(/\.docx$/i, ''),
        funnelId: funnelKind,
        entity: 'member',
        fileName: file.name,
        fileBase64: base64,
        builtIn: false,
        tags,
        loops,
        mapping,
        loopMapping,
      }
      actions.templates.add(tpl)
      setEditing(tpl)
    } catch (e2) {
      setErr('Не удалось прочитать .docx: ' + (e2?.message || e2))
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Шаблоны документов</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Загрузите свой Word с тегами {'{поле}'} и сопоставьте поля</p>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <button onClick={downloadSampleTemplate} className="rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink-700 shadow-soft ring-1 ring-ink-900/[0.06] transition-all hover:ring-brand-500/40 active:scale-[0.98]">↓ Пример шаблона</button>
          <button onClick={() => fileRef.current?.click()} className="rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-[0.98]">+ Загрузить .docx</button>
          <input ref={fileRef} type="file" accept=".docx" className="hidden" onChange={onFile} />
        </div>
      </header>

      <div className="scroll-thin flex-1 overflow-auto px-7 py-5">
        {err && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-600">{err}</p>}

        <div className="mb-5 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-[12.5px] font-medium leading-relaxed text-brand-800">
          <b>Как это работает:</b> в своём Word-шаблоне напишите теги в фигурных скобках — например <code className="font-mono">{'{номер_договора}'}</code>, <code className="font-mono">{'{наше_юл}'}</code>. Для списка детей оберните строку в цикл <code className="font-mono">{'{#дети}…{/дети}'}</code>. Загрузите файл — система найдёт теги, и вы сопоставите каждый с полем. Нажмите «Пример шаблона», чтобы скачать готовый образец.
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.templates.map((t) => (
            <div key={t.id} className="flex flex-col rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-900/[0.05]">
              <div className="flex items-start gap-2.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600"><IconDoc className="text-[19px]" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[14px] font-bold text-ink-900">{t.name}</h3>
                  <p className="text-[11px] font-medium text-ink-400">{funnelName(t.funnelId)} · {t.entity === 'member' ? 'по участнику' : 'по сделке'}</p>
                </div>
                {t.builtIn && <span className="rounded-full bg-ink-900/[0.05] px-2 py-0.5 text-[9.5px] font-bold uppercase text-ink-400">пример</span>}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold text-brand-600">{(t.tags || []).length} тегов</span>
                {Object.keys(t.loops || {}).length > 0 && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10.5px] font-semibold text-violet-600">{Object.keys(t.loops).length} список</span>}
                {(() => {
                  const total = (t.tags || []).length
                  const mapped = (t.tags || []).filter((tag) => t.mapping?.[tag]).length
                  const full = mapped === total
                  return (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${full ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {full && <IconCheck className="text-[11px]" />}{mapped}/{total} сопоставлено
                    </span>
                  )
                })()}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setEditing(t)} className="flex-1 rounded-xl bg-ink-900/[0.03] py-2 text-[12.5px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06] transition-all hover:bg-brand-50 hover:text-brand-700">Настроить</button>
                <button onClick={() => { if (confirm('Удалить шаблон?')) actions.templates.remove(t.id) }} className="grid h-9 w-9 place-items-center rounded-xl text-ink-300 transition-colors hover:bg-rose-50 hover:text-rose-500"><IconClose className="text-[16px]" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && <TemplateEditor template={state.templates.find((t) => t.id === editing.id) || editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
