// Производные вычисления над моделью данных (без мутаций).

let _seq = Math.floor(performance.now() * 1000) % 100000
export function uid(prefix = 'id') {
  _seq += 1
  return `${prefix}-${_seq.toString(36)}`
}

export function getMembers(deal) {
  return Array.isArray(deal.members) ? deal.members : []
}

export function getDealAmount(deal) {
  const m = getMembers(deal)
  if (m.length) return m.reduce((s, x) => s + (Number(x.amount) || 0), 0)
  return deal.amount ?? null
}

export function getDealPaid(deal) {
  const m = getMembers(deal)
  if (m.length) return m.reduce((s, x) => s + (Number(x.paid) || 0), 0)
  return deal.paid ?? null
}

export function beneficiaryCount(deal) {
  return getMembers(deal).reduce((s, m) => s + (m.beneficiaries?.length || 0), 0)
}

export function payPercent(deal) {
  const a = getDealAmount(deal)
  const p = getDealPaid(deal)
  if (!a || a <= 0 || p == null) return null
  return Math.min(100, Math.round((p / a) * 100))
}

// Реестры
export const byId = (arr, id) => (id == null ? null : arr.find((x) => x.id === id) || null)
export const campName = (camps, id) => byId(camps, id)?.name || ''
export function shiftName(shifts, id) {
  const s = byId(shifts, id)
  return s ? s.name : ''
}
export function shiftsOfCamp(shifts, campId) {
  return shifts.filter((s) => s.campId === campId)
}
export function contactById(contacts, id) {
  return byId(contacts, id)
}
export function memberContacts(member, contacts) {
  return (member.contactIds || []).map((id) => byId(contacts, id)).filter(Boolean)
}
export function contactByRole(member, contacts, role) {
  return memberContacts(member, contacts).find((c) => c.role === role) || null
}
export function primaryContactName(member, contacts) {
  const list = memberContacts(member, contacts)
  if (!list.length) return member.label || ''
  return list.map((c) => c.fullName).join(', ')
}

export const ourCompany = (companies) => companies.find((c) => c.type === 'our') || null
