import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { currentUser } from '../../data/perm.js'
import { dueBucket } from '../../data/model.js'
import TaskComposer from './TaskComposer.jsx'
import TaskItem from './TaskItem.jsx'

const GROUPS = [
  { key: 'overdue', label: 'Просрочено', color: '#f0654a' },
  { key: 'today', label: 'Сегодня', color: '#e08a16' },
  { key: 'tomorrow', label: 'Завтра', color: '#1f47f5' },
  { key: 'later', label: 'Позже', color: '#0ea5a3' },
  { key: 'none', label: 'Без срока', color: '#838ca0' },
]

export default function TasksView() {
  const { state } = useStore()
  const me = currentUser(state)
  const [scope, setScope] = useState('mine')
  const [showDone, setShowDone] = useState(false)

  let tasks = state.tasks
  if (scope === 'mine') tasks = tasks.filter((t) => t.responsibleId === me?.id)
  const open = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)
  const overdueCount = open.filter((t) => dueBucket(t.dueDate) === 'overdue').length

  const sortFn = (a, b) => ((a.dueDate || '9999') + (a.dueTime || '') < (b.dueDate || '9999') + (b.dueTime || '') ? -1 : 1)
  const grouped = GROUPS.map((g) => ({ ...g, items: open.filter((t) => dueBucket(t.dueDate) === g.key).sort(sortFn) })).filter((g) => g.items.length)

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Задачи</h1>
          <p className="text-[11.5px] font-medium text-ink-400">
            Открыто: {open.length}
            {overdueCount > 0 && <span className="text-rose-500"> · просрочено {overdueCount}</span>}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-white p-1 shadow-soft ring-1 ring-ink-900/[0.05]">
          {[['mine', 'Мои'], ['all', 'Все']].map(([id, label]) => (
            <button key={id} onClick={() => setScope(id)} className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${scope === id ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-900/[0.04]'}`}>{label}</button>
          ))}
        </div>
      </header>

      <div className="scroll-thin flex-1 overflow-auto px-7 py-5">
        <div className="mx-auto max-w-3xl space-y-5">
          <TaskComposer />

          {grouped.length === 0 && done.length === 0 && (
            <p className="py-10 text-center text-[13px] text-ink-300">Задач нет. Поставьте первую выше или из карточки сделки.</p>
          )}

          {grouped.map((g) => (
            <div key={g.key}>
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                <h2 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: g.color }}>{g.label}</h2>
                <span className="text-[11px] font-bold text-ink-400">{g.items.length}</span>
              </div>
              <div className="space-y-1.5">
                {g.items.map((t) => <TaskItem key={t.id} task={t} showDeal />)}
              </div>
            </div>
          ))}

          {done.length > 0 && (
            <div>
              <button onClick={() => setShowDone((s) => !s)} className="mb-2 flex items-center gap-2 px-1 text-[12px] font-bold uppercase tracking-wide text-ink-400 hover:text-ink-600">
                Выполненные · {done.length} <span className="text-ink-300">{showDone ? '−' : '+'}</span>
              </button>
              {showDone && <div className="space-y-1.5">{done.sort(sortFn).map((t) => <TaskItem key={t.id} task={t} showDeal />)}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
