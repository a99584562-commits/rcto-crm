import { useState } from 'react'
import { BENEFICIARY_FIELDS } from '../../data/schema.js'
import { byId, campName, shiftName } from '../../data/model.js'
import { useStore } from '../../store/StoreContext.jsx'
import { canEdit } from '../../data/perm.js'
import { SchemaField } from '../common/SchemaField.jsx'
import { IconClose } from '../Icons.jsx'

export default function BeneficiaryEditor({ funnel, dealId, member, ben, index }) {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const [open, setOpen] = useState(false)
  const fields = BENEFICIARY_FIELDS[funnel.kind] || []

  function set(key, val) {
    const patch = { [key]: val }
    if (key === 'campId') patch.shiftId = null // смена зависит от лагеря
    actions.updateBeneficiary(funnel.id, dealId, member.id, ben.id, patch)
  }

  const camp = campName(state.camps, ben.campId)
  const shift = shiftName(state.shifts, ben.shiftId)

  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-ink-900/[0.06]">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600">{index + 1}</span>
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left">
          <div className="text-[13px] font-bold text-ink-900">{ben.fullName || 'Без имени'}</div>
          <div className="text-[11px] text-ink-400">{[camp, shift].filter(Boolean).join(' · ') || 'данные не заполнены'}</div>
        </button>
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50">
          {open ? 'Свернуть' : editable ? 'Изменить' : 'Открыть'}
        </button>
        {editable && (
          <button
            onClick={() => actions.removeBeneficiary(funnel.id, dealId, member.id, ben.id)}
            className="grid h-7 w-7 place-items-center rounded-lg text-ink-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
            title="Удалить"
          >
            <IconClose className="text-[15px]" />
          </button>
        )}
      </div>
      {open && (
        <div className="grid grid-cols-2 gap-1.5 border-t border-ink-900/[0.05] bg-canvas/60 p-2">
          {fields.map((f) => (
            <SchemaField
              key={f.key}
              field={f}
              value={ben[f.key]}
              ctx={{ campId: ben.campId }}
              onChange={(v) => set(f.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
