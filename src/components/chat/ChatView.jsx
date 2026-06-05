import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { currentUser } from '../../data/perm.js'
import { uid, formatWhen } from '../../data/model.js'
import { IconArrow, IconUser, IconInbox } from '../Icons.jsx'

function Avatar({ user, size = 32 }) {
  if (!user) return null
  return <span className="grid shrink-0 place-items-center rounded-full font-bold text-white" style={{ width: size, height: size, backgroundColor: user.color, fontSize: size * 0.36 }}>{user.initials}</span>
}

export default function ChatView() {
  const { state, actions } = useStore()
  const me = currentUser(state)
  const [activeId, setActiveId] = useState(state.chats[0]?.id || null)
  const [text, setText] = useState('')
  const [picker, setPicker] = useState(false)
  const scrollRef = useRef(null)
  const chat = state.chats.find((c) => c.id === activeId) || state.chats[0]
  const userById = (id) => state.users.find((u) => u.id === id)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat?.messages.length, activeId])

  function send() {
    const t = text.trim()
    if (!t || !chat) return
    actions.sendMessage(chat.id, t)
    setText('')
  }
  function addChannel() {
    const name = prompt('Название канала:')
    if (!name) return
    const id = uid('ch')
    actions.addChat({ id, type: 'channel', name, memberIds: state.users.map((u) => u.id), messages: [] })
    setActiveId(id)
    setPicker(false)
  }
  function openDM(u) {
    setPicker(false)
    const existing = state.chats.find((c) => c.type === 'direct' && c.memberIds.length === 2 && c.memberIds.includes(me.id) && c.memberIds.includes(u.id))
    if (existing) { setActiveId(existing.id); return }
    const id = uid('ch')
    actions.addChat({ id, type: 'direct', name: u.name, memberIds: [me.id, u.id], messages: [] })
    setActiveId(id)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Чаты</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Командная переписка · {state.chats.length}</p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr]">
        {/* Список чатов */}
        <div className="scroll-thin relative flex flex-col gap-1 overflow-y-auto border-r border-ink-900/[0.06] p-3">
          <button onClick={() => setPicker((p) => !p)} className="mb-1 rounded-xl bg-brand-600 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-[0.98]">+ Написать сотруднику</button>

          {picker && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPicker(false)} />
              <div className="absolute left-3 right-3 top-[52px] z-20 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-ink-900/[0.08] animate-fade-up">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-ink-400">Выберите сотрудника</div>
                <div className="max-h-[320px] overflow-y-auto scroll-thin">
                  {state.users.filter((u) => u.id !== me?.id).map((u) => (
                    <button key={u.id} onClick={() => openDM(u)} className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-canvas">
                      <span className="relative">
                        <span className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: u.color }}>{u.initials}</span>
                        {u.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink-900">{u.name}</span>
                    </button>
                  ))}
                </div>
                <button onClick={addChannel} className="flex w-full items-center gap-2 border-t border-ink-900/[0.06] px-3 py-2.5 text-[12.5px] font-bold text-brand-600 hover:bg-brand-50">+ Создать канал</button>
              </div>
            </>
          )}
          {state.chats.map((c) => {
            const active = c.id === chat?.id
            const last = c.messages[c.messages.length - 1]
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-all duration-300 ease-spring active:scale-[0.98] ${active ? 'bg-white shadow-soft ring-1 ring-brand-500/30' : 'hover:bg-white/70'}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[16px] ${active ? 'bg-brand-600 text-white' : 'bg-ink-900/[0.04] text-ink-400'}`}>{c.type === 'channel' ? <IconInbox /> : <IconUser />}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-ink-900">{c.type === 'channel' ? '# ' : ''}{c.name}</span>
                  <span className="block truncate text-[11px] text-ink-400">{last ? last.text : 'нет сообщений'}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Тред */}
        <div className="flex min-h-0 flex-col bg-canvas">
          {chat && (
            <>
              <div className="flex items-center gap-2 border-b border-ink-900/[0.06] bg-white px-5 py-3">
                <h2 className="text-[14px] font-extrabold tracking-tight text-ink-900">{chat.type === 'channel' ? '# ' : ''}{chat.name}</h2>
                <span className="text-[11px] font-medium text-ink-400">· {chat.memberIds.length} участн.</span>
              </div>

              <div ref={scrollRef} className="scroll-thin flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {chat.messages.map((m) => {
                  const u = userById(m.userId)
                  const mine = m.userId === me?.id
                  return (
                    <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                      {!mine && <Avatar user={u} size={30} />}
                      <div className={`max-w-[70%] ${mine ? 'items-end' : ''}`}>
                        {!mine && <div className="mb-0.5 pl-1 text-[10.5px] font-semibold text-ink-400">{u?.name}</div>}
                        <div className={`rounded-2xl px-3.5 py-2 text-[12.5px] leading-snug shadow-soft ${mine ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm bg-white text-ink-800 ring-1 ring-ink-900/[0.04]'}`}>{m.text}</div>
                        <div className={`mt-0.5 text-[10px] text-ink-400 ${mine ? 'text-right pr-1' : 'pl-1'}`}>{formatWhen(m.at)}</div>
                      </div>
                    </div>
                  )
                })}
                {chat.messages.length === 0 && <p className="py-10 text-center text-[12px] text-ink-300">Сообщений пока нет</p>}
              </div>

              <div className="border-t border-ink-900/[0.06] bg-white p-3">
                <div className="flex items-end gap-2">
                  <Avatar user={me} size={32} />
                  <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} placeholder="Сообщение…  (Enter — отправить)" className="flex-1 resize-none rounded-xl bg-canvas px-3 py-2.5 text-[12.5px] font-medium text-ink-900 outline-none ring-1 ring-ink-900/[0.06] transition-shadow placeholder:text-ink-300 focus:ring-2 focus:ring-brand-500" />
                  <button onClick={send} disabled={!text.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-glow transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-40"><IconArrow className="text-[17px]" /></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
