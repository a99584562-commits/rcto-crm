import { useStore } from '../../store/StoreContext.jsx'
import { canEdit } from '../../data/perm.js'
import { taskTagColor } from '../../data/seed.js'
import { dueBucket, formatDue } from '../../data/model.js'
import { IconClose, IconCheck } from '../Icons.jsx'

const DUE_COLOR = { overdue: '#f0654a', today: '#e08a16', tomorrow: '#1f47f5', later: '#5b6479', none: '#aab2c4' }

function Avatar({ user }) {
  if (!user) return null
  return <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: user.color }} title={user.name}>{user.initials}</span>
}

export default function TaskItem({ task, showDeal }) {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const color = taskTagColor(task.tag)
  const user = state.users.find((u) => u.id === task.responsibleId)
  const deal = showDeal && task.dealId ? (state.deals[task.funnelId] || []).find((d) => d.id === task.dealId) : null
  const bucket = dueBucket(task.dueDate)

  return (
    <div className={`flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 ring-1 ring-ink-900/[0.05] transition-opacity ${task.done ? 'opacity-55' : ''}`}>
      <button
        onClick={() => editable && actions.toggleTask(task.id)}
        disabled={!editable}
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${task.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-ink-300 text-transparent hover:border-brand-500'}`}
        title={task.done ? 'Выполнено' : 'Отметить выполненным'}
      >
        <IconCheck className="text-[12px]" />
      </button>

      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={{ color, backgroundColor: color + '18' }}>{task.tag}</span>

      <div className="min-w-0 flex-1">
        <div className={`truncate text-[13px] font-semibold text-ink-900 ${task.done ? 'line-through' : ''}`}>{task.title}</div>
        {showDeal && deal && <div className="truncate text-[11px] text-ink-400">{deal.id} · {deal.title}</div>}
      </div>

      {task.dueDate && (
        <span className="shrink-0 text-[11.5px] font-bold" style={{ color: task.done ? '#aab2c4' : DUE_COLOR[bucket] }}>{formatDue(task.dueDate, task.dueTime)}</span>
      )}
      <Avatar user={user} />
      {editable && (
        <button onClick={() => actions.tasks.remove(task.id)} className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-ink-300 hover:bg-rose-50 hover:text-rose-500" title="Удалить"><IconClose className="text-[13px]" /></button>
      )}
    </div>
  )
}
