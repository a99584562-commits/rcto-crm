// ─────────────────────────────────────────────────────────────────────────
// Модель данных демо-CRM РЦТО.
// Структура и подсказки на стадиях взяты напрямую из схем бизнес-процесса:
// лиды → физ.лица → ЮЛ/РЦТО (санатории) → ТО (туроператор).
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
  blue: '#3f67ff',
  cyan: '#0ea5a3',
  teal: '#10b3c6',
  violet: '#7c5cff',
  amber: '#e08a16',
  pink: '#d9488a',
  slate: '#5b6479',
  green: '#84cc16',
  rose: '#f0654a',
}

// ── ВОРОНКА 1 · ЛИДЫ ─────────────────────────────────────────────────────
const leadStages = [
  {
    id: 'new',
    name: 'Новый лид',
    accent: A.blue,
    hint: 'Сюда падают все входящие обращения: ВК, сайт, звонки, педагоги, с улицы.',
  },
  {
    id: 'work',
    name: 'Взято в работу',
    accent: A.cyan,
    hint: 'Менеджер берёт лид в работу, связывается с клиентом, квалифицирует и выбирает направление сделки (Физ лица, РЦТО, ТО).',
  },
  { id: 'qualified', name: 'Квалифицирован', accent: A.green, kind: 'win', hint: 'Лид целевой — конвертируется в сделку нужной воронки.' },
  { id: 'rejected', name: 'Не целевой', accent: A.rose, kind: 'lost', hint: 'Прописать причины отказа.' },
]

const leadDeals = [
  { id: 'L-1041', stageId: 'new', title: 'Марина Гусева', source: 'vk', phone: '+7 950 163 08 41', manager: 'shutova', createdAt: '2 ч назад', note: 'Спрашивает про смены в «Лебяжий берег» на июль' },
  { id: 'L-1042', stageId: 'new', title: 'Ольга Пермякова', source: 'site', phone: '+7 912 764 39 72', manager: 'shutova', createdAt: '3 ч назад', note: 'Заявка с формы на сайте, двое детей' },
  { id: 'L-1043', stageId: 'work', title: 'ООО «Гранит»', source: 'call', phone: '+7 3412 55-18-90', manager: 'ruslan', createdAt: 'сегодня', note: 'Закупка путёвок для сотрудников — направить в РЦТО' },
  { id: 'L-1044', stageId: 'work', title: 'Светлана Чиркова', source: 'teachers', phone: '+7 904 312 77 05', manager: 'anna', createdAt: 'вчера', note: 'Рекомендация от педагога, тур по Удмуртии' },
  { id: 'L-1045', stageId: 'qualified', title: 'Андрей Беляев', source: 'vk', phone: '+7 982 990 14 22', manager: 'shutova', createdAt: 'вчера', note: '→ Физ лица. «Оранжевое настроение», 2 смена' },
  { id: 'L-1046', stageId: 'rejected', title: 'Иван Лукин', source: 'street', phone: '+7 919 901 60 33', manager: 'dmitry', createdAt: '2 дня назад', note: 'Причина: не подошли даты смен' },
]

// ── ВОРОНКА 2 · ФИЗ ЛИЦА ─────────────────────────────────────────────────
const fizStages = [
  { id: 'work', name: 'Взято в работу', accent: A.blue, hint: 'Указываем лагерь.' },
  {
    id: 'forming',
    name: 'Формирование путёвок',
    accent: A.cyan,
    hint: 'Указываем наше ЮР-лицо. Формируем список всех путёвок с родителями и детьми, загружаем для формирования документов. Настроить шаблоны документов и онлайн-подписание.',
  },
  {
    id: 'contract',
    name: 'Заключение договора',
    accent: A.teal,
    hint: 'Договор + счёт, фиксируем стоимость билета. Список: ФИО, дата рождения, № свидетельства о рождении, место рождения, гражданство, м/д. В 1С уходит контрагент, № договора и счёта (ID смарта).',
  },
  {
    id: 'invoiced',
    name: 'Договор заключён / счёт',
    accent: A.violet,
    hint: 'Фиксируется сумма оплаты. Высылается договор с лагерем, согласие на мед. вмешательство и памятка. Оплат бывает несколько — контролируем остаток и 100% оплату.',
  },
  { id: 'paid', name: 'Оплачено', accent: A.amber, hint: 'Заполняется номер путёвки. Подписывается договор, УПД, акт.' },
  { id: 'issued', name: 'Выписана путёвка', accent: A.pink, hint: 'Покупка ЖД-билетов, согласование автобусов. В лагере отмечают прибытие.' },
  { id: 'arrived', name: 'Прибыл в лагерь', accent: A.green, kind: 'win', hint: 'Ребёнок заехал на смену.' },
  { id: 'recalc', name: 'Выезд / Перерасчёт', accent: A.slate, hint: 'Заполняется дата/время выезда и причина. Шаблоны заявлений → в WhatsApp.' },
  { id: 'refund', name: 'Полный возврат', accent: A.rose, kind: 'lost', hint: 'Полный возврат средств клиенту.' },
]

