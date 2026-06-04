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

// Поля бенефициаров (получателей путёвок) по воронкам
export const BENEFICIARY_FIELDS = {
  fiz: [
    { key: 'fullName', label: 'ФИО ребёнка', type: 'text' },
    { key: 'birthDate', label: 'Дата рождения', type: 'date' },
    { key: 'birthCertNo', label: '№ свидетельства о рождении', type: 'text' },
    { key: 'birthPlace', label: 'Место рождения', type: 'text' },
    { key: 'citizenship', label: 'Гражданство', type: 'text' },
    { key: 'gender', label: 'Пол', type: 'select', options: ['М', 'Ж'] },
    { key: 'campId', label: 'Лагерь', type: 'camp' },
    { key: 'shiftId', label: 'Смена', type: 'shift' },
    { key: 'individualTicket', label: 'Индивид. билет', type: 'bool' },
    { key: 'ticketPrice', label: 'Стоимость билета', type: 'money' },
  ],
  ul: [
    { key: 'fullName', label: 'ФИО сотрудника', type: 'text' },
    { key: 'campId', label: 'Санаторий', type: 'camp' },
    { key: 'shiftId', label: 'Смена', type: 'shift' },
    { key: 'note', label: 'Примечание', type: 'text' },
  ],
  to: [
    { key: 'fullName', label: 'ФИО туриста', type: 'text' },
    { key: 'birthDate', label: 'Дата рождения', type: 'date' },
    { key: 'isChild', label: 'Ребёнок', type: 'bool' },
    { key: 'note', label: 'Примечание', type: 'text' },
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

// ── Источники данных для тегов Word-шаблона ───────────────────────────────
// scope: 'deal' — доступно всегда; 'member' — когда документ формируется по участнику.
export const DOC_SCALAR_SOURCES = [
  { path: 'deal.id', label: 'Сделка · номер' },
  { path: 'deal.title', label: 'Сделка · название' },
  { path: 'deal.stage', label: 'Сделка · стадия' },
  { path: 'deal.amount', label: 'Сделка · сумма', money: true },
  { path: 'deal.paid', label: 'Сделка · оплачено', money: true },
  { path: 'deal.manager', label: 'Ответственный менеджер' },
  { path: 'deal.date', label: 'Дата (сегодня)' },
  { path: 'company.name', label: 'Компания-заказчик · название' },
  { path: 'company.inn', label: 'Компания · ИНН' },
  { path: 'company.kpp', label: 'Компания · КПП' },
  { path: 'company.address', label: 'Компания · адрес' },
  { path: 'company.phone', label: 'Компания · телефон' },
  { path: 'our.name', label: 'Наше ЮЛ · название' },
  { path: 'our.inn', label: 'Наше ЮЛ · ИНН' },
  { path: 'our.kpp', label: 'Наше ЮЛ · КПП' },
  { path: 'our.address', label: 'Наше ЮЛ · адрес' },
  { path: 'member.label', label: 'Участник · название', scope: 'member' },
  { path: 'member.contractNo', label: 'Договор · номер', scope: 'member' },
  { path: 'member.amount', label: 'Участник · сумма', money: true, scope: 'member' },
  { path: 'member.paid', label: 'Участник · оплачено', money: true, scope: 'member' },
  { path: 'mother.fullName', label: 'Мать · ФИО', scope: 'member' },
  { path: 'mother.phone', label: 'Мать · телефон', scope: 'member' },
  { path: 'father.fullName', label: 'Отец · ФИО', scope: 'member' },
  { path: 'father.phone', label: 'Отец · телефон', scope: 'member' },
  { path: 'contact.fullName', label: 'Контакт · ФИО', scope: 'member' },
  { path: 'contact.phone', label: 'Контакт · телефон', scope: 'member' },
]

export function scalarSourceByPath(path) {
  return DOC_SCALAR_SOURCES.find((s) => s.path === path)
}
