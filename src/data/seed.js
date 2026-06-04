// ─────────────────────────────────────────────────────────────────────────
// Сид демо-данных РЦТО. Реестры + воронки + сделки со вложенной структурой
// (сделка → участники → бенефициары). Сохраняется в localStorage стором.
// ─────────────────────────────────────────────────────────────────────────

export const MANAGERS = {
  shutova: { name: 'Екатерина Шутова', initials: 'ЕШ', color: '#1f47f5' },
  ruslan: { name: 'Руслан Ахметов', initials: 'РА', color: '#0ea5a3' },
  anna: { name: 'Анна Котова', initials: 'АК', color: '#d9488a' },
  dmitry: { name: 'Дмитрий Орлов', initials: 'ДО', color: '#e08a16' },
}

export const SOURCES = {
  vk: { label: 'Группа ВК', color: '#3f67ff' },
  site: { label: 'Сайт (Дизайн18)', color: '#0ea5a3' },
  call: { label: 'Звонок', color: '#e08a16' },
  teachers: { label: 'Педагоги', color: '#7c5cff' },
  street: { label: 'С улицы', color: '#5b6479' },
}

const A = {
  blue: '#3f67ff', cyan: '#0ea5a3', teal: '#10b3c6', violet: '#7c5cff',
  amber: '#e08a16', pink: '#d9488a', slate: '#5b6479', green: '#84cc16', rose: '#f0654a',
}

// ── РЕЕСТР: компании ─────────────────────────────────────────────────────
export const SEED_COMPANIES = [
  { id: 'co-rcto', name: 'АНО «РЦТО Удмуртской Республики»', type: 'our', inn: '1831100000', kpp: '183101001', phone: '+7 3412 90-30-30', email: 'info@rcto.ru', address: 'г. Ижевск, ул. Пушкинская, 228' },
  { id: 'co-granit', name: 'ООО «Гранит»', type: 'client', inn: '1832050050', kpp: '183201001', phone: '+7 3412 55-18-90', email: 'office@granit18.ru', address: 'г. Ижевск, ул. Ленина, 5' },
  { id: 'co-izhstal', name: 'АО «Ижсталь»', type: 'client', inn: '1826000655', kpp: '184001001', phone: '+7 3412 91-20-11', email: 'kadry@izhstal.ru', address: 'г. Ижевск, ул. Новоажимова, 6' },
  { id: 'co-vodokanal', name: 'МУП «Ижводоканал»', type: 'client', inn: '1834016809', kpp: '184101001', phone: '+7 3412 44-71-02', email: 'info@izhvodokanal.ru', address: 'г. Ижевск, ул. Кирова, 113' },
  { id: 'co-kupol', name: 'АО «ИЭМЗ Купол»', type: 'client', inn: '1831083343', kpp: '184101001', phone: '+7 3412 72-30-00', email: 'kupol@kupol.ru', address: 'г. Ижевск, ул. Песочная, 3' },
  { id: 'co-vostok', name: 'ООО «Восток-Агро»', type: 'client', inn: '1840012345', kpp: '184001001', phone: '+7 3412 30-44-55', email: 'agro@vostok.ru', address: 'УР, с. Завьялово' },
  { id: 'co-school24', name: 'МБОУ «СОШ №24»', type: 'client', inn: '1835045678', kpp: '183501001', phone: '+7 3412 21-44-09', email: 'school24@izh.ru', address: 'г. Ижевск, ул. Холмогорова, 11' },
  { id: 'co-gymn56', name: 'МБОУ «Гимназия №56»', type: 'client', inn: '1835050011', kpp: '183501001', phone: '+7 3412 36-70-12', email: 'gymn56@izh.ru', address: 'г. Ижевск, ул. 9 Января, 219' },
  { id: 'co-meridian', name: 'ООО «ТК Меридиан»', type: 'client', inn: '1840099887', kpp: '184001001', phone: '+7 3412 50-11-77', email: 'tk@meridian.ru', address: 'г. Ижевск, ул. Удмуртская, 304' },
]