const fizDeals = [
  { id: 'Ф-2207', stageId: 'work', title: 'Беляев Андрей', child: 'Беляев Кирилл', birth: '14.05.2014', camp: 'Оранжевое настроение', shift: '2 смена', amount: 48500, phone: '+7 982 990 14 22', manager: 'shutova', paid: 0 },
  { id: 'Ф-2208', stageId: 'forming', title: 'Семёнова Юлия', child: 'Семёнова Алиса', birth: '02.09.2012', camp: 'Лебяжий берег', shift: '3 смена', amount: 62000, phone: '+7 950 771 22 18', manager: 'anna', paid: 0 },
  { id: 'Ф-2209', stageId: 'contract', title: 'Зорин Павел', child: 'Зорин Матвей', birth: '21.01.2011', camp: 'Лебяжий берег', shift: '1 смена', amount: 62000, phone: '+7 912 333 90 41', manager: 'shutova', paid: 0 },
  { id: 'Ф-2210', stageId: 'invoiced', title: 'Кузьмина Дарья', child: 'Кузьмина София', birth: '30.07.2013', camp: 'Оранжевое настроение', shift: '2 смена', amount: 48500, phone: '+7 904 100 55 67', manager: 'dmitry', paid: 20000 },
  { id: 'Ф-2211', stageId: 'paid', title: 'Громов Сергей', child: 'Громов Тимур', birth: '11.03.2012', camp: 'Лебяжий берег', shift: '2 смена', amount: 62000, phone: '+7 919 444 71 23', manager: 'anna', paid: 62000 },
  { id: 'Ф-2212', stageId: 'issued', title: 'Лаптева Ирина', child: 'Лаптева Вера', birth: '08.12.2013', camp: 'Оранжевое настроение', shift: '1 смена', amount: 48500, phone: '+7 982 117 30 90', manager: 'shutova', paid: 48500 },
  { id: 'Ф-2213', stageId: 'arrived', title: 'Назаров Олег', child: 'Назаров Лев', birth: '19.06.2011', camp: 'Лебяжий берег', shift: '1 смена', amount: 62000, phone: '+7 950 600 12 84', manager: 'dmitry', paid: 62000 },
  { id: 'Ф-2214', stageId: 'recalc', title: 'Фомина Алёна', child: 'Фомин Глеб', birth: '25.04.2014', camp: 'Оранжевое настроение', shift: '2 смена', amount: 48500, phone: '+7 912 808 41 50', manager: 'anna', paid: 48500, note: 'Выезд по семейным обстоятельствам, перерасчёт за 4 дня' },
]

