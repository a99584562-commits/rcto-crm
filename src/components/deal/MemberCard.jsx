import { useState } from 'react'
import { FUNNEL_CONFIG, SIGN_STATUSES, SIGN_STATUS_COLOR } from '../../data/schema.js'
import { memberContacts, byId } from '../../data/model.js'
import { uid } from '../../data/model.js'
import { formatMoney } from '../../data/seed.js'
import { useStore } from '../../store/StoreContext.jsx'
import { canEdit } from '../../data/perm.js'
import EditableField from '../common/EditableField.jsx'
import { FieldBox } from '../common/SchemaField.jsx'
import BeneficiaryEditor from './BeneficiaryEditor.jsx'
import { IconClose, IconDoc, IconPhone, IconUser } from '../Icons.jsx'

function StatusSelect({ value, onChange, disabled }) {
  const color = SIGN_STATUS_COLOR[value] || '#aab2c4'
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border-none px-2.5 py-1 text-[11px] font-bold outline-none ring-1 ring-inset transition-shadow focus:ring-2 disabled:cursor-default"
      style={{ color, backgroundColor: color + '18', boxShadow: `inset 0 0 0 1px ${color}33` }}
      title="Статус договора"
    >
      {SIGN_STATUSES.map((s) => (
        <option key={s} value={s} style={{ color: '#0d1326' }}>
          {s}
        </option>
      ))}
    </select>
  )
}

export default function MemberCard({ funnel, deal, member, onGenerate }) {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const cfg = FUNNEL_CONFIG[funnel.kind] || {}
  const contacts = memberContacts(member, state.contacts)
  const [adding, setAdding] = useState(false)

  const upd = (patch) => actions.updateMember(funnel.id, deal.id, member.id, patch)
  const linkedIds = new Set(member.contactIds || [])
  const available = state.contacts.filter((c) => !linkedIds.has(c.id))

  function linkContact(id) {
    upd({ contactIds: [...(member.contactIds || []), id] })
    setAdding(false)
  }
  function createContact() {
    const id = uid('ct')
    actions.contacts.add({ id, fullName: 'Новый контакт', role: cfg.contactRoles?.[0] || 'Контакт', phone: '', email: '' })
    linkContact(id)
  }
  function unlink(id) {
    upd({ contactIds: (member.contactIds || []).filter((x) => x !== id) })
  }

  function addBeneficiary() {
    actions.addBeneficiary(funnel.id, deal.id, member.id, { id: uid('b'), fullName: '', campId: null, shiftId: null })
  }

  const payPct = member.amount > 0 ? Math.min(100, Math.round(((member.paid || 0) / member.amount) * 100)) : 0

  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-ink-900/[0.05]">
      {/* Шапка участника */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <EditableField value={member.label} onChange={(v) => upd({ label: v })} label="Название участника" />
        </div>
        <StatusSelect value={member.contractStatus} disabled={!editable} onChange={(v) => upd({ contractStatus: v })} />
        {editable && (
          <button
            onClick={() => {
              if (confirm('Удалить участника со всеми детьми?')) actions.removeMember(funnel.id, deal.id, member.id)
            }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
            title="Удалить участника"
          >
            <IconClose className="text-[15px]" />
          </button>
        )}
      </div>

      {/* Договор / суммы */}
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <FieldBox label="№ договора">
          <EditableField value={member.contractNo} onChange={(v) => upd({ contractNo: v })} placeholder="—" />
        </FieldBox>
        <FieldBox label="Сумма">
          <EditableField value={member.amount} type="money" onChange={(v) => upd({ amount: v })} />
        </FieldBox>
        <FieldBox label="Оплачено">
          <EditableField value={member.paid} type="money" onChange={(v) => upd({ paid: v })} />
        </FieldBox>
      </div>
      {member.amount > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/[0.06]">
            <div className="h-full rounded-full" style={{ width: `${payPct}%`, backgroundColor: payPct >= 100 ? '#84cc16' : '#1f47f5' }} />
          </div>
          <span className="text-[10.5px] font-bold text-ink-400">{payPct}%{member.paid < member.amount ? ` · остаток ${formatMoney(member.amount - member.paid)}` : ''}</span>
        </div>
      )}

      {/* Контакты */}
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-400">Контакты</span>
          {editable && (
          <div className="flex items-center gap-1">
            {available.length > 0 && (
              <select
                value=""
                onChange={(e) => e.target.value && linkContact(e.target.value)}
                className="rounded-lg bg-canvas px-2 py-1 text-[11px] font-semibold text-ink-500 outline-none ring-1 ring-ink-900/[0.06]"
              >
                <option value="">+ привязать</option>
                {available.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            )}
            <button onClick={createContact} className="rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-100">+ новый</button>
          </div>
          )}
        </div>
        <div className="space-y-1.5">
          {contacts.length === 0 && <p className="px-1 text-[11.5px] text-ink-300">Контакты не привязаны</p>}
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 rounded-xl bg-canvas px-2 py-1.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-ink-400 ring-1 ring-ink-900/[0.06]"><IconUser className="text-[14px]" /></span>
              <div className="grid flex-1 grid-cols-[1.4fr_0.9fr_1fr] items-center gap-1">
                <EditableField value={c.fullName} onChange={(v) => actions.contacts.update(c.id, { fullName: v })} compact placeholder="ФИО" />
                <EditableField value={c.role} type="select" options={(cfg.contactRoles || []).map((r) => ({ value: r, label: r }))} onChange={(v) => actions.contacts.update(c.id, { role: v })} compact placeholder="роль" />
                <EditableField value={c.phone} onChange={(v) => actions.contacts.update(c.id, { phone: v })} compact placeholder="телефон" />
              </div>
              {editable && <button onClick={() => unlink(c.id)} className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-ink-300 hover:bg-rose-50 hover:text-rose-500" title="Отвязать"><IconClose className="text-[13px]" /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* Бенефициары */}
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-400">{cfg.beneficiaryLabelPlural}</span>
          {editable && <button onClick={addBeneficiary} className="rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-100">+ добавить</button>}
        </div>
        <div className="space-y-1.5">
          {(member.beneficiaries || []).length === 0 && <p className="px-1 text-[11.5px] text-ink-300">Пока пусто</p>}
          {(member.beneficiaries || []).map((b, i) => (
            <BeneficiaryEditor key={b.id} funnel={funnel} dealId={deal.id} member={member} ben={b} index={i} />
          ))}
        </div>
      </div>

      {/* Действие: документ */}
      {editable && (
        <button
          onClick={() => onGenerate(member)}
          className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900/[0.03] py-2.5 text-[12.5px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06] transition-all hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-500/30 active:scale-[0.99]"
        >
          <IconDoc className="text-[15px]" /> Сформировать документ по участнику
        </button>
      )}
    </div>
  )
}