// ── РЕЕСТР: контакты ─────────────────────────────────────────────────────
export const SEED_CONTACTS = [
  { id: 'ct-belyaev-f', fullName: 'Беляев Андрей Петрович', role: 'Отец', phone: '+7 982 990 14 22', email: 'belyaev@mail.ru' },
  { id: 'ct-belyaeva-m', fullName: 'Беляева Марина Сергеевна', role: 'Мать', phone: '+7 982 990 77 30', email: '' },
  { id: 'ct-zorin-f', fullName: 'Зорин Павел Олегович', role: 'Отец', phone: '+7 912 333 90 41', email: '' },
  { id: 'ct-semenova-m', fullName: 'Семёнова Юлия Александровна', role: 'Мать', phone: '+7 950 771 22 18', email: '' },
  { id: 'ct-nazarov-f', fullName: 'Назаров Олег Викторович', role: 'Отец', phone: '+7 950 600 12 84', email: '' },
  { id: 'ct-chirkova', fullName: 'Чиркова Светлана Ивановна', role: 'Преподаватель', phone: '+7 904 312 77 05', email: 'chirkova@school24.ru', companyId: 'co-school24' },
  { id: 'ct-ivanov-f', fullName: 'Иванов Сергей Николаевич', role: 'Отец', phone: '+7 919 100 20 30', email: '' },
  { id: 'ct-ivanova-m', fullName: 'Иванова Ольга Петровна', role: 'Мать', phone: '+7 919 100 20 31', email: '' },
  { id: 'ct-petrova-m', fullName: 'Петрова Анна Викторовна', role: 'Мать', phone: '+7 904 250 11 88', email: '' },
  { id: 'ct-sidorov-f', fullName: 'Сидоров Дмитрий Алексеевич', role: 'Отец', phone: '+7 982 700 55 12', email: '' },
  { id: 'ct-izhstal', fullName: 'Громова Татьяна (АО Ижсталь)', role: 'Контактное лицо', phone: '+7 3412 91-20-15', email: 'kadry@izhstal.ru', companyId: 'co-izhstal' },
  { id: 'ct-kupol', fullName: 'Белых Игорь (АО Купол)', role: 'Контактное лицо', phone: '+7 3412 72-30-12', email: 'kupol@kupol.ru', companyId: 'co-kupol' },
  { id: 'ct-vostok', fullName: 'Шаймарданов Р. (Восток-Агро)', role: 'Руководитель', phone: '+7 3412 30-44-55', email: 'agro@vostok.ru', companyId: 'co-vostok' },
  { id: 'ct-school24', fullName: 'Зайцева М. (СОШ №24)', role: 'Контактное лицо', phone: '+7 3412 21-44-09', email: 'school24@izh.ru', companyId: 'co-school24' },
  { id: 'ct-meridian', fullName: 'Корепанов А. (ТК Меридиан)', role: 'Контактное лицо', phone: '+7 3412 50-11-77', email: 'tk@meridian.ru', companyId: 'co-meridian' },
]

// ── РЕЕСТР: лагеря и санатории ───────────────────────────────────────────
export const SEED_CAMPS = [
  { id: 'cmp-leb', name: 'Лебяжий берег', kind: 'Лагерь', location: 'Азовское море', address: 'Краснодарский край, ст. Голубицкая' },
  { id: 'cmp-orange', name: 'Оранжевое настроение', kind: 'Лагерь', location: 'лес под Ижевском', address: 'УР, Завьяловский р-н' },
  { id: 'san-metal', name: 'Санаторий «Металлург»', kind: 'Санаторий', location: 'УР', address: 'г. Ижевск' },
  { id: 'san-udm', name: 'Санаторий «Удмуртия»', kind: 'Санаторий', location: 'УР', address: 'г. Ижевск' },
  { id: 'san-varzi', name: 'Санаторий «Варзи-Ятчи»', kind: 'Санаторий', location: 'УР', address: 'УР, Алнашский р-н' },
]

