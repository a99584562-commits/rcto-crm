import { useEffect, useState } from 'react'
import { MANAGERS, SOURCES, formatMoney } from '../data/funnels.js'
import { IconClose, IconPhone, IconDoc, IconCheck, IconRuble, IconCalendar, IconClock, IconBolt } from './Icons.jsx'

function Field({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="rounded-xl bg-canvas px-3 py-2">
      <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-semibold text-ink-900">{value}</dd>
    </div>
  )
}

function fieldsFor(deal, kind) {
  switch (kind) {
    case 'leads':
      return [
        ['Источник', SOURCES[deal.source]?.label],
        ['Телефон', deal.phone],
        ['Комментарий', deal.note],
      ]
    case 'fiz':
      return [
        ['Ребёнок', deal.child],
        ['Дата рождения', deal.birth],
        ['Лагерь', deal.camp],
        ['Смена', deal.shift],
        ['Телефон', deal.phone],
      ]
    case 'ul':
      return [
        ['Кол-во путёвок', deal.qty],
        ['Санаторий', deal.sanatorium],
        ['Тип оплаты', deal.payType],
        ['Телефон', deal.phone],
      ]
    case 'to':
      return [
        ['Тур', deal.tour],
        ['Даты', deal.dates],
        ['Взрослые / дети', `${deal.adults} / ${deal.children}`],
        ['Субъект РФ', deal.region],
        ['Телефон', deal.phone],
      ]
    default:
      return []
  }
}

