import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { getMembers, uid } from '../../data/model.js'
import { buildData, renderDocx } from '../../docs/docxEngine.js'
import { IconClose, IconDoc, IconCheck } from '../Icons.jsx'

export default function GenerateDialog({ deal, funnel, presetMemberId, onClose }) {
  const { state, actions } = useStore()
  const templates = useMemo(() => state.templates.filter((t) => t.funnelId === funnel.id), [state.templates, funnel.id])
  const [templateId, setTemplateId] = useState(templates[0]?.id || '')
  const template = templates.find((t) => t.id === templateId)
  const members = getMembers(deal)
  const [memberId, setMemberId] = useState(presetMemberId || members[0]?.id || '')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function generate() {
    setError('')
    if (!template) {
      setError('Нет шаблона для этой воронки. Создайте его в разделе «Шаблоны».')
      return
    }
    const member = template.entity === 'member' ? members.find((m) => m.id === memberId) : null
    if (template.entity === 'member' && !member) {
      setError('Выберите участника.')
      return
    }
    const stage = funnel.stages.find((s) => s.id === deal.stageId)
    try {
      const data = buildData(template, deal, member, { ...state, stageName: stage?.name || '' })
      const fileName = `${template.name} — ${deal.id}${member ? ` (${member.label})` : ''}.docx`
      renderDocx(template, data, fileName)
      actions.documents.add({
        id: uid('doc'),
        name: fileName.replace(/\.docx$/, ''),
        templateId: template.id,
        templateName: template.name,
        dealId: deal.id,
        funnelId: funnel.id,
        memberId: member?.id || null,
        memberLabel: member?.label || '',
        createdAt: new Date().toLocaleDateString('ru-RU'),
        status: 'Сформирован',
      })
      // подтянуть статус договора участника
      if (member && ['Нет', 'Черновик'].includes(member.contractStatus)) {
        actions.updateMember(funnel.id, deal.id, member.id, { contractStatus: 'Сформирован' })
      }
      setDone(true)
      setTimeout(onClose, 900)
    } catch (e) {
      setError('Ошибка генерации: ' + (e?.message || e))
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-4xl bg-canvas shadow-lift animate-scale-in">
        <div className="flex items-start gap-3 bg-white px-5 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600"><IconDoc className="text-[19px]" /></span>
          <div className="flex-1">
            <h2 className="text-[16px] font-extrabold tracking-tight text-ink-900">Сформировать документ</h2>
            <p className="text-[12px] font-medium text-ink-400">Сделка {deal.id}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-ink-900/[0.06]"><IconClose className="text-[17px]" /></button>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Шаблон</label>
            {templates.length === 0 ? (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-700">Для воронки «{funnel.name}» пока нет шаблонов. Создайте в разделе «Шаблоны».</p>
            ) : (
              <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full rounded-xl bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}{t.builtIn ? ' (пример)' : ''}</option>
                ))}
              </select>
            )}
          </div>

          {template?.entity === 'member' && members.length > 0 && (
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Участник</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="w-full rounded-xl bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-900 outline-none ring-1 ring-ink-900/[0.06] focus:ring-2 focus:ring-brand-500">
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-600">{error}</p>}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={generate}
            disabled={done || templates.length === 0}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-[14px] font-bold text-white shadow-glow transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-[0.98] disabled:opacity-70"
          >
            {done ? (<><IconCheck className="text-[17px]" /> Готово, файл скачан</>) : (<><IconDoc className="text-[16px]" /> Сформировать .docx</>)}
          </button>
        </div>
      </div>
    </div>
  )
}
