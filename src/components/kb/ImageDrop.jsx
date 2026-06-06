import { useRef, useState } from 'react'
import { fileToScaledDataURL, imageFromPaste } from '../../lib/image.js'
import { IconClose } from '../Icons.jsx'

export default function ImageDrop({ src, editable, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setBusy(true)
    try {
      onChange(await fileToScaledDataURL(file))
    } catch (e) {
      alert(e.message || 'Не удалось загрузить изображение')
    }
    setBusy(false)
  }

  // Режим просмотра
  if (!editable) {
    if (!src) return null
    return <img src={src} alt="" className="mt-2 w-full rounded-xl ring-1 ring-ink-900/[0.06]" />
  }

  // Режим редактирования — есть картинка
  if (src) {
    return (
      <div className="group/img relative mt-2">
        <img src={src} alt="" className="w-full rounded-xl ring-1 ring-ink-900/[0.06]" />
        <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover/img:opacity-100">
          <button onClick={() => inputRef.current?.click()} className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink-700 shadow-soft ring-1 ring-ink-900/[0.06] backdrop-blur hover:text-brand-700">Заменить</button>
          <button onClick={() => onChange(null)} className="grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-ink-500 shadow-soft ring-1 ring-ink-900/[0.06] backdrop-blur hover:text-rose-500"><IconClose className="text-[14px]" /></button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    )
  }

  // Режим редактирования — пусто (загрузка/вставка/перетаскивание)
  return (
    <div
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onPaste={(e) => { const f = imageFromPaste(e); if (f) { e.preventDefault(); handleFile(f) } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files?.[0]) }}
      className={`mt-2 grid cursor-pointer place-items-center rounded-xl border border-dashed py-6 text-center text-[12px] font-medium outline-none transition-colors ${over ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-900/15 text-ink-400 hover:border-brand-500/50 hover:bg-brand-50/40'}`}
    >
      {busy ? 'Загрузка…' : (
        <span>
          <span className="block text-[18px]">🖼️</span>
          Загрузить скрин · перетащите файл · или нажмите и вставьте (Ctrl+V)
        </span>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  )
}
