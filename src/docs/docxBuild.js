import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import InspectModule from 'docxtemplater/js/inspect-module.js'
import { MANAGERS, formatMoney } from '../data/seed.js'
import { BENEFICIARY_FIELDS, scalarSourceByPath } from '../data/schema.js'
import { byId, campName, shiftName, getDealAmount, getDealPaid, getMembers, memberContacts, contactByRole, ourCompany } from '../data/model.js'

// ── Сборка минимального .docx из текста (для встроенного примера-шаблона) ──
function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function paragraph(text, opts = {}) {
  const runProps = opts.bold || opts.size ? `<w:rPr>${opts.bold ? '<w:b/>' : ''}${opts.size ? `<w:sz w:val="${opts.size}"/>` : ''}</w:rPr>` : ''
  const pPr = opts.center ? '<w:pPr><w:jc w:val="center"/></w:pPr>' : ''
  return `<w:p>${pPr}<w:r>${runProps}<w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`
}
export function buildDocxBase64(paragraphsXml) {
  const zip = new PizZip()
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  )
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  )
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`)
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphsXml}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>`,
  )
  return zip.generate({ type: 'base64' })
}

// Сборка .docx из обычного текста (для встроенного редактора шаблонов):
// каждая строка → абзац. Строки с метками цикла {#...}/{/...} тоже становятся абзацами.
export function buildDocxBase64FromText(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n')
  const xml = lines.map((line) => paragraph(line)).join('')
  return buildDocxBase64(xml)
}

// Встроенный пример: договор по родителю со списком детей (теги + цикл)
export function buildSampleTemplate() {
  const p = [
    paragraph('ДОГОВОР № {номер_договора}', { bold: true, size: 32, center: true }),
    paragraph('г. Ижевск                                                    {дата}'),
    paragraph(''),
    paragraph('{наше_юл}, именуемое «Исполнитель», с одной стороны, и гр. {фио_родителя}, именуемый(ая) «Заказчик», с другой стороны, заключили настоящий договор о реализации путёвок в детский оздоровительный лагерь.'),
    paragraph('Контактный телефон Заказчика: {телефон_родителя}.'),
    paragraph(''),
    paragraph('Список детей по договору:', { bold: true }),
    paragraph('{#дети}'),
    paragraph('•  {фио} — дата рождения {дата_рождения}, свидетельство {свидетельство}, лагерь «{лагерь}», {смена}.'),
    paragraph('{/дети}'),
    paragraph(''),
    paragraph('Общая сумма по договору: {сумма}.', { bold: true }),
    paragraph(''),
    paragraph('Исполнитель: {наше_юл}, ИНН {наш_инн}, адрес: {наш_адрес}.'),
    paragraph('Подпись Заказчика _______________ / {фио_родителя} /'),
  ].join('')
  const fileBase64 = buildDocxBase64(p)
  return {
    id: 'tpl-sample-fiz',
    name: 'Договор с родителем (пример)',
    funnelId: 'fiz',
    entity: 'member',
    fileName: 'dogovor-roditel.docx',
    fileBase64,
    builtIn: true,
    mapping: {
      номер_договора: 'member.contractNo',
      дата: 'deal.date',
      наше_юл: 'our.name',
      фио_родителя: 'contact.fullName',
      телефон_родителя: 'contact.phone',
      сумма: 'member.amount',
      наш_инн: 'our.inn',
      наш_адрес: 'our.address',
    },
    loopMapping: {
      дети: { source: 'beneficiaries', fields: { фио: 'fullName', дата_рождения: 'birthDate', свидетельство: 'birthCertNo', лагерь: 'campId', смена: 'shiftId' } },
    },
    tags: ['номер_договора', 'дата', 'наше_юл', 'фио_родителя', 'телефон_родителя', 'сумма', 'наш_инн', 'наш_адрес'],
    loops: { дети: ['фио', 'дата_рождения', 'свидетельство', 'лагерь', 'смена'] },
  }
}

// ── Разбор загруженного .docx: теги и циклы ───────────────────────────────
export function detectTags(arrayBuffer) {
  const zip = new PizZip(arrayBuffer)
  const iModule = new InspectModule()
  // eslint-disable-next-line no-new
  new Docxtemplater(zip, { modules: [iModule], paragraphLoop: true, linebreaks: true })
  const all = iModule.getAllTags()
  const tags = []
  const loops = {}
  for (const [k, v] of Object.entries(all || {})) {
    if (v && typeof v === 'object' && Object.keys(v).length) loops[k] = Object.keys(v)
    else tags.push(k)
  }
  const base64 = zip.generate({ type: 'base64' })
  return { tags, loops, base64 }
}