// ── ВОРОНКА 3 · ЮЛ / РЦТО (санатории) ────────────────────────────────────
const ulStages = [
  { id: 'work', name: 'Взято в работу', accent: A.blue, hint: 'Заполняем наименование организации.' },
  { id: 'kp', name: 'КП', accent: A.cyan, hint: 'Формируем КП, отправляем клиенту.' },
  {
    id: 'booking',
    name: 'Бронирование',
    accent: A.teal,
    hint: 'Заполняем дату заезда (бронируем). Важно учитывать, забронированы или нет конкретное ЮЛ / ДОЛ / санаторий по сменам.',
  },
  { id: 'procurement', name: 'Закупка', accent: A.violet, hint: 'Сквозная нумерация на все путёвки санатория. Формируется список путёвок → путёвка выписана. Журнал выдачи по санаториям.' },
  {
    id: 'contract',
    name: 'Заключение договора',
    accent: A.amber,
    hint: 'Обязательное поле: ЮЛ, от которого подписываем документы. Тип оплаты: предоплата / постоплата. В 1С уходит контрагент, № договора и счёта (ID сделки).',
  },
  { id: 'signed', name: 'Договор заключён', accent: A.pink, hint: 'Фиксируем полученную сумму и кол-во путёвок. Оплат бывает несколько — контролируем остаток и 100% оплату.' },
  { id: 'shipment', name: 'Отгрузка', accent: A.slate, hint: 'Заполняем даты заезда по всем путёвкам. Настроить процесс по переносу сроков в путёвках.' },
  { id: 'closed', name: 'Смены закрыты', accent: A.green, kind: 'win', hint: 'Все путёвки реализованы, смены закрыты.' },
]

const ulDeals = [
  { id: 'Ю-3110', stageId: 'work', title: 'АО «Ижсталь»', payType: 'Предоплата', qty: 40, sanatorium: 'Санаторий «Металлург»', amount: 1_840_000, phone: '+7 3412 91-20-11', manager: 'ruslan', paid: 0 },
  { id: 'Ю-3111', stageId: 'kp', title: 'ООО «Гранит»', payType: 'Постоплата', qty: 18, sanatorium: 'Санаторий «Удмуртия»', amount: 792_000, phone: '+7 3412 55-18-90', manager: 'ruslan', paid: 0 },
  { id: 'Ю-3112', stageId: 'booking', title: 'МУП «Ижводоканал»', payType: 'Предоплата', qty: 25, sanatorium: 'Санаторий «Варзи-Ятчи»', amount: 1_125_000, phone: '+7 3412 44-71-02', manager: 'dmitry', paid: 0 },
  { id: 'Ю-3113', stageId: 'procurement', title: 'ПАО «Сбербанк» (УР)', payType: 'Постоплата', qty: 60, sanatorium: 'Санаторий «Металлург»', amount: 2_760_000, phone: '+7 3412 90-00-90', manager: 'ruslan', paid: 0 },
  { id: 'Ю-3114', stageId: 'contract', title: 'Завод «Купол»', payType: 'Предоплата', qty: 50, sanatorium: 'Санаторий «Удмуртия»', amount: 2_200_000, phone: '+7 3412 72-30-00', manager: 'dmitry', paid: 1_100_000 },
  { id: 'Ю-3115', stageId: 'signed', title: 'ООО «Восток-Агро»', payType: 'Предоплата', qty: 22, sanatorium: 'Санаторий «Варзи-Ятчи»', amount: 990_000, phone: '+7 3412 30-44-55', manager: 'ruslan', paid: 990_000 },
  { id: 'Ю-3116', stageId: 'shipment', title: 'АО «Ижсталь»', payType: 'Постоплата', qty: 35, sanatorium: 'Санаторий «Металлург»', amount: 1_610_000, phone: '+7 3412 91-20-11', manager: 'dmitry', paid: 1_610_000 },
]

// ── ВОРОНКА 4 · ТО (туроператор) ─────────────────────────────────────────
const toStages = [
  { id: 'work', name: 'Взято в работу', accent: A.blue, hint: 'Заполняем наименование организации.' },
  { id: 'calc', name: 'Расчёт', accent: A.cyan, hint: 'Производим расчёт тура.' },
  { id: 'kp', name: 'Отправлено КП', accent: A.teal, hint: 'Формируем КП, отправляем клиенту.' },
  { id: 'agreed', name: 'Согласие получено', accent: A.violet, hint: 'Обязательное поле: ЮЛ, от которого подписываем документы.' },
  { id: 'contract', name: 'Договор заключён', accent: A.amber, hint: 'Договор подписан, переходим к предоплате.' },
  { id: 'prepaid', name: 'Предоплата получена', accent: A.pink, hint: 'Фиксируем полученную сумму и кол-во путёвок.' },
  {
    id: 'booking',
    name: 'Бронирование',
    accent: A.slate,
    hint: 'Даты смены, кол-во взрослых и детей, клиент, объект, субъект РФ, общее кол-во (роботом), наименование тура (страна/город/курорт). Заполняем дату заезда.',
  },
  { id: 'fullpaid', name: 'Полная оплата получена', accent: A.teal, hint: 'За неделю до тура — напоминание клиенту.' },
  { id: 'acts', name: 'Акты получены', accent: A.green, kind: 'win', hint: 'Закрывающие документы получены, сделка завершена.' },
]