export default function DealModal({ deal, funnel, onClose, onMove }) {
  const [closing, setClosing] = useState(false)
  const [callState, setCallState] = useState('idle') // idle | calling | done
  const [c1, setC1] = useState('idle') // 1С: idle | sync | done

  // закрытие по Esc + блок скролла фона
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  if (!deal) return null
  const stage = funnel.stages.find((s) => s.id === deal.stageId)
  const manager = MANAGERS[deal.manager]
  const fields = fieldsFor(deal, funnel.kind)
  const hasPay = deal.amount != null && deal.paid != null

  function close() {
    setClosing(true)
    setTimeout(onClose, 220)
  }

  function call() {
    setCallState('calling')
    setTimeout(() => setCallState('done'), 1600)
  }
  function sync1c() {
    setC1('sync')
    setTimeout(() => setC1('done'), 1600)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className={`absolute inset-0 bg-ink-900/30 backdrop-blur-[2px] transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={close}
      />
      <div
        className={`relative flex h-full w-full max-w-[480px] flex-col bg-canvas shadow-lift ${closing ? 'animate-[slide-in_0.2s_reverse]' : 'animate-slide-in'}`}
      >
        {/* Хедер */}
        <header className="flex items-start gap-3 border-b border-ink-900/[0.06] bg-white px-5 py-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-ink-900/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-500">{deal.id}</span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ color: stage.accent, backgroundColor: stage.accent + '18' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage.accent }} />
                {stage.name}
              </span>
            </div>
            <h2 className="mt-2 text-[20px] font-extrabold leading-tight tracking-tight text-ink-900">{deal.title}</h2>
            {deal.amount != null && (
              <p className="mt-1 flex items-center gap-1 text-[15px] font-extrabold text-brand-600">
                <IconRuble className="text-[15px]" />
                {formatMoney(deal.amount)}
              </p>
            )}
          </div>
          <button
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900"
          >
            <IconClose className="text-[18px]" />
          </button>
        </header>

        <div className="scroll-thin flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Быстрые действия — телефония и 1С (демо) */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={call}
              disabled={callState !== 'idle'}
              className="group flex items-center justify-between rounded-2xl bg-brand-600 px-4 py-3 text-white shadow-glow transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-[0.98] disabled:opacity-90"
            >
              <span className="text-left">
                <span className="block text-[13px] font-bold">
                  {callState === 'idle' && 'Позвонить'}
                  {callState === 'calling' && 'Соединение…'}
                  {callState === 'done' && 'Звонок начат'}
                </span>
                <span className="block text-[10.5px] font-medium text-white/70">через виртуальную АТС</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">
                {callState === 'done' ? <IconCheck className="text-[16px]" /> : <IconPhone className="text-[15px]" />}
              </span>
            </button>

            <button
              onClick={sync1c}
              disabled={c1 !== 'idle'}
              className="group flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-ink-900 shadow-soft ring-1 ring-ink-900/[0.06] transition-all duration-300 ease-spring hover:ring-brand-500/40 active:scale-[0.98]"
            >
              <span className="text-left">
                <span className="block text-[13px] font-bold">
                  {c1 === 'idle' && 'Выгрузить в 1С'}
                  {c1 === 'sync' && 'Синхронизация…'}
                  {c1 === 'done' && 'Отправлено в 1С'}
                </span>
                <span className="block text-[10.5px] font-medium text-ink-400">контрагент + счёт</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">
                {c1 === 'done' ? <IconCheck className="text-[16px]" /> : <IconDoc className="text-[15px]" />}
              </span>
            </button>
          </div>

          {(callState === 'done' || c1 === 'done') && (
            <div className="space-y-1.5 rounded-2xl border border-brand-200 bg-brand-50 p-3 text-[12px] font-medium text-brand-800 animate-fade-up">
              {callState === 'done' && (
                <p className="flex items-center gap-2">
                  <IconPhone className="text-[14px]" /> Исходящий вызов на {deal.phone} инициирован, запись разговора включена.
                </p>
              )}
              {c1 === 'done' && (
                <p className="flex items-center gap-2">
                  <IconDoc className="text-[14px]" /> В 1С создан контрагент и счёт. Номер счёта вернётся в сделку автоматически.
                </p>
              )}
            </div>
          )}

          {/* Поля сделки */}
          <div>
            <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Данные сделки</h3>
            <dl className="grid grid-cols-2 gap-2">
              {fields.map(([label, value]) => (
                <Field key={label} label={label} value={value} />
              ))}
            </dl>
          </div>

          {/* Оплата */}
          {hasPay && deal.amount > 0 && (
            <div>
              <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Оплата</h3>
              <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-900/[0.05]">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-ink-400">Оплачено</p>
                    <p className="text-[18px] font-extrabold text-ink-900">{formatMoney(deal.paid)}</p>
                  </div>
                  <p className="text-[12px] font-medium text-ink-400">из {formatMoney(deal.amount)}</p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-900/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-spring"
                    style={{
                      width: `${Math.min(100, Math.round((deal.paid / deal.amount) * 100))}%`,
                      backgroundColor: deal.paid >= deal.amount ? '#84cc16' : '#1f47f5',
                    }}
                  />
                </div>
                {deal.paid < deal.amount && (
                  <p className="mt-2 text-[12px] font-semibold text-amber-600">
                    Остаток: {formatMoney(deal.amount - deal.paid)} · нужен контроль 100% оплаты
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Лента (демо) */}
          <div>
            <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">История</h3>
            <ul className="space-y-2.5">
              {[
                { icon: IconBolt, t: 'Сделка создана автоматически из лида', d: 'роботом · сегодня' },
                { icon: IconClock, t: `Назначен ответственный — ${manager?.name || '—'}`, d: 'сегодня' },
                { icon: IconCalendar, t: `Текущая стадия: ${stage.name}`, d: 'сейчас' },
              ].map((e, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <e.icon className="text-[13px]" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink-700">{e.t}</p>
                    <p className="text-[11px] text-ink-400">{e.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Футер — смена стадии */}
        <footer className="border-t border-ink-900/[0.06] bg-white px-5 py-3.5">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Переместить на стадию</label>
          <div className="flex items-center gap-2">
            <select
              value={deal.stageId}
              onChange={(e) => onMove(deal.id, e.target.value)}
              className="flex-1 rounded-xl border-none bg-canvas px-3 py-2.5 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] transition-shadow focus:ring-2 focus:ring-brand-500"
            >
              {funnel.stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </footer>
      </div>
    </div>
  )
}
