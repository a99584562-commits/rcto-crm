import { useStore } from '../../store/StoreContext.jsx'
import { canEdit } from '../../data/perm.js'
import TaskComposer from '../tasks/TaskComposer.jsx'
import TaskItem from '../tasks/TaskItem.jsx'

export default function DealTasks({ deal, funnel }) {
  const { state } = useStore()
  const editable = canEdit(state)
  const tasks = state.tasks.filter((t) => t.dealId === deal.id)
  const open = tasks.filter((t) => !t.done).length
  const sorted = [...tasks].sort((a, b) => (a.done === b.done ? ((a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1) : a.done ? 1 : -1))

  return (
    <div>
      <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Дела{open ? ` · ${open}` : ''}</h3>
      {editable && <TaskComposer dealId={deal.id} funnelId={funnel.id} compact />}
      <div className="mt-2 space-y-1.5">
        {sorted.length === 0 && <p className="px-1 text-[12px] text-ink-300">Дел пока нет{editable ? ' — поставьте первое выше.' : '.'}</p>}
        {sorted.map((t) => <TaskItem key={t.id} task={t} />)}
      </div>
    </div>
  )
}
