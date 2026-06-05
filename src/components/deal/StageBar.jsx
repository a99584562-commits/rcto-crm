// Переключатель стадий «шевронами», как в Битрикс24 / amoCRM.
export default function StageBar({ funnel, deal, onMove, disabled }) {
  const idx = funnel.stages.findIndex((s) => s.id === deal.stageId)

  return (
    <div className="scroll-thin flex items-stretch gap-0 overflow-x-auto pb-1">
      {funnel.stages.map((s, i) => {
        const passed = i <= idx
        const isCurrent = i === idx
        const bg = passed ? s.accent : '#eef1f6'
        const color = passed ? '#ffffff' : '#7a8296'
        const clip =
          i === 0
            ? 'polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%)'
            : 'polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%)'
        return (
          <button
            key={s.id}
            disabled={disabled}
            onClick={() => onMove(s.id)}
            title={s.name}
            className={`relative h-9 shrink-0 whitespace-nowrap px-4 text-[11.5px] font-bold transition-all duration-200 ${disabled ? 'cursor-default' : 'hover:brightness-105 active:scale-[0.99]'} ${isCurrent ? 'z-10' : ''}`}
            style={{
              backgroundColor: bg,
              color,
              clipPath: clip,
              marginLeft: i === 0 ? 0 : -10,
              paddingLeft: i === 0 ? 14 : 22,
              boxShadow: isCurrent ? `0 6px 16px -6px ${s.accent}aa` : 'none',
            }}
          >
            {s.name}
          </button>
        )
      })}
    </div>
  )
}
