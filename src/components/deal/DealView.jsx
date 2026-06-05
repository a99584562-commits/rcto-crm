import { useEffect, useState } from 'react'
import { formatMoney } from '../../data/seed.js'
import { DEAL_FIELDS, FUNNEL_CONFIG } from '../../data/schema.js'
import { canEdit } from '../../data/perm.js'
import { getDealAmount, getDealPaid, getMembers, memberContacts, byId, uid } from '../../data/model.js'
import { useStore } from '../../store/StoreContext.jsx'
import { SchemaField } from '../common/SchemaField.jsx'
import MemberCard from './MemberCard.jsx'
import GenerateDialog from '../templates/GenerateDialog.jsx'
import StageBar from './StageBar.jsx'
import Timeline from './Timeline.jsx'
import DealTasks from './DealTasks.jsx'
import { IconClose, IconPhone, IconDoc, IconCheck, IconRuble, IconUser } from '../Icons.jsx'

export default function DealView({ deal, funnel, onClose }) {
  const { state, actions } = useStore()
  const editable = canEdit(state)
  const cfg = FUNNEL_CONFIG[funnel.kind] || {}
  const [closing, setClosing] = useState(false)
  const [callState, setCallState] = useState('idle')
  const [c1, setC1] = useState('idle')
  const [gen, setGen] = useState(null)

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
    setTimeout(onClose, 200)
  }
  const setField = (key, v) => actions.updateDeal(funnel.id, deal.id, { [key]: v })

  function call() {
    if (callState !== 'idle' || !phone) return
    setCallState('calling')
    setTimeout(() => {
      setCallState('done')
      actions.logEvent(deal.id, funnel.id, 'call', `Исходящий звонок: ${phone} (запись включена)`)
    }, 1300)
  }
  function sync1c() {
    if (c1 !== 'idle') return
    setC1('sync')
    setTimeout(() => {
      setC1('done')
      actions.logEvent(deal.id, funnel.id, 'onec', 'Выгрузка в 1С: контрагент и счёт отправлены')
    }, 1300)
  }
  function addMember() {
    actions.addMember(funnel.id, deal.id, {
      id: uid('m'), label: cfg.memberLabel ? `Новый ${cfg.memberLabel.toLowerCase()}` : 'Новый участник',
      contactIds: [], contractNo: '', contractStatus: 'Нет', amount: 0, paid: 0, beneficiaries: [],
    })
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center p-3 sm:p-6">
      <div className={`absolute inset-0 bg-ink-900/40 backdrop-blur-[3px] transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={close} />

      <div className={`relative flex h-[92vh] w-full max-w-[1140px] flex-col overflow-hidden rounded-4xl bg-canvas shadow-lift ${closing ? 'opacity-0' : 'animate-scale-in'}`}>
        {/* Хедер */}
        <header className="flex items-center gap-3 border-b border-ink-900/[0.06] bg-white px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-ink-900/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-500">{deal.id}</span>
              <span className="truncate text-[11px] font-semibold text-ink-400">{funnel.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="truncate text-[19px] font-extrabold leading-tight tracking-tight text-ink-900">{deal.title}</h2>
              {amount != null && (
                <span className="flex shrink-0 items-center gap-1 text-[14px] font-extrabold text-brand-600">
                  <IconRuble className="text-[14px]" />{formatMoney(amount)}
                  {paid != null && amount > 0 && <span className="text-[11px] font-semibold text-ink-400">· опл. {formatMoney(paid)}</span>}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button onClick={call} disabled={!phone || callState !== 'idle'} className="group flex items-center gap-2 rounded-full bg-brand-600 px-3.5 py-2 text-[12.5px] font-bold text-white shadow-glow transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-50">
              {callState === 'done' ? <IconCheck className="text-[15px]" /> : <IconPhone className="text-[14px]" />}
              <span className="hidden sm:inline">{callState === 'idle' ? 'Позвонить' : callState === 'calling' ? 'Соединение…' : 'Звонок начат'}</span>
            </button>
            <button onClick={sync1c} disabled={c1 !== 'idle'} className="group flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06] transition-all hover:ring-brand-500/40 active:scale-95">
              {c1 === 'done' ? <IconCheck className="text-[15px] text-emerald-500" /> : <IconDoc className="text-[14px]" />}
              <span className="hidden sm:inline">{c1 === 'idle' ? '1С' : c1 === 'sync' ? '…' : 'В 1С'}</span>
            </button>
            <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900"><IconClose className="text-[18px]" /></button>
          </div>
        </header>

        {/* Переключатель стадий */}
        <div className="border-b border-ink-900/[0.06] bg-white px-5 py-3">
          <StageBar funnel={funnel} deal={deal} disabled={!editable} onMove={(sid) => actions.moveDeal(funnel.id, deal.id, sid)} />
        </div>

        {/* Тело: слева поля, справа лента */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_372px]">
          <div className="scroll-thin space-y-5 overflow-y-auto px-5 py-5">
            <DealTasks deal={deal} funnel={funnel} />

            <div>
              <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Данные сделки</h3>
              <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
                {fields.map((f) => (
                  <SchemaField key={f.key} field={f} value={deal[f.key]} onChange={(v) => setField(f.key, v)} />
                ))}
              </div>
            </div>

            {cfg.nested && (
              <div>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">{cfg.memberLabelPlural} · {members.length}</h3>
                  {editable && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setGen({ presetMemberId: null })} className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-brand-600 ring-1 ring-ink-900/[0.06] hover:bg-brand-50">Документ по сделке</button>
                      <button onClick={addMember} className="rounded-lg bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-brand-700">+ {cfg.memberLabel}</button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {members.length === 0 && (
                    <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-ink-900/10 py-8 text-center">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-900/[0.04] text-ink-300"><IconUser className="text-[20px]" /></span>
                      <p className="text-[12px] text-ink-400">Нет участников{editable ? `. Добавьте ${cfg.memberLabel?.toLowerCase()}.` : ''}</p>
                    </div>
                  )}
                  {members.map((m) => (
                    <MemberCard key={m.id} funnel={funnel} deal={deal} member={m} onGenerate={(mem) => setGen({ presetMemberId: mem.id })} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Лента */}
          <div className="min-h-0 border-t border-ink-900/[0.06] lg:border-l lg:border-t-0">
            <Timeline deal={deal} funnel={funnel} />
          </div>
        </div>
      </div>

      {gen && <GenerateDialog deal={deal} funnel={funnel} presetMemberId={gen.presetMemberId} onClose={() => setGen(null)} />}
    </div>
  )
}