const toDeals = [
  { id: 'Т-4055', stageId: 'work', title: 'Школа №24, г. Ижевск', tour: 'Казань · 3 дня', dates: '12–14 окт', adults: 4, children: 28, region: 'Респ. Татарстан', amount: 392_000, phone: '+7 3412 21-44-09', manager: 'anna', paid: 0 },
  { id: 'Т-4056', stageId: 'calc', title: 'Гимназия №56', tour: 'Санкт-Петербург · 5 дней', dates: '02–06 ноя', adults: 5, children: 35, region: 'г. Санкт-Петербург', amount: 1_225_000, phone: '+7 3412 36-70-12', manager: 'shutova', paid: 0 },
  { id: 'Т-4057', stageId: 'kp', title: 'ООО «ТК Меридиан»', tour: 'Сочи · 7 дней', dates: '15–21 ноя', adults: 30, children: 0, region: 'Краснодарский край', amount: 1_650_000, phone: '+7 3412 50-11-77', manager: 'dmitry', paid: 0 },
  { id: 'Т-4058', stageId: 'agreed', title: 'Лицей №14', tour: 'Москва · 4 дня', dates: '20–23 ноя', adults: 4, children: 30, region: 'г. Москва', amount: 870_000, phone: '+7 3412 78-22-30', manager: 'anna', paid: 0 },
  { id: 'Т-4059', stageId: 'prepaid', title: 'ООО «Профсоюз УР»', tour: 'Абхазия · 8 дней', dates: '01–08 дек', adults: 42, children: 12, region: 'Респ. Абхазия', amount: 2_430_000, phone: '+7 3412 60-90-10', manager: 'dmitry', paid: 1_215_000 },
  { id: 'Т-4060', stageId: 'booking', title: 'Школа №80', tour: 'Влюбиться в Удмуртию · 2 дня', dates: '05–06 дек', adults: 3, children: 24, region: 'Удмуртская Респ.', amount: 168_000, phone: '+7 3412 43-19-88', manager: 'shutova', paid: 84_000 },
  { id: 'Т-4061', stageId: 'fullpaid', title: 'ООО «Восток-Тур»', tour: 'Кисловодск · 10 дней', dates: '08–18 дек', adults: 26, children: 0, region: 'Ставропольский край', amount: 2_080_000, phone: '+7 3412 30-77-44', manager: 'dmitry', paid: 2_080_000 },
]

export const FUNNELS = [
  { id: 'leads', name: 'Лиды', icon: 'inbox', accent: '#3f67ff', stages: leadStages, deals: leadDeals, kind: 'leads' },
  { id: 'fiz', name: 'Физ лица', icon: 'user', accent: '#0ea5a3', stages: fizStages, deals: fizDeals, kind: 'fiz' },
  { id: 'ul', name: 'ЮЛ · РЦТО', icon: 'building', accent: '#7c5cff', stages: ulStages, deals: ulDeals, kind: 'ul' },
  { id: 'to', name: 'ТО · Туры', icon: 'globe', accent: '#e08a16', stages: toStages, deals: toDeals, kind: 'to' },
]

// ── Утилиты форматирования ───────────────────────────────────────────────
export function formatMoney(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
}

export function formatMoneyShort(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + ' млн ₽'
  if (n >= 1_000) return Math.round(n / 1000) + ' тыс ₽'
  return n + ' ₽'
}
