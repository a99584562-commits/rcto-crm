import { useState } from 'react'
import DealCard from './DealCard.jsx'
import { formatMoneyShort } from '../data/funnels.js'

export default function Column({ stage, deals, kind, onOpenDeal, drag, total }) {
  const [over, setOver] = useState(false)
  const isWin = stage.kind === 'win'
  const isLost = stage.kind === 'lost'

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault()
        if (!over) setOver(true)
      }}
      onDragLeave={(e) => {
        // только если курсор реально покинул колонку
        if (!e.currentTarget.contains(e.relatedTarget)) setOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        drag.onDrop(stage.id)
      }}
      className="flex w-[300px] shrink-0 flex-col"
    >
      {/* Шапка стадии */}
      <div className="mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: stage.accent }} />
          <h3 className="flex-1 truncate text-[13px] font-bold tracking-tight text-ink-900">{stage.name}</h3>
          <span className="grid min-w-[22px] place-items-center rounded-full bg-ink-900/[0.05] px-1.5 text-[11px] font-bold text-ink-500">
            {deals.length}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 pl-[18px]">
          {total > 0 && (
            <span
              className="text-[11px] font-bold"
              style={{ color: isWin ? '#5ca30b' : isLost ? '#d6452c' : '#5b6479' }}
            >
              {formatMoneyShort(total)}
            </span>
          )}
          {stage.hint && (
            <span className="group/h relative inline-flex">
              <span className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full border border-ink-300 text-[9px] font-bold text-ink-400">
                i
              </span>
              <span className="pointer-events-none absolute left-1/2 top-5 z-30 w-60 -translate-x-1/2 rounded-xl bg-ink-900 p-2.5 text-[11px] font-medium leading-snug text-white opacity-0 shadow-lift transition-opacity duration-200 group-hover/h:opacity-100">
                {stage.hint}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Дроп-зона */}
      <div
        className={`flex flex-1 flex-col gap-2.5 rounded-3xl p-2 transition-colors duration-300 ${
          over ? 'bg-brand-500/[0.07] ring-2 ring-dashed ring-brand-500/40' : 'bg-ink-900/[0.025]'
        }`}
        style={{ minHeight: 120 }}
      >
        {deals.map((d) => (
          <DealCard
            key={d.id}
            deal={d}
            kind={kind}
            onOpen={onOpenDeal}
            onDragStart={drag.onDragStart}
            onDragEnd={drag.onDragEnd}
            dragging={drag.draggingId === d.id}
          />
        ))}
        {deals.length === 0 && (
          <div className="grid flex-1 place-items-center rounded-2xl border border-dashed border-ink-900/10 py-8 text-[11px] text-ink-300">
            Перетащите сделку сюда
          </div>
        )}
      </div>
    </section>
  )
}