// Разбор меток прямо из текста (для встроенного редактора)
export function parseTextTags(text) {
  const loops = {}
  const usedInLoop = new Set()
  const loopRe = /\{#([^}]+)\}([\s\S]*?)\{\/\1\}/g
  let m
  while ((m = loopRe.exec(text))) {
    const name = m[1].trim()
    const innerTags = [...m[2].matchAll(/\{([^#/}][^}]*)\}/g)].map((x) => x[1].trim())
    loops[name] = [...new Set(innerTags)]
    innerTags.forEach((t) => usedInLoop.add(t))
  }
  const loopNames = new Set(Object.keys(loops))
  const all = [...String(text).matchAll(/\{([^#/}][^}]*)\}/g)].map((x) => x[1].trim())
  const tags = [...new Set(all)].filter((t) => !loopNames.has(t) && !usedInLoop.has(t))
  return { tags, loops }
}

// ── Резолверы значений ────────────────────────────────────────────────────
function fmt(path, value) {
  const src = scalarSourceByPath(path)
  if (src?.money) return formatMoney(value)
  return value == null ? '' : String(value)
}

function resolveScalar(path, ctx) {
  const { deal, member, company, our, mother, father, contact } = ctx
  switch (path) {
    case 'deal.id': return deal.id
    case 'deal.title': return deal.title || ''
    case 'deal.stage': return ctx.stageName || ''
    case 'deal.amount': return fmt(path, getDealAmount(deal))
    case 'deal.paid': return fmt(path, getDealPaid(deal))
    case 'deal.manager': return MANAGERS[deal.manager]?.name || ''
    case 'deal.date': return ctx.today
    case 'company.name': return company?.name || ''
    case 'company.inn': return company?.inn || ''
    case 'company.kpp': return company?.kpp || ''
    case 'company.address': return company?.address || ''
    case 'company.phone': return company?.phone || ''
    case 'our.name': return our?.name || ''
    case 'our.inn': return our?.inn || ''
    case 'our.kpp': return our?.kpp || ''
    case 'our.address': return our?.address || ''
    case 'member.label': return member?.label || ''
    case 'member.contractNo': return member?.contractNo || ''
    case 'member.amount': return fmt(path, member?.amount)
    case 'member.paid': return fmt(path, member?.paid)
    case 'mother.fullName': return mother?.fullName || ''
    case 'mother.phone': return mother?.phone || ''
    case 'father.fullName': return father?.fullName || ''
    case 'father.phone': return father?.phone || ''
    case 'contact.fullName': return contact?.fullName || ''
    case 'contact.phone': return contact?.phone || ''
    default: return ''
  }
}

function resolveBeneficiaryField(b, fieldKey, funnelKind, store) {
  const def = (BENEFICIARY_FIELDS[funnelKind] || []).find((f) => f.key === fieldKey)
  const raw = b[fieldKey]
  if (!def) return raw == null ? '' : String(raw)
  if (def.type === 'camp') return campName(store.camps, raw)
  if (def.type === 'shift') return shiftName(store.shifts, raw)
  if (def.type === 'money') return formatMoney(raw)
  if (def.type === 'bool') return raw ? 'Да' : 'Нет'
  return raw == null ? '' : String(raw)
}

// Сборка объекта данных под docxtemplater
export function buildData(template, deal, member, store) {
  const funnelKind = template.funnelId
  const company = byId(store.companies, deal.companyId)
  const our = ourCompany(store.companies)
  const contacts = member ? memberContacts(member, store.contacts) : []
  const ctx = {
    deal, member, company, our,
    mother: member ? contactByRole(member, store.contacts, 'Мать') : null,
    father: member ? contactByRole(member, store.contacts, 'Отец') : null,
    contact: contacts[0] || null,
    today: new Date().toLocaleDateString('ru-RU'),
    stageName: store.stageName || '',
  }
  const data = {}
  for (const [tag, path] of Object.entries(template.mapping || {})) {
    data[tag] = resolveScalar(path, ctx)
  }
  for (const [loopName, cfg] of Object.entries(template.loopMapping || {})) {
    const list = member ? member.beneficiaries || [] : getMembers(deal).flatMap((m) => m.beneficiaries || [])
    data[loopName] = list.map((b) => {
      const item = {}
      for (const [innerTag, fieldKey] of Object.entries(cfg.fields || {})) {
        item[innerTag] = resolveBeneficiaryField(b, fieldKey, funnelKind, store)
      }
      return item
    })
  }
  return data
}

// Рендер шаблона в Blob (без скачивания)
export function renderToBlob(template, data) {
  const zip = new PizZip(template.fileBase64, { base64: true })
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: '{', end: '}' } })
  doc.render(data)
  return doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}

// Рендер шаблона в простой текст (для предпросмотра в интерфейсе)
export function renderToText(template, data) {
  try {
    const zip = new PizZip(template.fileBase64, { base64: true })
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: '{', end: '}' } })
    doc.render(data)
    const xml = doc.getZip().file('word/document.xml').asText()
    return xml
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  } catch (e) {
    return 'Не удалось построить предпросмотр: ' + (e?.message || e)
  }
}

export function sampleBlob() {
  const t = buildSampleTemplate()
  return new PizZip(t.fileBase64, { base64: true }).generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}
