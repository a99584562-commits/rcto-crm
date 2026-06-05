import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { canEdit } from '../../data/perm.js'
import { uid, shiftsOfCamp } from '../../data/model.js'
import { formatMoneyShort } from '../../data/seed.js'
import EditableField from '../common/EditableField.jsx'
import { FieldBox } from '../common/SchemaField.jsx'
import { IconClose, IconGlobe } from '../Icons.jsx'

export default function CampsShiftsView() {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const [selId, setSelId] = useState(state.camps[0]?.id || null)
  const sel = state.camps.find((c) => c.id === selId) || state.camps[0]
  const shifts = sel ? shiftsOfCamp(state.shifts, sel.id) : []

  function addCamp() {
    const id = uid('cmp')
    actions.camps.add({ id, name: 'Новый объект', kind: 'Лагерь', location: '', address: '' })
    setSelId(id)
  }
  function addShift() {
    if (!sel) return
    actions.shifts.add({ id: uid('sh'), campId: sel.id, name: 'Новая смена', dateStart: '', dateEnd: '', price: 0, capacity: 0, booked: 0 })
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Лагеря и смены</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Реестр объектов и смен с загрузкой</p>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[320px_1fr] overflow-hidden">
        {/* Лагеря */}
        <div className="scroll-thin flex flex-col gap-2 overflow-y-auto border-r border-ink-900/[0.06] p-4">
          {editable && <button onClick={addCamp} className="mb-1 rounded-xl bg-brand-600 py-2 text-[13px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-[0.98]">+ Объект</button>}
          {state.camps.map((c) => {
            const active = c.id === sel?.id
            const cnt = shiftsOfCamp(state.shifts, c.id).length
            return (
              <button key={c.id} onClick={() => setSelId(c.id)} className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-all duration-300 ease-spring active:scale-[0.98] ${active ? 'bg-white shadow-soft ring-1 ring-brand-500/30' : 'hover:bg-white/70'}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[16px] ${active ? 'bg-brand-600 text-white' : 'bg-ink-900/[0.04] text-ink-400'}`}><IconGlobe /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-ink-900">{c.name}</span>
                  <span className="block text-[11px] text-ink-400">{c.kind} · {cnt} смен</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Смены выбранного объекта */}
        <div className="scroll-thin flex-1 overflow-auto p-5">
          {sel && (
            <>
              <div className="mb-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-900/[0.05]">
                <FieldBox label="Название"><EditableField value={sel.name} onChange={(v) => actions.camps.update(sel.id, { name: v })} /></FieldBox>
                <FieldBox label="Тип"><EditableField value={sel.kind} type="select" options={[{ value: 'Лагерь', label: 'Лагерь' }, { value: 'Санаторий', label: 'Санаторий' }]} onChange={(v) => actions.camps.update(sel.id, { kind: v })} /></FieldBox>
                <FieldBox label="Локация"><EditableField value={sel.location} onChange={(v) => actions.camps.update(sel.id, { location: v })} /></FieldBox>
                <FieldBox label="Адрес" className="col-span-3"><EditableField value={sel.address} onChange={(v) => actions.camps.update(sel.id, { address: v })} /></FieldBox>
              </div>

              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-[13px] font-bold tracking-tight text-ink-900">Смены</h2>
                {editable && <button onClick={addShift} className="rounded-lg bg-brand-50 px-2.5 py-1 text-[12px] font-bold text-brand-600 hover:bg-brand-100">+ Смена</button>}
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/[0.05]">
                <div className="grid items-center gap-2 border-b border-ink-900/[0.06] bg-canvas/60 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-400" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.6fr 40px' }}>
                  <div className="px-1">Смена</div><div className="px-1">Начало</div><div className="px-1">Конец</div><div className="px-1">Цена</div><div className="px-1">Загрузка</div><div />
                </div>
                {shifts.length === 0 && <div className="px-4 py-8 text-center text-[13px] text-ink-300">Нет смен</div>}
                {shifts.map((s) => {
                  const pct = s.capacity > 0 ? Math.min(100, Math.round((s.booked / s.capacity) * 100)) : 0
                  return (
                    <div key={s.id} className="grid items-center gap-2 border-b border-ink-900/[0.04] px-3 py-1.5 hover:bg-canvas/50" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.6fr 40px' }}>
                      <EditableField value={s.name} onChange={(v) => actions.shifts.update(s.id, { name: v })} compact />
                      <EditableField value={s.dateStart} onChange={(v) => actions.shifts.update(s.id, { dateStart: v })} compact placeholder="дд.мм.гггг" />
                      <EditableField value={s.dateEnd} onChange={(v) => actions.shifts.update(s.id, { dateEnd: v })} compact placeholder="дд.мм.гггг" />
                      <EditableField value={s.price} type="money" onChange={(v) => actions.shifts.update(s.id, { price: v })} compact />
                      <div className="flex items-center gap-2 px-1">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/[0.06]"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 95 ? '#f0654a' : pct >= 75 ? '#e08a16' : '#84cc16' }} /></div>
                        <span className="shrink-0 text-[10.5px] font-bold text-ink-400">{s.booked}/{s.capacity}</span>
                      </div>
                      {editable ? <button onClick={() => actions.shifts.remove(s.id)} className="grid h-7 w-7 place-items-center rounded-lg text-ink-300 hover:bg-rose-50 hover:text-rose-500"><IconClose className="text-[15px]" /></button> : <span />}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
