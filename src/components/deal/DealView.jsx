import { useEffect, useState } from 'react'
import { MANAGERS, formatMoney } from '../../data/seed.js'
import { DEAL_FIELDS, FUNNEL_CONFIG } from '../../data/schema.js'
import { getDealAmount, getDealPaid, getMembers, memberContacts, byId, uid } from '../../data/model.js'
import { useStore } from '../../store/StoreContext.jsx'
import { SchemaField } from '../common/SchemaField.jsx'
import MemberCard from './MemberCard.jsx'
import GenerateDialog from '../templates/GenerateDialog.jsx'
import { IconClose, IconPhone, IconDoc, IconCheck, IconRuble, IconUser } from '../Icons.jsx'

export default function DealView({ deal, funnel, onClose }) {
  const { state, actions } = useStore()
  const cfg = FUNNEL_CONFIG[funnel.kind] || {}
  const [closing, setClosing] = useState(false)
  const [callState, setCallState] = useState('idle')
  const [c1, setC1] = useState('idle')
  const [gen, setGen] = useState(null) // { presetMemberId } | null

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !gen && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [gen])

  if (!deal) return null
  const stage = funnel.stages.find((s) => s.id === deal.stageId)
  const fields = DEAL_FIELDS[funnel.kind] || []
  const amount = getDealAmount(deal)
  const paid = getDealPaid(deal)
  const members = getMembers(deal)
  const firstContact = members[0] ? memberContacts(members[0], state.contacts)[0] : null
  const phone = deal.phone || firstContact?.phone || byId(state.companies, deal.companyId)?.phone || ''

  function close() {
    setClosing(true)
    setTimeout(onClose, 220)
  }
  const setField = (key, v) => actions.updateDeal(funnel.id, deal.id, { [key]: v })

  function call() {
    setCallState('calling')
    setTimeout(() => setCallState('done'), 1500)
  }
  function sync1c() {
    setC1('sync')
    setTimeout(() => setC1('done'), 1500)
  }
  function addMember() {
    actions.addMember(funnel.id, deal.id, {
      id: uid('m'),
      label: cfg.memberLabel ? `Новый ${cfg.memberLabel.toLowerCase()}` : 'Новый участник',
      contactIds: [],
      contractNo: '',
      contractStatus: 'Нет',
      amount: 0,
      paid: 0,
      beneficiaries: [],
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className={`absolute inset-0 bg-ink-900/30 backdrop-blur-[2px] transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={close} />
      <div className={`relative flex h-full w-full max-w-[680px] flex-col bg-canvas shadow-lift ${closing ? 'animate-[slide-in_0.2s_reverse]' : 'animate-slide-in'}`}>
        {/* Хедер */}
        <header className="flex items-start gap-3 border-b border-ink-900/[0.06] bg-white px-5 py-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-ink-900/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-500">{deal.id}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ color: stage.accent, backgroundColor: stage.accent + '18' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage.accent }} />
                {stage.name}
              </span>
            </div>
            <h2 className="mt-2 text-[20px] font-extrabold leading-tight tracking-tight text-ink-900">{deal.title}</h2>
            {amount != null && (
              <p className="mt-1 flex items-center gap-1 text-[15px] font-extrabold text-brand-600">
                <IconRuble className="text-[15px]" />
                {formatMoney(amount)}
                {paid != null && amount > 0 && <span className="ml-1 text-[12px] font-semibold text-ink-400">· оплачено {formatMoney(paid)}</span>}
              </p>
            )}
          </div>
          <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900"><IconClose className="text-[18px]" /></button>
        </header>

        <div className="scroll-thin flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Телефония и 1С */}
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={call} disabled={callState !== 'idle' || !phone} className="group flex items-center justify-between rounded-2xl bg-brand-600 px-4 py-3 text-white shadow-glow transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60">
              <span className="text-left">
                <span className="block text-[13px] font-bold">{callState === 'idle' && 'Позвонить'}{callState === 'calling' && 'Соединение…'}{callState === 'done' && 'Звонок начат'}</span>
                <span className="block text-[10.5px] font-medium text-white/70">{phone || 'нет телефона'}</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">{callState === 'done' ? <IconCheck className="text-[16px]" /> : <IconPhone className="text-[15px]" />}</span>
            </button>
            <button onClick={sync1c} disabled={c1 !== 'idle'} className="group flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-ink-900 shadow-soft ring-1 ring-ink-900/[0.06] transition-all duration-300 ease-spring hover:ring-brand-500/40 active:scale-[0.98]">
              <span className="text-left">
                <span className="block text-[13px] font-bold">{c1 === 'idle' && 'Выгрузить в 1С'}{c1 === 'sync' && 'Синхронизация…'}{c1 === 'done' && 'Отправлено в 1С'}</span>
                <span className="block text-[10.5px] font-medium text-ink-400">контрагент + счёт</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">{c1 === 'done' ? <IconCheck className="text-[16px]" /> : <IconDoc className="text-[15px]" />}</span>
            </button>
          </div>
          {(callState === 'done' || c1 === 'done') && (
            <div className="space-y-1.5 rounded-2xl border border-brand-200 bg-brand-50 p-3 text-[12px] font-medium text-brand-800 animate-fade-up">
              {callState === 'done' && <p className="flex items-center gap-2"><IconPhone className="text-[14px]" /> Вызов на {phone} инициирован, запись включена.</p>}
              {c1 === 'done' && <p className="flex items-center gap-2"><IconDoc className="text-[14px]" /> В 1С создан контрагент и счёт. № счёта вернётся в сделку.</p>}
            </div>
          )}

          {/* Поля сделки */}
          <div>
            <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Данные сделки</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {fields.map((f) => (
                <SchemaField key={f.key} field={f} value={deal[f.key]} onChange={(v) => setField(f.key, v)} />
              ))}
            </div>
          </div>

          {/* Участники (вложенная структура) */}
          {cfg.nested && (
            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">{cfg.memberLabelPlural} · {members.length}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setGen({ presetMemberId: null })} className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-brand-600 ring-1 ring-ink-900/[0.06] hover:bg-brand-50">Документ по сделке</button>
                  <button onClick={addMember} className="rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-brand-700">+ {cfg.memberLabel}</button>
                </div>
              </div>
              <div className="space-y-3">
                {members.length === 0 && (
                  <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-ink-900/10 py-8 text-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-900/[0.04] text-ink-300"><IconUser className="text-[20px]" /></span>
                    <p className="text-[12px] text-ink-400">Нет участников. Добавьте {cfg.memberLabel?.toLowerCase()}.</p>
                  </div>
                )}
                {members.map((m) => (
                  <MemberCard key={m.id} funnel={funnel} deal={deal} member={m} onGenerate={(mem) => setGen({ presetMemberId: mem.id })} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Футер — стадия */}
        <footer className="border-t border-ink-900/[0.06] bg-white px-5 py-3.5">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Переместить на стадию</label>
          <select
            value={deal.stageId}
            onChange={(e) => actions.moveDeal(funnel.id, deal.id, e.target.value)}
            className="w-full rounded-xl border-none bg-canvas px-3 py-2.5 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] transition-shadow focus:ring-2 focus:ring-brand-500"
          >
            {funnel.stages.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </footer>
      </div>

      {gen && <GenerateDialog deal={deal} funnel={funnel} presetMemberId={gen.presetMemberId} onClose={() => setGen(null)} />}
    </div>
  )
}
