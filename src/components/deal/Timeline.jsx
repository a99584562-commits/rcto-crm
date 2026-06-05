import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { canEdit, currentUser } from '../../data/perm.js'
import { formatWhen } from '../../data/model.js'
import { IconBolt, IconArrow, IconUser, IconCheck, IconDoc, IconPhone, IconClock } from '../Icons.jsx'

const TYPE_META = {
  created: { icon: IconBolt, color: '#1f47f5' },
  stage: { icon: IconArrow, color: '#10b3c6' },
  edit: { icon: IconClock, color: '#5b6479' },
  member: { icon: IconUser, color: '#7c5cff' },
  status: { icon: IconCheck, color: '#e08a16' },
  doc: { icon: IconDoc, color: '#1f47f5' },
  call: { icon: IconPhone, color: '#84cc16' },
  onec: { icon: IconDoc, color: '#0ea5a3' },
}

function Avatar({ user, size = 28 }) {
  if (!user) return null
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-bold text-white ring-2 ring-white" style={{ width: size, height: size, backgroundColor: user.color, fontSize: size * 0.36 }} title={user.name}>
      {user.initials}
    </span>
  )
}

export default function Timeline({ deal, funnel }) {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const me = currentUser(state)
  const [text, setText] = useState('')
  const events = state.events.filter((e) => e.dealId === deal.id)
  const userById = (id) => state.users.find((u) => u.id === id)

  function submit() {
    const t = text.trim()
    if (!t) return
    actions.addComment(deal.id, funnel.id, t)
    setText('')
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="flex items-center gap-2 border-b border-ink-900/[0.06] px-4 py-3">
        <h3 className="text-[13px] font-extrabold tracking-tight text-ink-900">Лента и комментарии</h3>
        <span className="rounded-full bg-ink-900/[0.05] px-1.5 text-[10.5px] font-bold text-ink-400">{events.length}</span>
      </div>

      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {events.length === 0 && <p className="py-8 text-center text-[12px] text-ink-300">Событий пока нет</p>}
        {events.map((e) => {
          const u = userById(e.userId)
          if (e.type === 'comment') {
            return (
              <div key={e.id} className="flex gap-2.5 animate-fade-up">
                <Avatar user={u} />
                <div className="min-w-0 flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-white p-3 shadow-soft ring-1 ring-ink-900/[0.04]">
                    <p className="text-[12.5px] leading-snug text-ink-800">{e.text}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 pl-1 text-[10.5px] text-ink-400">
                    <span className="font-semibold text-ink-500">{u?.name || '—'}</span>· {formatWhen(e.at)}
                  </div>
                </div>
              </div>
            )
          }
          const m = TYPE_META[e.type] || TYPE_META.edit
          const Icon = m.icon
          return (
            <div key={e.id} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ backgroundColor: m.color + '16', color: m.color }}>
                <Icon className="text-[14px]" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[12px] font-medium leading-snug text-ink-700">{e.text}</p>
                <p className="text-[10.5px] text-ink-400">{u?.name || '—'} · {formatWhen(e.at)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {editable ? (
        <div className="border-t border-ink-900/[0.06] bg-white p-3">
          <div className="flex items-end gap-2">
            <Avatar user={me} size={28} />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
              rows={2}
              placeholder="Написать комментарий…  (Ctrl+Enter)"
              className="flex-1 resize-none rounded-xl bg-canvas px-3 py-2 text-[12.5px] font-medium text-ink-900 outline-none ring-1 ring-ink-900/[0.06] transition-shadow placeholder:text-ink-300 focus:ring-2 focus:ring-brand-500"
            />
            <button onClick={submit} disabled={!text.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-glow transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-40">
              <IconArrow className="text-[16px]" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-ink-900/[0.06] bg-white px-4 py-3 text-center text-[11.5px] font-medium text-ink-400">Просмотр — комментарии недоступны</div>
      )}
    </div>
  )
}
