import { useStore } from '../../store/StoreContext.jsx'
import { FUNNELS } from '../../data/seed.js'
import { SIGN_STATUSES, SIGN_STATUS_COLOR } from '../../data/schema.js'
import { getMembers } from '../../data/model.js'
import { buildData, renderDocx } from '../../docs/docxEngine.js'
import { IconClose, IconDoc } from '../Icons.jsx'

function StatusSelect({ value, onChange }) {
  const color = SIGN_STATUS_COLOR[value] || '#aab2c4'
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="cursor-pointer rounded-full border-none px-2.5 py-1 text-[11px] font-bold outline-none" style={{ color, backgroundColor: color + '18' }}>
      {SIGN_STATUSES.filter((s) => s !== 'Нет').map((s) => (<option key={s} value={s} style={{ color: '#0d1326' }}>{s}</option>))}
    </select>
  )
}

export default function DocumentsView() {
  const { state, actions } = useStore()
  const docs = state.documents

  function redownload(doc) {
    const template = state.templates.find((t) => t.id === doc.templateId)
    const funnel = FUNNELS.find((f) => f.id === doc.funnelId)
    const deal = (state.deals[doc.funnelId] || []).find((d) => d.id === doc.dealId)
    if (!template || !deal || !funnel) return alert('Шаблон или сделка не найдены — невозможно пересоздать.')
    const member = doc.memberId ? getMembers(deal).find((m) => m.id === doc.memberId) : null
    const stage = funnel.stages.find((s) => s.id === deal.stageId)
    const data = buildData(template, deal, member, { ...state, stageName: stage?.name || '' })
    renderDocx(template, data, doc.name + '.docx')
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-7 py-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-ink-900">Документы</h1>
          <p className="text-[11.5px] font-medium text-ink-400">Реестр сформированных документов · {docs.length}</p>
        </div>
      </header>

      <div className="scroll-thin flex-1 overflow-auto px-7 py-5">
        {docs.length === 0 ? (
          <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-ink-900/10 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-900/[0.04] text-ink-300"><IconDoc className="text-[22px]" /></span>
            <p className="text-[13px] text-ink-400">Пока нет документов. Сформируйте из карточки сделки или участника.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/[0.05]">
            <div className="grid items-center gap-2 border-b border-ink-900/[0.06] bg-canvas/60 px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-400" style={{ gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr 1.2fr 90px' }}>
              <div className="px-1">Документ</div><div className="px-1">Шаблон</div><div className="px-1">Сделка</div><div className="px-1">Дата</div><div className="px-1">Статус</div><div />
            </div>
            {docs.map((d) => (
              <div key={d.id} className="grid items-center gap-2 border-b border-ink-900/[0.04] px-3 py-2 hover:bg-canvas/50" style={{ gridTemplateColumns: '2.2fr 1.4fr 1fr 1fr 1.2fr 90px' }}>
                <div className="flex items-center gap-2 px-1">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><IconDoc className="text-[14px]" /></span>
                  <span className="truncate text-[12.5px] font-semibold text-ink-900">{d.name}</span>
                </div>
                <div className="truncate px-1 text-[12px] text-ink-500">{d.templateName}</div>
                <div className="px-1 font-mono text-[11px] text-ink-500">{d.dealId}</div>
                <div className="px-1 text-[12px] text-ink-500">{d.createdAt}</div>
                <div><StatusSelect value={d.status} onChange={(v) => actions.documents.update(d.id, { status: v })} /></div>
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => redownload(d)} className="rounded-lg px-2 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-50" title="Скачать снова">↓</button>
                  <button onClick={() => actions.documents.remove(d.id)} className="grid h-7 w-7 place-items-center rounded-lg text-ink-300 hover:bg-rose-50 hover:text-rose-500"><IconClose className="text-[15px]" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
