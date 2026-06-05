// ─────────────────────────────────────────────────────────────────────────
// Единый источник правды по полям сущностей и токенам для Word-шаблонов.
// Используется и редактором карточек, и настройщиком документов.
// ─────────────────────────────────────────────────────────────────────────

export const SIGN_STATUSES = ['Нет', 'Черновик', 'Сформирован', 'На подписании', 'Подписан']

export const SIGN_STATUS_COLOR = {
  Нет: '#aab2c4',
  Черновик: '#838ca0',
  Сформирован: '#3f67ff',
  'На подписании': '#e08a16',
  Подписан: '#84cc16',
}

// Конфигурация вложенности по воронкам (smart-process)
export const FUNNEL_CONFIG = {
  leads: { nested: false },
  fiz: {
    nested: true,
    memberLabel: 'Родитель',
    memberLabelPlural: 'Родители / семьи',
    beneficiaryLabel: 'Ребёнок',
    beneficiaryLabelPlural: 'Дети',
    loopName: 'дети',
    contactRoles: ['Мать', 'Отец', 'Опекун'],
  },
  ul: {
    nested: true,
    memberLabel: 'Плательщик',
    memberLabelPlural: 'Плательщики',
    beneficiaryLabel: 'Сотрудник',
    beneficiaryLabelPlural: 'Сотрудники',
    loopName: 'сотрудники',
    contactRoles: ['Контактное лицо', 'Бухгалтер', 'Руководитель'],
  },
  to: {
    nested: true,
    memberLabel: 'Заказчик',
    memberLabelPlural: 'Заказчики',
    beneficiaryLabel: 'Турист',
    beneficiaryLabelPlural: 'Туристы',
    loopName: 'туристы',
    contactRoles: ['Контактное лицо', 'Сопровождающий'],
  },
}

// Поля бенефициаров (получателей путёвок) по воронкам. tag — имя метки для списка в Word.
export const BENEFICIARY_FIELDS = {
  fiz: [
    { key: 'fullName', label: 'ФИО ребёнка', type: 'text', tag: 'фио' },
    { key: 'birthDate', label: 'Дата рождения', type: 'date', tag: 'дата_рождения' },
    { key: 'birthCertNo', label: '№ свидетельства о рождении', type: 'text', tag: 'свидетельство' },
    { key: 'birthPlace', label: 'Место рождения', type: 'text', tag: 'место_рождения' },
    { key: 'citizenship', label: 'Гражданство', type: 'text', tag: 'гражданство' },
    { key: 'gender', label: 'Пол', type: 'select', options: ['М', 'Ж'], tag: 'пол' },
    { key: 'campId', label: 'Лагерь', type: 'camp', tag: 'лагерь' },
    { key: 'shiftId', label: 'Смена', type: 'shift', tag: 'смена' },
    { key: 'individualTicket', label: 'Индивид. билет', type: 'bool', tag: 'индив_билет' },
    { key: 'ticketPrice', label: 'Стоимость билета', type: 'money', tag: 'цена_билета' },
  ],
  ul: [
    { key: 'fullName', label: 'ФИО сотрудника', type: 'text', tag: 'фио' },
    { key: 'campId', label: 'Санаторий', type: 'camp', tag: 'санаторий' },
    { key: 'shiftId', label: 'Смена', type: 'shift', tag: 'смена' },
    { key: 'note', label: 'Примечание', type: 'text', tag: 'примечание' },
  ],
  to: [
    { key: 'fullName', label: 'ФИО туриста', type: 'text', tag: 'фио' },
    { key: 'birthDate', label: 'Дата рождения', type: 'date', tag: 'дата_рождения' },
    { key: 'isChild', label: 'Ребёнок (да/нет)', type: 'bool', tag: 'ребёнок' },
    { key: 'note', label: 'Примечание', type: 'text', tag: 'примечание' },
  ],
}

// Поля участника (плательщика / родителя)
export const MEMBER_FIELDS = [
  { key: 'label', label: 'Название', type: 'text' },
  { key: 'contractNo', label: '№ договора', type: 'text' },
  { key: 'amount', label: 'Сумма', type: 'money' },
  { key: 'paid', label: 'Оплачено', type: 'money' },
  { key: 'contractStatus', label: 'Статус договора', type: 'select', options: SIGN_STATUSES },
]

// Редактируемые поля корня сделки по воронкам
export const DEAL_FIELDS = {
  leads: [
    { key: 'title', label: 'Имя / название', type: 'text' },
    { key: 'phone', label: 'Телефон', type: 'text' },
    { key: 'source', label: 'Источник', type: 'source' },
    { key: 'manager', label: 'Ответственный', type: 'manager' },
    { key: 'note', label: 'Комментарий', type: 'textarea' },
  ],
  fiz: [
    { key: 'title', label: 'Название сделки', type: 'text' },
    { key: 'manager', label: 'Ответственный', type: 'manager' },
    { key: 'companyId', label: 'Плательщик (ЮЛ, если есть)', type: 'company' },
    { key: 'sourceContactId', label: 'Инициатор (напр. преподаватель)', type: 'contact' },
  ],
  ul: [
    { key: 'title', label: 'Название сделки', type: 'text' },
    { key: 'manager', label: 'Ответственный', type: 'manager' },
    { key: 'companyId', label: 'Компания-заказчик', type: 'company' },
    { key: 'payType', label: 'Тип оплаты', type: 'select', options: ['Предоплата', 'Постоплата'] },
  ],
  to: [
    { key: 'title', label: 'Название сделки', type: 'text' },
    { key: 'manager', label: 'Ответственный', type: 'manager' },
    { key: 'companyId', label: 'Компания-заказчик', type: 'company' },
    { key: 'tour', label: 'Тур (страна/город)', type: 'text' },
    { key: 'dates', label: 'Даты', type: 'text' },
    { key: 'region', label: 'Субъект РФ', type: 'text' },
  ],
}

