import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { currentUser } from '../../data/perm.js'
import { TASK_TAGS } from '../../data/seed.js'
import { uid, todayISO } from '../../data/model.js'

// Компактная постановка дела. dealId/funnelId — если ставим из сделки.
export default function TaskComposer({ dealId, funnelId, compact }) {
  const { state, actions } = useStore()
  const me = currentUser(state)
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('Звонок')
  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState('')
  const [resp, setResp] = useState(me?.id || '')

  function add() {
    const t = title.trim()
    if (!t) return
    actions.addTask({ id: uid('tk'), dealId: dealId || null, funnelId: funnelId || null, title: t, tag, dueDate: date || '', dueTime: time || '', responsibleId: resp, done: false })
    setTitle('')
    setTime('')
  }

  return (
    <div className="rounded-2xl bg-white p-2.5 shadow-soft ring-1 ring-ink-900/[0.05]">
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Что нужно сделать?"
          className="flex-1 rounded-lg bg-canvas px-3 py-2 text-[13px] font-medium text-ink-900 outline-none ring-1 ring-ink-900/[0.06] placeholder:text-ink-300 focus:ring-2 focus:ring-brand-500"
        />
        <button onClick={add} disabled={!title.trim()} className="shrink-0 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-40">Поставить</button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <div className="flex flex-wrap gap-1">
          {TASK_TAGS.map((t) => {
            const active = tag === t.id
            return (
              <button key={t.id} onClick={() => setTag(t.id)} className="rounded-full px-2 py-0.5 text-[11px] font-bold transition-all active:scale-95" style={{ color: active ? '#fff' : t.color, backgroundColor: active ? t.color : t.color + '18' }}>{t.id}</button>
            )
          })}
        </div>
        <span className="mx-0.5 h-4 w-px bg-ink-900/10" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg bg-canvas px-2 py-1 text-[12px] font-semibold text-ink-700 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-lg bg-canvas px-2 py-1 text-[12px] font-semibold text-ink-700 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500" />
        {!compact && (
          <select value={resp} onChange={(e) => setResp(e.target.value)} className="rounded-lg bg-canvas px-2 py-1 text-[12px] font-semibold text-ink-700 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
            {state.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}