// ── РЕЕСТР: смены ────────────────────────────────────────────────────────
export const SEED_SHIFTS = [
  { id: 'sh-leb-1', campId: 'cmp-leb', name: '1 смена', dateStart: '01.06.2026', dateEnd: '21.06.2026', price: 62000, capacity: 200, booked: 140 },
  { id: 'sh-leb-2', campId: 'cmp-leb', name: '2 смена', dateStart: '24.06.2026', dateEnd: '14.07.2026', price: 62000, capacity: 200, booked: 165 },
  { id: 'sh-leb-3', campId: 'cmp-leb', name: '3 смена', dateStart: '17.07.2026', dateEnd: '06.08.2026', price: 62000, capacity: 200, booked: 90 },
  { id: 'sh-or-1', campId: 'cmp-orange', name: '1 смена', dateStart: '02.06.2026', dateEnd: '15.06.2026', price: 48500, capacity: 150, booked: 120 },
  { id: 'sh-or-2', campId: 'cmp-orange', name: '2 смена', dateStart: '18.06.2026', dateEnd: '01.07.2026', price: 48500, capacity: 150, booked: 80 },
  { id: 'sh-metal-1', campId: 'san-metal', name: 'Заезд июнь', dateStart: '05.06.2026', dateEnd: '25.06.2026', price: 46000, capacity: 300, booked: 210 },
  { id: 'sh-udm-1', campId: 'san-udm', name: 'Заезд июль', dateStart: '01.07.2026', dateEnd: '21.07.2026', price: 44000, capacity: 250, booked: 130 },
  { id: 'sh-varzi-1', campId: 'san-varzi', name: 'Заезд июнь', dateStart: '10.06.2026', dateEnd: '30.06.2026', price: 45000, capacity: 200, booked: 88 },
]

// ── Воронки и стадии ─────────────────────────────────────────────────────
const leadStages = [
  { id: 'new', name: 'Новый лид', accent: A.blue, hint: 'Сюда падают все входящие обращения: ВК, сайт, звонки, педагоги, с улицы.' },
  { id: 'work', name: 'Взято в работу', accent: A.cyan, hint: 'Менеджер берёт лид в работу, квалифицирует и выбирает направление сделки.' },
  { id: 'qualified', name: 'Квалифицирован', accent: A.green, kind: 'win', hint: 'Лид целевой — конвертируется в сделку нужной воронки.' },
  { id: 'rejected', name: 'Не целевой', accent: A.rose, kind: 'lost', hint: 'Прописать причины отказа.' },
]
const fizStages = [
  { id: 'work', name: 'Взято в работу', accent: A.blue, hint: 'Указываем лагерь.' },
  { id: 'forming', name: 'Формирование путёвок', accent: A.cyan, hint: 'Указываем наше ЮР-лицо. Список всех путёвок с родителями и детьми.' },
  { id: 'contract', name: 'Заключение договора', accent: A.teal, hint: 'Договор + счёт. ФИО, дата рождения, № свидетельства, гражданство. В 1С — контрагент, № договора и счёта.' },
  { id: 'invoiced', name: 'Договор заключён / счёт', accent: A.violet, hint: 'Фиксируется сумма. Договор с лагерем, согласие на мед.вмешательство, памятка. Контроль 100% оплаты.' },
  { id: 'paid', name: 'Оплачено', accent: A.amber, hint: 'Заполняется номер путёвки. Подписывается договор, УПД, акт.' },
  { id: 'issued', name: 'Выписана путёвка', accent: A.pink, hint: 'ЖД-билеты, согласование автобусов. В лагере отмечают прибытие.' },
  { id: 'arrived', name: 'Прибыл в лагерь', accent: A.green, kind: 'win', hint: 'Ребёнок заехал на смену.' },
  { id: 'recalc', name: 'Выезд / Перерасчёт', accent: A.slate, hint: 'Дата/время выезда и причина. Шаблоны заявлений → в WhatsApp.' },
  { id: 'refund', name: 'Полный возврат', accent: A.rose, kind: 'lost', hint: 'Полный возврат средств клиенту.' },
]
const ulStages = [
  { id: 'work', name: 'Взято в работу', accent: A.blue, hint: 'Заполняем наименование организации.' },
  { id: 'kp', name: 'КП', accent: A.cyan, hint: 'Формируем КП, отправляем клиенту.' },
  { id: 'booking', name: 'Бронирование', accent: A.teal, hint: 'Дата заезда. Учитывать бронь ЮЛ/ДОЛ/санатория по сменам.' },
  { id: 'procurement', name: 'Закупка', accent: A.violet, hint: 'Сквозная нумерация путёвок санатория. Журнал выдачи.' },
  { id: 'contract', name: 'Заключение договора', accent: A.amber, hint: 'ЮЛ, от которого подписываем. Тип оплаты. В 1С — контрагент, № договора и счёта.' },
  { id: 'signed', name: 'Договор заключён', accent: A.pink, hint: 'Фиксируем сумму и кол-во путёвок. Контроль 100% оплаты.' },
  { id: 'shipment', name: 'Отгрузка', accent: A.slate, hint: 'Даты заезда по всем путёвкам. Перенос сроков.' },
  { id: 'closed', name: 'Смены закрыты', accent: A.green, kind: 'win', hint: 'Все путёвки реализованы.' },
]
const toStages = [
  { id: 'work', name: 'Взято в работу', accent: A.blue, hint: 'Заполняем наименование организации.' },
  { id: 'calc', name: 'Расчёт', accent: A.cyan, hint: 'Производим расчёт тура.' },
  { id: 'kp', name: 'Отправлено КП', accent: A.teal, hint: 'Формируем КП, отправляем клиенту.' },
  { id: 'agreed', name: 'Согласие получено', accent: A.violet, hint: 'ЮЛ, от которого подписываем документы.' },
  { id: 'contract', name: 'Договор заключён', accent: A.amber, hint: 'Договор подписан.' },
  { id: 'prepaid', name: 'Предоплата получена', accent: A.pink, hint: 'Фиксируем сумму и кол-во путёвок.' },
  { id: 'booking', name: 'Бронирование', accent: A.slate, hint: 'Даты, кол-во взр/детей, объект, субъект РФ, наименование тура.' },
  { id: 'fullpaid', name: 'Полная оплата получена', accent: A.teal, hint: 'За неделю до тура — напоминание.' },
  { id: 'acts', name: 'Акты получены', accent: A.green, kind: 'win', hint: 'Закрывающие документы получены.' },
]

