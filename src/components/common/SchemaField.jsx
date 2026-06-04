import EditableField from './EditableField.jsx'
import { fieldToEditable } from '../../data/options.js'
import { useStore } from '../../store/StoreContext.jsx'

export function FieldBox({ label, children, className = '' }) {
  return (
    <div className={`rounded-xl bg-canvas px-1.5 py-1.5 ${className}`}>
      <div className="px-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400">{label}</div>
      {children}
    </div>
  )
}

// Поле, управляемое описанием из schema.js
export function SchemaField({ field, value, onChange, ctx = {}, boxed = true }) {
  const { state } = useStore()
  const ed = fieldToEditable(field, state, ctx)
  const node = (
    <EditableField value={value} type={ed.type} options={ed.options} onChange={onChange} label={field.label} compact={!boxed} />
  )
  if (!boxed) return node
  return <FieldBox label={field.label}>{node}</FieldBox>
}
