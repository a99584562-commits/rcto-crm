import { useEffect, useRef, useState } from 'react'
import { formatMoney } from '../../data/seed.js'

// Универсальное инлайн-редактируемое поле.
// type: text | textarea | number | money | date | select | bool
// options (для select): [{ value, label }]
export default function EditableField({
  value,
  type = 'text',
  options = [],
  onChange,
  placeholder = '—',
  label,
  compact = false,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)

  useEffect(() => setDraft(value), [value])
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      if (ref.current.select) ref.current.select()
    }
  }, [editing])

  function commit(v) {
    setEditing(false)
    if (v !== value) onChange?.(v)
  }

  // bool — переключатель, без режима редактирования
  if (type === 'bool') {
    return (
      <button
        type="button"
        onClick={() => onChange?.(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 ease-spring ${value ? 'bg-brand-600' : 'bg-ink-900/15'}`}
        aria-pressed={value}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ease-spring ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    )
  }

  const display = () => {
    if (type === 'money') return value ? formatMoney(value) : placeholder
    if (type === 'select') {
      const opt = options.find((o) => String(o.value) === String(value))
      return opt ? opt.label : placeholder
    }
    return value === '' || value == null ? placeholder : String(value)
  }

  const fieldBase =
    'w-full rounded-lg bg-white px-2.5 py-1.5 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-brand-500 transition-shadow'

  if (editing) {
    if (type === 'select') {
      return (
        <select
          ref={ref}
          value={value ?? ''}
          onChange={(e) => commit(e.target.value === '' ? null : e.target.value)}
          onBlur={() => setEditing(false)}
          className={fieldBase}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
    }
    if (type === 'textarea') {
      return (
        <textarea
          ref={ref}
          rows={3}
          value={draft ?? ''}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
          className={fieldBase + ' resize-none leading-snug'}
        />
      )
    }
    return (
      <input
        ref={ref}
        type={type === 'number' || type === 'money' ? 'number' : 'text'}
        value={draft ?? ''}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(type === 'number' || type === 'money' ? (draft === '' ? null : Number(draft)) : draft)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit(type === 'number' || type === 'money' ? (draft === '' ? null : Number(draft)) : draft)
          if (e.key === 'Escape') setEditing(false)
        }}
        placeholder={placeholder}
        className={fieldBase}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title={label ? `Изменить: ${label}` : 'Изменить'}
      className={`group/ef w-full rounded-lg px-2.5 ${compact ? 'py-1' : 'py-1.5'} text-left text-[13px] font-semibold transition-colors duration-200 hover:bg-brand-50 ${value === '' || value == null ? 'text-ink-300' : 'text-ink-900'}`}
    >
      <span className="inline-flex w-full items-center justify-between gap-1">
        <span className="truncate">{display()}</span>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-300 opacity-0 transition-opacity group-hover/ef:opacity-100">
          <path d="M4 20h4L18 10l-4-4L4 16v4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}
