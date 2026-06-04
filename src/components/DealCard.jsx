import { MANAGERS, SOURCES, formatMoneyShort } from '../data/funnels.js'
import { IconPhone } from './Icons.jsx'

function Avatar({ managerId }) {
  const m = MANAGERS[managerId]
  if (!m) return null
  return (
    <span
      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
      style={{ backgroundColor: m.color }}
      title={m.name}
    >
      {m.initials}
    </span>
  )
}

// Вторичная строка и чипы карточки зависят от типа воронки
function cardMeta(deal, kind) {
  switch (kind) {
    case 'leads':
      return {
        subtitle: deal.note,
        chips: [SOURCES[deal.source] && { label: SOURCES[deal.source].label, color: SOURCES[deal.source].color }].filter(Boolean),
      }
    case 'fiz':
      return {
        subtitle: `${deal.child} · ${deal.birth}`,
        chips: [
          { label: deal.camp, color: '#0ea5a3' },
          { label: deal.shift, color: '#7c5cff' },
        ],
      }
    case 'ul':
      return {
        subtitle: `${deal.qty} путёвок · ${deal.sanatorium}`,
        chips: [{ label: deal.payType, color: deal.payType === 'Предоплата' ? '#1f47f5' : '#e08a16' }],
      }
    case 'to':
      return {
        subtitle: `${deal.tour} · ${deal.dates}`,
        chips: [
          { label: `${deal.adults}взр / ${deal.children}дет`, color: '#0ea5a3' },
          { label: deal.region, color: '#5b6479' },
        ],
      }
    default:
      return { subtitle: '', chips: [] }
  }
}

export default function DealCard({ deal, kind, onOpen, onDragStart, onDragEnd, dragging }) {
  const meta = cardMeta(deal, kind)
  const hasPay = deal.amount != null && deal.paid != null && deal.amount > 0
  const payPct = hasPay ? Math.min(100, Math.round((deal.paid / deal.amount) * 100)) : 0

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(deal)}
      className={`group cursor-pointer select-none rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-ink-900/[0.04] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-500/30 active:scale-[0.98] ${
        dragging ? 'dragging' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md bg-ink-900/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-tight text-ink-500">
          {deal.id}
        </span>
        {deal.amount != null && (
          <span className="text-[13px] font-extrabold tracking-tight text-ink-900">
            {formatMoneyShort(deal.amount)}
          </span>
        )}
      </div>

      <h4 className="mt-2 text-[14px] font-bold leading-snug text-ink-900">{deal.title}</h4>
      {meta.subtitle && <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-500">{meta.subtitle}</p>}

      {meta.chips.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {meta.chips.map((c, i) => (
            <span
              key={i}
              className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ color: c.color, backgroundColor: c.color + '14' }}
            >
              {c.label}
            </span>
          ))}
        </div>
      )}

      {hasPay && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-500 ease-spring"
              style={{ width: `${payPct}%`, backgroundColor: payPct >= 100 ? '#84cc16' : '#1f47f5' }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-medium text-ink-400">
            <span>Оплата</span>
            <span className={payPct >= 100 ? 'text-[#5ca30b]' : 'text-ink-500'}>{payPct}%</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-ink-900/[0.05] pt-2.5">
        <Avatar managerId={deal.manager} />
        <span className="flex items-center gap-1 text-[11px] font-medium text-ink-400">
          <IconPhone className="text-[13px]" />
          {deal.phone}
        </span>
      </div>
    </article>
  )
}
