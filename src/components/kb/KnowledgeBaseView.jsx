import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { canEdit } from '../../data/perm.js'
import { KB_CATEGORIES } from '../../data/seed.js'
import { uid } from '../../data/model.js'
import ImageDrop from './ImageDrop.jsx'
import { IconSearch, IconBook, IconClose, IconCheck } from '../Icons.jsx'

export default function KnowledgeBaseView() {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const [q, setQ] = useState('')
  const [selId, setSelId] = useState(state.kb[0]?.id || null)
  const [editing, setEditing] = useState(false)

  const article = state.kb.find((a) => a.id === selId) || null
  const matches = (a) => !q.trim() || [a.title, a.intro, ...a.steps.map((s) => s.text)].join(' ').toLowerCase().includes(q.toLowerCase())
  const filtered = state.kb.filter(matches)
  const cats = [...KB_CATEGORIES, ...new Set(state.kb.map((a) => a.category).filter((c) => !KB_CATEGORIES.includes(c)))]
  const groups = cats.map((c) => ({ c, items: filtered.filter((a) => a.category === c) })).filter((g) => g.items.length)

  function addArticle() {
    const id = uid('kb')
    actions.kb.add({ id, category: KB_CATEGORIES[1], emoji: '📄', title: 'Новая статья', intro: '', steps: [{ id: uid('s'), text: '', image: null }], updatedAt: '' })
    setSelId(id)
    setEditing(true)
  }
  const upd = (patch) => actions.kb.update(article.id, patch)
  const setStep = (i, patch) => upd({ steps: article.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })
  const addStep = () => upd({ steps: [...article.steps, { id: uid('s'), text: '', image: null }] })
  const removeStep = (i) => upd({ steps: article.steps.filter((_, idx) => idx !== i) })
  const moveStep = (i, dir) => {
    const steps = [...article.steps]
    const j = i + dir
    if (j < 0 || j >= steps.length) return
    ;[steps[i], steps[j]] = [steps[j], steps[i]]
    upd({ steps })
  }
  function delArticle() {
    if (!confirm('Удалить статью?')) return
    actions.kb.remove(article.id)
    setEditing(false)
    setSelId(state.kb.find((a) => a.id !== article.id)?.id || null)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">База знаний</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Как работать с CRM · {state.kb.length} статей</p>
        </div>
        {editable && <button onClick={addArticle} className="ml-auto rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-[0.98]">+ Статья</button>}
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[320px_1fr]">
        {/* Список статей */}
        <div className="scroll-thin flex flex-col gap-1 overflow-y-auto border-r border-ink-900/[0.06] p-3">
          <div className="relative mb-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по базе…" className="w-full rounded-full bg-white py-2 pl-9 pr-3 text-[13px] font-medium text-ink-900 shadow-soft outline-none ring-1 ring-ink-900/[0.05] focus:ring-2 focus:ring-brand-500" />
          </div>
          {groups.length === 0 && <p className="px-2 py-6 text-center text-[12px] text-ink-300">Ничего не найдено</p>}
          {groups.map((g) => (
            <div key={g.c} className="mb-1">
              <div className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-ink-400">{g.c}</div>
              {g.items.map((a) => {
                const active = a.id === selId
                return (
                  <button key={a.id} onClick={() => { setSelId(a.id); setEditing(false) }} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${active ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-900/[0.04]'}`}>
                    <span className="text-[16px]">{a.emoji || '📄'}</span>
                    <span className="truncate text-[13px] font-bold">{a.title}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Статья */}
        <div className="scroll-thin overflow-y-auto px-8 py-7">
          {!article ? (
            <div className="grid h-full place-items-center text-center text-ink-300">
              <div><span className="block text-[28px]">📖</span><p className="mt-2 text-[13px]">Выберите статью слева{editable ? ' или создайте новую' : ''}</p></div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              {/* Шапка статьи */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input value={article.emoji} onChange={(e) => upd({ emoji: e.target.value })} className="w-14 rounded-xl bg-white px-2 py-2 text-center text-[18px] outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
                        <input value={article.title} onChange={(e) => upd({ title: e.target.value })} className="flex-1 rounded-xl bg-white px-3 py-2 text-[18px] font-extrabold tracking-tight text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
                      </div>
                      <select value={article.category} onChange={(e) => upd({ category: e.target.value })} className="rounded-xl bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink-700 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                        {KB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  ) : (
                    <>
                      <span className="inline-block rounded-full bg-ink-900/[0.05] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-400">{article.category}</span>
                      <h2 className="mt-2 flex items-center gap-2.5 text-[24px] font-extrabold tracking-tight text-ink-900"><span>{article.emoji}</span>{article.title}</h2>
                    </>
                  )}
                </div>
                {editable && (
                  <div className="flex shrink-0 items-center gap-2">
                    {editing && <button onClick={delArticle} className="grid h-9 w-9 place-items-center rounded-full text-ink-400 hover:bg-rose-50 hover:text-rose-500" title="Удалить статью"><IconClose className="text-[17px]" /></button>}
                    <button onClick={() => setEditing((e) => !e)} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-all active:scale-95 ${editing ? 'bg-brand-600 text-white shadow-glow hover:bg-brand-700' : 'bg-white text-ink-700 shadow-soft ring-1 ring-ink-900/[0.06] hover:ring-brand-500/40'}`}>
                      {editing ? <><IconCheck className="text-[15px]" /> Готово</> : 'Изменить'}
                    </button>
                  </div>
                )}
              </div>

              {/* Вступление */}
              {editing ? (
                <textarea value={article.intro} onChange={(e) => upd({ intro: e.target.value })} rows={2} placeholder="Краткое описание…" className="mb-5 w-full resize-none rounded-xl bg-white px-3 py-2 text-[14px] leading-relaxed text-ink-700 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
              ) : (
                article.intro && <p className="mb-6 text-[14.5px] leading-relaxed text-ink-500">{article.intro}</p>
              )}

              {/* Шаги */}
              <div className="space-y-3">
                {article.steps.map((s, i) => (
                  <div key={s.id} className="flex gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-[12px] font-bold text-white">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      {editing ? (
                        <div className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-900/[0.05]">
                          <div className="flex items-start gap-2">
                            <textarea value={s.text} onChange={(e) => setStep(i, { text: e.target.value })} rows={2} placeholder="Что сделать на этом шаге…" className="flex-1 resize-none rounded-lg bg-canvas px-3 py-2 text-[13.5px] leading-relaxed text-ink-800 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
                            <div className="flex flex-col gap-1">
                              <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="grid h-6 w-6 place-items-center rounded-md text-ink-400 hover:bg-ink-900/[0.05] disabled:opacity-30">↑</button>
                              <button onClick={() => moveStep(i, 1)} disabled={i === article.steps.length - 1} className="grid h-6 w-6 place-items-center rounded-md text-ink-400 hover:bg-ink-900/[0.05] disabled:opacity-30">↓</button>
                              <button onClick={() => removeStep(i)} className="grid h-6 w-6 place-items-center rounded-md text-ink-300 hover:bg-rose-50 hover:text-rose-500"><IconClose className="text-[13px]" /></button>
                            </div>
                          </div>
                          <ImageDrop src={s.image} editable onChange={(img) => setStep(i, { image: img })} />
                        </div>
                      ) : (
                        <div className="pt-0.5">
                          <p className="text-[14.5px] leading-relaxed text-ink-800">{s.text}</p>
                          <ImageDrop src={s.image} editable={false} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {editing && (
                <button onClick={addStep} className="mt-3 w-full rounded-xl border border-dashed border-ink-900/15 py-2.5 text-[13px] font-bold text-ink-500 transition-colors hover:border-brand-500/50 hover:bg-brand-50/40 hover:text-brand-700">+ Шаг</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
