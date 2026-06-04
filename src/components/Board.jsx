import { useRef, useState } from 'react'
import Column from './Column.jsx'

export default function Board({ funnel, deals, onMove, onOpenDeal }) {
  const [draggingId, setDraggingId] = useState(null)
  const dragged = useRef(null)

  const drag = {
    draggingId,
    onDragStart: (e, deal) => {
      dragged.current = deal
      setDraggingId(deal.id)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', deal.id)
    },
    onDragEnd: () => {
      dragged.current = null
      setDraggingId(null)
    },
    onDrop: (toStageId) => {
      const d = dragged.current
      if (d && d.stageId !== toStageId) onMove(d.id, toStageId)
      dragged.current = null
      setDraggingId(null)
    },
  }

  return (
    <div className="scroll-thin flex-1 overflow-x-auto overflow-y-hidden px-5 pb-5 pt-1 sm:px-8">
      <div className="flex h-full min-w-max gap-4">
        {funnel.stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id)
          const total = stageDeals.reduce((s, d) => s + (d.amount || 0), 0)
          return (
            <Column
              key={stage.id}
              stage={stage}
              deals={stageDeals}
              kind={funnel.kind}
              onOpenDeal={onOpenDeal}
              drag={drag}
              total={total}
            />
          )
        })}
      </div>
    </div>
  )
}
