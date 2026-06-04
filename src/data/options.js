import { MANAGERS, SOURCES } from './seed.js'

export const managerOptions = () => Object.entries(MANAGERS).map(([value, m]) => ({ value, label: m.name }))
export const sourceOptions = () => Object.entries(SOURCES).map(([value, s]) => ({ value, label: s.label }))
export const companyOptions = (state) => state.companies.map((c) => ({ value: c.id, label: c.name }))
export const contactOptions = (state) =>
  state.contacts.map((c) => ({ value: c.id, label: `${c.fullName}${c.role ? ` · ${c.role}` : ''}` }))
export const campOptions = (state) => state.camps.map((c) => ({ value: c.id, label: `${c.name} (${c.kind})` }))
export const shiftOptions = (state, campId) =>
  state.shifts
    .filter((s) => !campId || s.campId === campId)
    .map((s) => ({ value: s.id, label: `${s.name} · ${s.dateStart}–${s.dateEnd}` }))

// Превратить field-def (schema) в тип + опции для EditableField
export function fieldToEditable(field, state, ctx = {}) {
  switch (field.type) {
    case 'manager':
      return { type: 'select', options: managerOptions() }
    case 'company':
      return { type: 'select', options: companyOptions(state) }
    case 'contact':
      return { type: 'select', options: contactOptions(state) }
    case 'camp':
      return { type: 'select', options: campOptions(state) }
    case 'shift':
      return { type: 'select', options: shiftOptions(state, ctx.campId) }
    case 'source':
      return { type: 'select', options: sourceOptions() }
    case 'select':
      return { type: 'select', options: (field.options || []).map((o) => ({ value: o, label: o })) }
    default:
      return { type: field.type }
  }
}
