import { useStore } from '../../store/StoreContext.jsx'
import { uid } from '../../data/model.js'
import { ROLES, ROLE_LABELS, ROLE_COLORS, ROLE_HINT, canManageUsers } from '../../data/perm.js'
import EditableField from '../common/EditableField.jsx'
import { IconClose, IconCheck } from '../Icons.jsx'

const PALETTE = ['#1f47f5', '#0ea5a3', '#e08a16', '#d9488a', '#7c5cff', '#10b3c6', '#84cc16']

function RoleSelect({ value, onChange }) {
  const color = ROLE_COLORS[value] || '#838ca0'
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="cursor-pointer rounded-full border-none px-2.5 py-1 text-[11.5px] font-bold outline-none" style={{ color, backgroundColor: color + '18' }}>
      {ROLES.map((r) => (<option key={r} value={r} style={{ color: '#0d1326' }}>{ROLE_LABELS[r]}</option>))}
    </select>
  )
}

export default function UsersView() {
  const { state, actions } = useStore()
  const admin = canManageUsers(state)

  function addUser() {
    const i = state.users.length
    actions.users.add({ id: uid('u'), name: 'Новый сотрудник', initials: 'НС', color: PALETTE[i % PALETTE.length], role: 'manager', email: '', online: false })
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Пользователи</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Сотрудники и права доступа · {state.users.length}</p>
        </div>
        {admin && <button onClick={addUser} className="ml-auto rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-[0.98]">+ Добавить</button>}
      </header>

      <div className="scroll-thin flex-1 overflow-auto px-7 py-5">
        {/* Памятка по ролям */}
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r} className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-900/[0.05]">
              <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ color: ROLE_COLORS[r], backgroundColor: ROLE_COLORS[r] + '18' }}>{ROLE_LABELS[r]}</span>
              <p className="mt-1.5 text-[11.5px] leading-snug text-ink-500">{ROLE_HINT[r]}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/[0.05]">
          <div className="grid items-center gap-2 border-b border-ink-900/[0.06] bg-canvas/60 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-400" style={{ gridTemplateColumns: '2fr 1.6fr 1.2fr 1.4fr 40px' }}>
            <div className="px-1">Сотрудник</div><div className="px-1">E-mail</div><div className="px-1">Роль</div><div className="px-1">Доступ</div><div />
          </div>
          {state.users.map((u) => {
            const isCurrent = u.id === state.currentUserId
            return (
              <div key={u.id} className="grid items-center gap-2 border-b border-ink-900/[0.04] px-3 py-2 hover:bg-canvas/50" style={{ gridTemplateColumns: '2fr 1.6fr 1.2fr 1.4fr 40px' }}>
                <div className="flex items-center gap-2.5 px-1">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: u.color }}>{u.initials}</span>
                  <div className="min-w-0">
                    <EditableField value={u.name} onChange={(v) => actions.users.update(u.id, { name: v })} compact />
                    {isCurrent && <span className="ml-1 inline-block rounded-full bg-brand-50 px-1.5 text-[9.5px] font-bold uppercase text-brand-600">вы</span>}
                  </div>
                </div>
                <EditableField value={u.email} onChange={(v) => actions.users.update(u.id, { email: v })} compact placeholder="—" />
                {admin ? <RoleSelect value={u.role} onChange={(v) => actions.users.update(u.id, { role: v })} /> : <span className="px-2 text-[12px] font-semibold" style={{ color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</span>}
                <div className="px-1">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-emerald-600"><IconCheck className="text-[14px]" /> Текущий</span>
                  ) : (
                    <button onClick={() => actions.setCurrentUser(u.id)} className="rounded-lg bg-ink-900/[0.04] px-2.5 py-1 text-[11px] font-bold text-ink-600 hover:bg-brand-50 hover:text-brand-700">Войти как</button>
                  )}
                </div>
                {admin && !isCurrent ? <button onClick={() => actions.users.remove(u.id)} className="grid h-7 w-7 place-items-center rounded-lg text-ink-300 hover:bg-rose-50 hover:text-rose-500"><IconClose className="text-[15px]" /></button> : <span />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