export const FUNNELS = [
  { id: 'leads', name: 'Лиды', icon: 'inbox', accent: '#3f67ff', stages: leadStages, kind: 'leads' },
  { id: 'fiz', name: 'Физ лица', icon: 'user', accent: '#0ea5a3', stages: fizStages, kind: 'fiz' },
  { id: 'ul', name: 'ЮЛ · РЦТО', icon: 'building', accent: '#7c5cff', stages: ulStages, kind: 'ul' },
  { id: 'to', name: 'ТО · Туры', icon: 'globe', accent: '#e08a16', stages: toStages, kind: 'to' },
]

// helpers для краткой записи бенефициаров
const child = (fullName, birthDate, certNo, campId, shiftId, price) => ({
  id: 'b-' + Math.random().toString(36).slice(2, 8),
  fullName, birthDate, birthCertNo: certNo, birthPlace: 'г. Ижевск', citizenship: 'РФ',
  gender: 'М', campId, shiftId, individualTicket: false, ticketPrice: price || 0,
})
const emp = (fullName, campId, shiftId) => ({ id: 'b-' + Math.random().toString(36).slice(2, 8), fullName, campId, shiftId, note: '' })

// ── СДЕЛКИ ───────────────────────────────────────────────────────────────
export const SEED_DEALS = {
  leads: [
    { id: 'L-1041', funnelId: 'leads', stageId: 'new', title: 'Марина Гусева', source: 'vk', phone: '+7 950 163 08 41', manager: 'shutova', createdAt: '2 ч назад', note: 'Спрашивает про смены в «Лебяжий берег» на июль', amount: null, paid: null },
    { id: 'L-1042', funnelId: 'leads', stageId: 'new', title: 'Ольга Пермякова', source: 'site', phone: '+7 912 764 39 72', manager: 'shutova', createdAt: '3 ч назад', note: 'Заявка с формы на сайте, двое детей', amount: null, paid: null },
    { id: 'L-1043', funnelId: 'leads', stageId: 'work', title: 'ООО «Гранит»', source: 'call', phone: '+7 3412 55-18-90', manager: 'ruslan', createdAt: 'сегодня', note: 'Закупка путёвок для сотрудников — направить в РЦТО', amount: null, paid: null },
    { id: 'L-1044', funnelId: 'leads', stageId: 'work', title: 'Светлана Чиркова', source: 'teachers', phone: '+7 904 312 77 05', manager: 'anna', createdAt: 'вчера', note: 'Преподаватель, группа детей в лагерь', amount: null, paid: null },
    { id: 'L-1045', funnelId: 'leads', stageId: 'qualified', title: 'Андрей Беляев', source: 'vk', phone: '+7 982 990 14 22', manager: 'shutova', createdAt: 'вчера', note: '→ Физ лица. «Оранжевое настроение», 2 смена', amount: null, paid: null },
    { id: 'L-1046', funnelId: 'leads', stageId: 'rejected', title: 'Иван Лукин', source: 'street', phone: '+7 919 901 60 33', manager: 'dmitry', createdAt: '2 дня назад', note: 'Причина: не подошли даты смен', amount: null, paid: null },
  ],
  fiz: [
    {
      id: 'Ф-2207', funnelId: 'fiz', stageId: 'work', title: 'Беляев Андрей — путёвка', manager: 'shutova', companyId: null, sourceContactId: null,
      members: [{ id: 'm-2207', label: 'Семья Беляевых', contactIds: ['ct-belyaev-f', 'ct-belyaeva-m'], contractNo: '', contractStatus: 'Нет', amount: 48500, paid: 0, beneficiaries: [child('Беляев Кирилл Андреевич', '14.05.2014', 'IV-НИ № 553201', 'cmp-orange', 'sh-or-2', 0)] }],
    },
    {
      id: 'Ф-2209', funnelId: 'fiz', stageId: 'contract', title: 'Зорин Павел — путёвка', manager: 'shutova', companyId: null, sourceContactId: null,
      members: [{ id: 'm-2209', label: 'Семья Зориных', contactIds: ['ct-zorin-f'], contractNo: 'Д-2209', contractStatus: 'Черновик', amount: 62000, paid: 0, beneficiaries: [child('Зорин Матвей Павлович', '21.01.2011', 'IV-НИ № 410877', 'cmp-leb', 'sh-leb-1', 0)] }],
    },
    {
      id: 'Ф-GRP-01', funnelId: 'fiz', stageId: 'invoiced', title: 'Группа СОШ №24 (Чиркова)', manager: 'anna', companyId: null, sourceContactId: 'ct-chirkova',
      members: [
        { id: 'm-grp-1', label: 'Семья Ивановых', contactIds: ['ct-ivanov-f', 'ct-ivanova-m'], contractNo: 'Д-1180', contractStatus: 'Подписан', amount: 124000, paid: 124000, beneficiaries: [child('Иванов Артём Сергеевич', '03.07.2012', 'IV-НИ № 600121', 'cmp-leb', 'sh-leb-2', 0), child('Иванова Виктория Сергеевна', '15.09.2014', 'IV-НИ № 600122', 'cmp-leb', 'sh-leb-2', 0)] },
        { id: 'm-grp-2', label: 'Семья Петровых', contactIds: ['ct-petrova-m'], contractNo: 'Д-1181', contractStatus: 'На подписании', amount: 48500, paid: 20000, beneficiaries: [child('Петров Илья Дмитриевич', '22.04.2013', 'IV-НИ № 600130', 'cmp-orange', 'sh-or-2', 0)] },
        { id: 'm-grp-3', label: 'Семья Сидоровых', contactIds: ['ct-sidorov-f'], contractNo: 'Д-1182', contractStatus: 'Сформирован', amount: 62000, paid: 0, beneficiaries: [child('Сидоров Глеб Дмитриевич', '11.02.2011', 'IV-НИ № 600140', 'cmp-leb', 'sh-leb-3', 0)] },
      ],
    },
    {
      id: 'Ф-2213', funnelId: 'fiz', stageId: 'arrived', title: 'Назаров Олег — путёвка', manager: 'dmitry', companyId: null, sourceContactId: null,
      members: [{ id: 'm-2213', label: 'Семья Назаровых', contactIds: ['ct-nazarov-f'], contractNo: 'Д-2213', contractStatus: 'Подписан', amount: 62000, paid: 62000, beneficiaries: [child('Назаров Лев Олегович', '19.06.2011', 'IV-НИ № 480090', 'cmp-leb', 'sh-leb-1', 0)] }],
    },
  ],
  ul: [
    {
      id: 'Ю-3110', funnelId: 'ul', stageId: 'work', title: 'АО «Ижсталь» — санаторий', manager: 'ruslan', companyId: 'co-izhstal', payType: 'Предоплата',
      members: [{ id: 'm-3110', label: 'АО «Ижсталь»', contactIds: ['ct-izhstal'], contractNo: '', contractStatus: 'Нет', amount: 1840000, paid: 0, beneficiaries: [emp('Кузнецов И. И.', 'san-metal', 'sh-metal-1'), emp('Смирнов П. А.', 'san-metal', 'sh-metal-1')] }],
    },
    {
      id: 'Ю-3114', funnelId: 'ul', stageId: 'contract', title: 'АО «Купол» — санаторий', manager: 'dmitry', companyId: 'co-kupol', payType: 'Предоплата',
      members: [{ id: 'm-3114', label: 'АО «ИЭМЗ Купол»', contactIds: ['ct-kupol'], contractNo: 'Д-3114', contractStatus: 'На подписании', amount: 2200000, paid: 1100000, beneficiaries: [emp('Белых А. В.', 'san-udm', 'sh-udm-1')] }],
    },
    {
      id: 'Ю-3115', funnelId: 'ul', stageId: 'signed', title: 'ООО «Восток-Агро» — санаторий', manager: 'ruslan', companyId: 'co-vostok', payType: 'Предоплата',
      members: [{ id: 'm-3115', label: 'ООО «Восток-Агро»', contactIds: ['ct-vostok'], contractNo: 'Д-3115', contractStatus: 'Подписан', amount: 990000, paid: 990000, beneficiaries: [emp('Иванова З. К.', 'san-varzi', 'sh-varzi-1')] }],
    },
  ],
  to: [
    {
      id: 'Т-4055', funnelId: 'to', stageId: 'work', title: 'СОШ №24 — Казань', manager: 'anna', companyId: 'co-school24', tour: 'Казань · 3 дня', dates: '12–14 окт', region: 'Респ. Татарстан',
      members: [{ id: 'm-4055', label: 'МБОУ «СОШ №24»', contactIds: ['ct-school24'], contractNo: '', contractStatus: 'Нет', amount: 392000, paid: 0, beneficiaries: [{ id: 'b-4055a', fullName: 'Группа 7А (28 детей)', birthDate: '', isChild: true, note: 'списком' }] }],
    },
    {
      id: 'Т-4059', funnelId: 'to', stageId: 'prepaid', title: 'Профсоюз УР — Абхазия', manager: 'dmitry', companyId: 'co-vostok', tour: 'Абхазия · 8 дней', dates: '01–08 дек', region: 'Респ. Абхазия',
      members: [{ id: 'm-4059', label: 'ППО «Восток-Агро»', contactIds: ['ct-vostok'], contractNo: 'Д-4059', contractStatus: 'Подписан', amount: 2430000, paid: 1215000, beneficiaries: [{ id: 'b-4059a', fullName: 'Шаймарданов Р. Р.', birthDate: '12.03.1980', isChild: false, note: '' }] }],
    },
    {
      id: 'Т-4061', funnelId: 'to', stageId: 'fullpaid', title: 'ТК Меридиан — Кисловодск', manager: 'dmitry', companyId: 'co-meridian', tour: 'Кисловодск · 10 дней', dates: '08–18 дек', region: 'Ставропольский край',
      members: [{ id: 'm-4061', label: 'ООО «ТК Меридиан»', contactIds: ['ct-meridian'], contractNo: 'Д-4061', contractStatus: 'Подписан', amount: 2080000, paid: 2080000, beneficiaries: [{ id: 'b-4061a', fullName: 'Корепанов А. Н.', birthDate: '05.05.1975', isChild: false, note: '' }] }],
    },
  ],
}

// ── Форматирование денег ─────────────────────────────────────────────────
export function formatMoney(n) {
  if (n == null || n === '') return '—'
  return new Intl.NumberFormat('ru-RU').format(Number(n)) + ' ₽'
}
export function formatMoneyShort(n) {
  if (n == null) return '—'
  n = Number(n)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + ' млн ₽'
  if (n >= 1_000) return Math.round(n / 1000) + ' тыс ₽'
  return n + ' ₽'
}

export function buildInitialState() {
  return {
    companies: SEED_COMPANIES.map((x) => ({ ...x })),
    contacts: SEED_CONTACTS.map((x) => ({ ...x })),
    camps: SEED_CAMPS.map((x) => ({ ...x })),
    shifts: SEED_SHIFTS.map((x) => ({ ...x })),
    deals: JSON.parse(JSON.stringify(SEED_DEALS)),
    templates: [],
    documents: [],
  }
}