// ── Источники данных для меток Word-шаблона ───────────────────────────────
// tag — каноническая метка для вставки в Word; group — раздел в каталоге полей.
export const DOC_SCALAR_SOURCES = [
  { path: 'deal.id', tag: 'номер_сделки', label: 'Номер сделки', group: 'Сделка' },
  { path: 'deal.title', tag: 'название_сделки', label: 'Название сделки', group: 'Сделка' },
  { path: 'deal.stage', tag: 'стадия', label: 'Стадия', group: 'Сделка' },
  { path: 'deal.amount', tag: 'сумма_сделки', label: 'Сумма сделки', money: true, group: 'Сделка' },
  { path: 'deal.paid', tag: 'оплачено_всего', label: 'Оплачено по сделке', money: true, group: 'Сделка' },
  { path: 'deal.manager', tag: 'менеджер', label: 'Ответственный менеджер', group: 'Сделка' },
  { path: 'deal.date', tag: 'дата', label: 'Дата (сегодня)', group: 'Сделка' },
  { path: 'company.name', tag: 'компания', label: 'Название', group: 'Компания-заказчик' },
  { path: 'company.inn', tag: 'инн_компании', label: 'ИНН', group: 'Компания-заказчик' },
  { path: 'company.kpp', tag: 'кпп_компании', label: 'КПП', group: 'Компания-заказчик' },
  { path: 'company.address', tag: 'адрес_компании', label: 'Адрес', group: 'Компания-заказчик' },
  { path: 'company.phone', tag: 'телефон_компании', label: 'Телефон', group: 'Компания-заказчик' },
  { path: 'our.name', tag: 'наше_юл', label: 'Название', group: 'Наше ЮЛ (исполнитель)' },
  { path: 'our.inn', tag: 'наш_инн', label: 'ИНН', group: 'Наше ЮЛ (исполнитель)' },
  { path: 'our.kpp', tag: 'наш_кпп', label: 'КПП', group: 'Наше ЮЛ (исполнитель)' },
  { path: 'our.address', tag: 'наш_адрес', label: 'Адрес', group: 'Наше ЮЛ (исполнитель)' },
  { path: 'member.label', tag: 'участник', label: 'Название участника', scope: 'member', group: 'Договор / участник' },
  { path: 'member.contractNo', tag: 'номер_договора', label: 'Номер договора', scope: 'member', group: 'Договор / участник' },
  { path: 'member.amount', tag: 'сумма', label: 'Сумма по договору', money: true, scope: 'member', group: 'Договор / участник' },
  { path: 'member.paid', tag: 'оплата', label: 'Оплачено по договору', money: true, scope: 'member', group: 'Договор / участник' },
  { path: 'mother.fullName', tag: 'фио_матери', label: 'Мать · ФИО', scope: 'member', group: 'Родитель / контакт' },
  { path: 'mother.phone', tag: 'телефон_матери', label: 'Мать · телефон', scope: 'member', group: 'Родитель / контакт' },
  { path: 'father.fullName', tag: 'фио_отца', label: 'Отец · ФИО', scope: 'member', group: 'Родитель / контакт' },
  { path: 'father.phone', tag: 'телефон_отца', label: 'Отец · телефон', scope: 'member', group: 'Родитель / контакт' },
  { path: 'contact.fullName', tag: 'фио_родителя', label: 'Родитель/контакт · ФИО', scope: 'member', group: 'Родитель / контакт' },
  { path: 'contact.phone', tag: 'телефон_родителя', label: 'Родитель/контакт · телефон', scope: 'member', group: 'Родитель / контакт' },
]

export function scalarSourceByPath(path) {
  return DOC_SCALAR_SOURCES.find((s) => s.path === path)
}

// Порядок групп в каталоге полей
export const DOC_GROUPS = ['Сделка', 'Компания-заказчик', 'Наше ЮЛ (исполнитель)', 'Договор / участник', 'Родитель / контакт']

// ── Авто-сопоставление меток с полями (точное совпадение → нечёткое) ──────
const norm = (s) => String(s || '').toLowerCase().replace(/[_\s.]+/g, '')

export function autoScalarPath(tag) {
  const t = norm(tag)
  const exact = DOC_SCALAR_SOURCES.find((s) => norm(s.tag) === t)
  if (exact) return exact.path
  for (const s of DOC_SCALAR_SOURCES) {
    const hay = norm(s.label + s.path + s.tag)
    if (hay.includes(t) || t.includes(norm(s.path.split('.').pop()))) return s.path
  }
  return ''
}

export function autoBenKey(tag, funnelKind) {
  const t = norm(tag)
  const fields = BENEFICIARY_FIELDS[funnelKind] || []
  const exact = fields.find((f) => norm(f.tag) === t)
  if (exact) return exact.key
  const hit = fields.find((f) => norm(f.label).includes(t) || t.includes(norm(f.key)))
  return hit?.key || fields[0]?.key || ''
}

export function buildAutoMapping(tags, loops, funnelKind) {
  const mapping = {}
  ;(tags || []).forEach((t) => { mapping[t] = autoScalarPath(t) })
  const loopMapping = {}
  Object.entries(loops || {}).forEach(([ln, inner]) => {
    loopMapping[ln] = { source: 'beneficiaries', fields: {} }
    ;(inner || []).forEach((it) => { loopMapping[ln].fields[it] = autoBenKey(it, funnelKind) })
  })
  return { mapping, loopMapping }
}
