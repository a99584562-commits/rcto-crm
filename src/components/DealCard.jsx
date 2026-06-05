import { MANAGERS, SOURCES, formatMoneyShort } from '../data/seed.js'
import { FUNNEL_CONFIG } from '../data/schema.js'
import { getDealAmount, getDealPaid, getMembers, beneficiaryCount, byId, memberContacts } from '../data/model.js'
import { canEdit } from '../data/perm.js'
import { useStore } from '../store/StoreContext.jsx'
import { IconPhone } from './Icons.jsx'

function Avatar({ managerId }) {
  const m = MANAGERS[managerId]
  if (!m) return null
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white" style={{ backgroundColor: m.color }} title={m.name}>
      {m.initials}
    </span>
  )
}

function plural(n, one, few, many) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return `${n} ${one}`
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} ${few}`
  return `${n} ${many}`
}

export default function DealCard({ deal, funnel, onOpen, onDragStart, onDragEnd, dragging }) {
  const { state } = useStore()
  const editable = canEdit(state)
  const cfg = FUNNEL_CONFIG[funnel.kind] || {}
  const amount = getDealAmount(deal)
  const paid = getDealPaid(deal)
  const hasPay = amount != null && paid != null && amount > 0
  const payPct = hasPay ? Math.min(100, Math.round((paid / amount) * 100)) : 0

  let subtitle = ''
  let chips = []
  let phone = deal.phone

  if (funnel.kind === 'leads') {
    subtitle = deal.note
    if (SOURCES[deal.source]) chips = [{ label: SOURCES[deal.source].label, color: SOURCES[deal.source].color }]
  } else {
    const members = getMembers(deal)
    const benN = beneficiaryCount(deal)
    const company = byId(state.companies, deal.companyId)
    if (funnel.kind === 'fiz') {
      subtitle = `${plural(members.length, 'семья', 'семьи', 'семей')} · ${plural(benN, 'ребёнок', 'ребёнка', 'детей')}`
    } else {
      subtitle = company ? company.name : `${plural(members.length, cfg.memberLabel, cfg.memberLabel, cfg.memberLabel)}`
    }
    // плашки: уникальные лагеря/санатории среди бенефициаров
    const campNames = [...new Set(members.flatMap((m) => (m.beneficiaries || []).map((b) => byId(state.camps, b.campId)?.name).filter(Boolean)))]
    chips = campNames.slice(0, 2).map((n) => ({ label: n, color: '#0ea5a3' }))
    if (campNames.length > 2) chips.push({ label: `+${campNames.length - 2}`, color: '#5b6479' })
    // телефон: первый контакт первого участника или телефон компании
    const firstContact = members[0] ? memberContacts(members[0], state.contacts)[0] : null
    phone = firstContact?.phone || company?.phone || ''
  }

  return (
    <article
      draggable={editable}
      onDragStart={(e) => editable && onDragStart(e, deal)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(deal)}
      className={`group cursor-pointer select-none rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-ink-900/[0.04] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-500/30 active:scale-[0.98] ${dragging ? 'dragging' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md bg-ink-900/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-tight text-ink-500">{deal.id}</span>
        {amount != null && <span className="text-[13px] font-extrabold tracking-tight text-ink-900">{formatMoneyShort(amount)}</span>}
      </div>

      <h4 className="mt-2 text-[14px] font-bold leading-snug text-ink-900">{deal.title}</h4>
      {subtitle && <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-500">{subtitle}</p>}

      {chips.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <span key={i} className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ color: c.color, backgroundColor: c.color + '14' }}>
              {c.label}
            </span>
          ))}
        </div>
      )}

      {hasPay && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/[0.06]">
            <div className="h-full rounded-full transition-all duration-500 ease-spring" style={{ width: `${payPct}%`, backgroundColor: payPct >= 100 ? '#84cc16' : '#1f47f5' }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-medium text-ink-400">
            <span>Оплата</span>
            <span className={payPct >= 100 ? 'text-[#5ca30b]' : 'text-ink-500'}>{payPct}%</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-ink-900/[0.05] pt-2.5">
        <Avatar managerId={deal.manager} />
        {phone && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-ink-400">
            <IconPhone className="text-[13px]" />
            {phone}
          </span>
        )}
      </div>
    </article>
  )
}
