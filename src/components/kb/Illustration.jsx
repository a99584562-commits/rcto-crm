// Векторные иллюстрации ключевых экранов с пронумерованными указателями.
// Используются в статьях Базы знаний вместо «скринов». Номера указателей
// соответствуют пунктам легенды под изображением.

function Pin({ n, x, y }) {
  return (
    <span
      className="absolute z-10 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-600 text-[10px] font-extrabold text-white shadow-glow ring-2 ring-white"
      style={{ left: x + '%', top: y + '%' }}
    >
      {n}
    </span>
  )
}

function Frame({ title, children }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/[0.06]">
      <div className="flex items-center gap-1.5 border-b border-ink-900/[0.06] bg-canvas/60 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-ink-900/15" />
        <span className="h-2 w-2 rounded-full bg-ink-900/15" />
        <span className="h-2 w-2 rounded-full bg-ink-900/15" />
        <span className="ml-1.5 text-[9px] font-bold text-ink-400">{title}</span>
      </div>
      <div className="relative bg-canvas">{children}</div>
    </div>
  )
}

function Legend({ items }) {
  return (
    <div className="mt-2.5 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
      {items.map((t, i) => (
        <div key={i} className="flex items-start gap-1.5 text-[12px] leading-snug text-ink-600">
          <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-600 text-[9px] font-bold text-white">{i + 1}</span>
          {t}
        </div>
      ))}
    </div>
  )
}

// ── мелкие строительные блоки ───────────────────────────────────────────
const Tab = ({ label, active }) => (
  <span className={`rounded-lg px-2 py-1 text-[8px] font-bold ${active ? 'bg-white text-ink-900 shadow-soft ring-1 ring-ink-900/[0.06]' : 'text-ink-400'}`}>{label}</span>
)
const MiniCard = ({ id, title, pay }) => (
  <div className="rounded-lg bg-white p-1.5 shadow-soft ring-1 ring-ink-900/[0.05]">
    <div className="flex justify-between"><span className="rounded bg-ink-900/[0.05] px-1 text-[6.5px] font-bold text-ink-400">{id}</span></div>
    <div className="mt-1 text-[8px] font-bold text-ink-900">{title}</div>
    {pay != null && <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-ink-900/[0.06]"><div className="h-full rounded-full bg-brand-500" style={{ width: pay + '%' }} /></div>}
  </div>
)
const Col = ({ name, color, children }) => (
  <div className="rounded-lg bg-ink-900/[0.03] p-1.5">
    <div className="mb-1.5 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} /><span className="text-[7.5px] font-bold text-ink-700">{name}</span></div>
    <div className="space-y-1.5">{children}</div>
  </div>
)

// ── ЭКРАНЫ ──────────────────────────────────────────────────────────────
const DATA = {
  kanban: {
    title: 'Воронки · канбан',
    legend: ['Переключатель воронок (Лиды, Физ лица, ЮЛ, ТО)', 'Стадия — колонка; перетащите карточку между стадиями', 'Карточка сделки — клик открывает полную карточку'],
    pins: [{ x: 12, y: 22 }, { x: 50, y: 40 }, { x: 17, y: 66 }],
    Mock: () => (
      <div className="p-3">
        <div className="mb-2.5 flex gap-1"><Tab label="Лиды" active /><Tab label="Физ лица" /><Tab label="ЮЛ" /><Tab label="ТО" /></div>
        <div className="grid grid-cols-3 gap-2">
          <Col name="Новый лид" color="#3f67ff"><MiniCard id="L-1041" title="Марина Гусева" /><MiniCard id="L-1042" title="Ольга П." /></Col>
          <Col name="В работе" color="#0ea5a3"><MiniCard id="L-1043" title="ООО «Гранит»" /></Col>
          <Col name="Квалиф." color="#84cc16" />
        </div>
      </div>
    ),
  },
  deal: {
    title: 'Карточка сделки',
    legend: ['Стадии сверху — клик меняет этап', 'Слева — дела, поля и участники (правятся по клику)', 'Справа — лента событий и комментарии', 'Быстрые действия: Позвонить и 1С'],
    pins: [{ x: 40, y: 30 }, { x: 24, y: 70 }, { x: 82, y: 64 }, { x: 90, y: 12 }],
    Mock: () => (
      <div className="p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-[8.5px] font-extrabold text-ink-900">Группа СОШ №24</span>
          <span className="ml-auto rounded-full bg-brand-600 px-2 py-0.5 text-[7px] font-bold text-white">Позвонить</span>
          <span className="rounded-full bg-white px-1.5 py-0.5 text-[7px] font-bold text-ink-600 ring-1 ring-ink-900/[0.06]">1С</span>
        </div>
        <div className="mb-2 flex gap-0.5">
          {['В работе', 'Формиров.', 'Договор', 'Оплата'].map((s, i) => (
            <span key={s} className="rounded px-1.5 py-1 text-[7px] font-bold text-white" style={{ background: i <= 2 ? ['#3f67ff', '#0ea5a3', '#10b3c6'][i] : '#eef1f6', color: i <= 2 ? '#fff' : '#7a8296' }}>{s}</span>
          ))}
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-2">
          <div className="space-y-1">
            <div className="rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]"><div className="text-[6.5px] font-bold uppercase text-ink-400">Дело</div><div className="text-[8px] font-semibold text-ink-800">Позвонить · сегодня</div></div>
            <div className="rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]"><div className="text-[6.5px] font-bold uppercase text-ink-400">Участник</div><div className="text-[8px] font-semibold text-ink-800">Семья Ивановых</div></div>
          </div>
          <div className="rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
            <div className="text-[6.5px] font-bold uppercase text-ink-400">Лента</div>
            {['Стадия изменена', 'Документ сформирован', 'Комментарий'].map((t) => (
              <div key={t} className="mt-1 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-brand-400" /><span className="text-[7px] text-ink-600">{t}</span></div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  docbuilder: {
    title: 'Конструктор документов',
    legend: ['Пишете текст документа', 'Каталог полей — клик вставляет метку в текст', 'Вкладка «Предпросмотр» — готовый документ на примере сделки'],
    pins: [{ x: 30, y: 58 }, { x: 84, y: 52 }, { x: 22, y: 16 }],
    Mock: () => (
      <div className="p-3">
        <div className="mb-2 flex gap-1"><Tab label="Текст" active /><Tab label="Предпросмотр" /></div>
        <div className="grid grid-cols-[1.5fr_1fr] gap-2">
          <div className="space-y-1 rounded-lg bg-white p-2 font-mono ring-1 ring-ink-900/[0.05]">
            <div className="text-[7.5px] text-ink-700">ДОГОВОР № <span className="rounded bg-brand-50 px-0.5 text-brand-700">{'{номер_договора}'}</span></div>
            <div className="text-[7.5px] text-ink-700"><span className="rounded bg-brand-50 px-0.5 text-brand-700">{'{наше_юл}'}</span> и <span className="rounded bg-brand-50 px-0.5 text-brand-700">{'{фио_родителя}'}</span></div>
            <div className="text-[7.5px] text-ink-400">{'{#дети} … {/дети}'}</div>
            <div className="text-[7.5px] text-ink-700">Сумма: <span className="rounded bg-brand-50 px-0.5 text-brand-700">{'{сумма}'}</span></div>
          </div>
          <div>
            <div className="text-[6.5px] font-bold uppercase text-ink-400">Поля</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {['№ договора', 'Наше ЮЛ', 'ФИО', 'Сумма', 'Лагерь'].map((t) => <span key={t} className="rounded bg-white px-1 py-0.5 text-[7px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06]">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  tasks: {
    title: 'Задачи · дела',
    legend: ['Что нужно сделать', 'Тег дела (Звонок, Оплата, Документы…)', 'Срок (дата и время)', 'Группы по срокам и чекбокс «выполнено»'],
    pins: [{ x: 30, y: 20 }, { x: 20, y: 44 }, { x: 64, y: 44 }, { x: 13, y: 82 }],
    Mock: () => (
      <div className="p-3">
        <div className="rounded-lg bg-white p-2 shadow-soft ring-1 ring-ink-900/[0.05]">
          <div className="rounded bg-canvas px-2 py-1 text-[8px] text-ink-400 ring-1 ring-ink-900/[0.06]">Что нужно сделать?</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[7px] font-bold text-white">Звонок</span>
            <span className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[7px] font-bold text-violet-600">Оплата</span>
            <span className="rounded bg-canvas px-1.5 py-0.5 text-[7px] font-bold text-ink-500 ring-1 ring-ink-900/[0.06]">05.06</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="mb-1 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /><span className="text-[7px] font-bold uppercase text-amber-600">Сегодня</span></div>
          <div className="flex items-center gap-1.5 rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
            <span className="h-3 w-3 rounded border border-ink-300" />
            <span className="rounded-full bg-brand-600/15 px-1.5 py-0.5 text-[7px] font-bold text-brand-700">Звонок</span>
            <span className="text-[8px] font-semibold text-ink-800">Позвонить Чирковой</span>
            <span className="ml-auto text-[7px] font-bold text-amber-600">14:00</span>
          </div>
        </div>
      </div>
    ),
  },
  overview: {
    title: 'Главный экран',
    legend: ['Меню разделов слева', 'Рабочая область выбранного раздела', 'Текущий пользователь — клик переключает роль'],
    pins: [{ x: 18, y: 42 }, { x: 68, y: 34 }, { x: 18, y: 88 }],
    Mock: () => (
      <div className="flex h-[180px]">
        <div className="w-[36%] border-r border-ink-900/[0.06] bg-white p-2">
          <div className="mb-2 flex items-center gap-1"><span className="grid h-4 w-4 place-items-center rounded bg-brand-600 text-[7px] font-bold text-white">Р</span><span className="text-[7.5px] font-extrabold text-ink-900">РЦТО</span></div>
          {['Воронки', 'Задачи', 'Чаты', 'Документы', 'База знаний'].map((n, i) => (
            <div key={n} className={`mb-0.5 flex items-center gap-1 rounded-md px-1.5 py-1 text-[7px] font-bold ${i === 0 ? 'bg-brand-50 text-brand-700' : 'text-ink-500'}`}><span className="h-1.5 w-1.5 rounded-sm bg-current opacity-50" />{n}</div>
          ))}
          <div className="mt-3 flex items-center gap-1 rounded-md bg-canvas px-1.5 py-1 ring-1 ring-ink-900/[0.06]"><span className="h-3 w-3 rounded-full bg-brand-600" /><span className="text-[7px] font-bold text-ink-800">Ольга · Админ</span></div>
        </div>
        <div className="flex-1 bg-canvas p-2">
          <div className="text-[8px] font-extrabold text-ink-900">Сделки по воронкам</div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <div className="h-12 rounded-lg bg-white ring-1 ring-ink-900/[0.05]" /><div className="h-12 rounded-lg bg-white ring-1 ring-ink-900/[0.05]" />
          </div>
        </div>
      </div>
    ),
  },
  word: {
    title: 'Свой Word-шаблон',
    legend: ['Каталог полей — скопируйте метку', 'Вставьте метки в свой Word', '«Загрузить Word»', 'Сопоставьте метку с полем (обычно автоматически)'],
    pins: [{ x: 82, y: 40 }, { x: 26, y: 44 }, { x: 88, y: 12 }, { x: 26, y: 86 }],
    Mock: () => (
      <div className="p-2">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[7px] font-bold text-ink-400">ваш-договор.docx</span>
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[7px] font-bold text-white">Загрузить Word</span>
        </div>
        <div className="grid grid-cols-[1.3fr_1fr] gap-2">
          <div className="space-y-1 rounded-lg bg-white p-2 font-mono ring-1 ring-ink-900/[0.05]">
            <div className="text-[7px] text-ink-700">ДОГОВОР № <span className="rounded bg-brand-50 px-0.5 text-brand-700">{'{номер_договора}'}</span></div>
            <div className="text-[7px] text-ink-700"><span className="rounded bg-brand-50 px-0.5 text-brand-700">{'{наше_юл}'}</span></div>
            <div className="text-[7px] text-ink-400">{'{#дети} … {/дети}'}</div>
          </div>
          <div className="rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
            <div className="text-[6.5px] font-bold uppercase text-ink-400">Каталог · копировать</div>
            <div className="mt-1 flex flex-wrap gap-1">{['№ договора', 'Наше ЮЛ', 'ФИО', 'Сумма'].map((t) => <span key={t} className="rounded bg-canvas px-1 py-0.5 text-[6.5px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06]">{t}</span>)}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1 rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
          <span className="font-mono text-[7px] font-bold text-brand-700">{'{номер_договора}'}</span><span className="text-[7px] text-ink-400">→</span>
          <span className="rounded bg-canvas px-1.5 py-0.5 text-[7px] font-bold text-ink-700 ring-1 ring-ink-900/[0.06]">Номер договора</span>
        </div>
      </div>
    ),
  },
  docgen: {
    title: 'Формирование документа',
    legend: ['Выберите шаблон и участника', '«Сформировать .docx» — файл скачается', 'Документ попадает в реестр «Документы»', 'Меняйте статус подписания'],
    pins: [{ x: 26, y: 45 }, { x: 26, y: 84 }, { x: 74, y: 44 }, { x: 92, y: 44 }],
    Mock: () => (
      <div className="grid grid-cols-2 gap-2 p-2">
        <div className="rounded-lg bg-white p-2 shadow-soft ring-1 ring-ink-900/[0.05]">
          <div className="text-[8px] font-extrabold text-ink-900">Сформировать документ</div>
          <div className="mt-1.5 text-[6.5px] font-bold uppercase text-ink-400">Шаблон</div>
          <div className="rounded bg-canvas px-1.5 py-1 text-[7px] font-semibold text-ink-700 ring-1 ring-ink-900/[0.06]">Договор с родителем ▾</div>
          <div className="mt-1 text-[6.5px] font-bold uppercase text-ink-400">Участник</div>
          <div className="rounded bg-canvas px-1.5 py-1 text-[7px] font-semibold text-ink-700 ring-1 ring-ink-900/[0.06]">Семья Ивановых ▾</div>
          <div className="mt-2 rounded-md bg-brand-600 py-1 text-center text-[7px] font-bold text-white">Сформировать .docx</div>
        </div>
        <div>
          <div className="text-[6.5px] font-bold uppercase text-ink-400">Реестр «Документы»</div>
          <div className="mt-1 flex items-center gap-1 rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
            <span className="grid h-4 w-4 place-items-center rounded bg-brand-50 text-[7px]">📄</span>
            <span className="text-[7px] font-semibold text-ink-800">Договор Д-1180</span>
            <span className="ml-auto rounded-full bg-emerald-50 px-1 py-0.5 text-[6px] font-bold text-emerald-600">Сформирован</span>
            <span className="text-[8px] font-bold text-brand-600">↓</span>
          </div>
        </div>
      </div>
    ),
  },
  registries: {
    title: 'Лагеря и смены',
    legend: ['Объекты: лагеря и санатории', 'Смены: даты и цена', 'Загрузка смены', 'Добавить объект или смену'],
    pins: [{ x: 20, y: 52 }, { x: 60, y: 46 }, { x: 92, y: 56 }, { x: 20, y: 15 }],
    Mock: () => (
      <div className="grid grid-cols-[1fr_1.6fr] gap-2 p-2">
        <div className="space-y-1">
          <div className="rounded-md bg-brand-600 py-1 text-center text-[7px] font-bold text-white">+ Объект</div>
          {[['Лебяжий берег', true], ['Оранжевое настр.', false], ['Сан. «Металлург»', false]].map(([n, a]) => (
            <div key={n} className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[7px] font-bold ${a ? 'bg-white text-ink-900 shadow-soft ring-1 ring-brand-500/30' : 'text-ink-500'}`}><span className="h-3 w-3 rounded bg-ink-900/[0.06]" />{n}</div>
          ))}
        </div>
        <div className="rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
          <div className="mb-1 flex justify-between"><span className="text-[6.5px] font-bold uppercase text-ink-400">Смены</span><span className="rounded bg-brand-50 px-1 text-[6.5px] font-bold text-brand-600">+ Смена</span></div>
          {[['1 смена', '01.06–21.06', 70], ['2 смена', '24.06–14.07', 82]].map(([n, d, occ]) => (
            <div key={n} className="mb-1 grid grid-cols-[1fr_1.4fr_1fr] items-center gap-1 text-[6.5px] text-ink-700">
              <span className="font-bold">{n}</span><span>{d}</span>
              <div className="h-1 overflow-hidden rounded-full bg-ink-900/[0.06]"><div className="h-full rounded-full bg-emerald-500" style={{ width: occ + '%' }} /></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  team: {
    title: 'Чаты и команда',
    legend: ['«Написать сотруднику» — диалог создаётся сам', 'Каналы и личные чаты', 'Роли и права: Администратор / Менеджер / Наблюдатель'],
    pins: [{ x: 22, y: 16 }, { x: 74, y: 34 }, { x: 60, y: 82 }],
    Mock: () => (
      <div className="grid grid-cols-[1fr_1.2fr] gap-2 p-2">
        <div className="space-y-1">
          <div className="rounded-md bg-brand-600 py-1 text-center text-[7px] font-bold text-white">+ Написать сотруднику</div>
          {['# Общий', '# Менеджеры', 'Анна Котова'].map((n, i) => (
            <div key={n} className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[7px] font-bold ${i === 0 ? 'bg-white text-ink-900 ring-1 ring-brand-500/30' : 'text-ink-500'}`}><span className="h-3 w-3 rounded-full bg-ink-900/[0.06]" />{n}</div>
          ))}
        </div>
        <div>
          <div className="space-y-1 rounded-lg bg-white p-1.5 ring-1 ring-ink-900/[0.05]">
            <div className="flex"><span className="rounded-lg rounded-bl-sm bg-canvas px-1.5 py-1 text-[6.5px] text-ink-700 ring-1 ring-ink-900/[0.06]">Договор подписан</span></div>
            <div className="flex justify-end"><span className="rounded-lg rounded-br-sm bg-brand-600 px-1.5 py-1 text-[6.5px] text-white">Принято 👍</span></div>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">{[['Админ', '#1f47f5'], ['Менеджер', '#0ea5a3'], ['Наблюдатель', '#838ca0']].map(([r, c]) => <span key={r} className="rounded-full px-1.5 py-0.5 text-[6.5px] font-bold" style={{ color: c, background: c + '18' }}>{r}</span>)}</div>
        </div>
      </div>
    ),
  },
  integrations: {
    title: 'Телефония и 1С',
    legend: ['«Позвонить» — звонок через АТС, запись разговора', '«1С» — выгрузка контрагента и счёта', 'Входящий звонок создаёт лид и поднимает карточку', 'Из 1С возвращается статус оплаты'],
    pins: [{ x: 45, y: 70 }, { x: 56, y: 70 }, { x: 11, y: 38 }, { x: 89, y: 38 }],
    Mock: () => (
      <div className="flex items-center justify-between gap-1 p-3">
        <div className="rounded-lg bg-white p-1.5 text-center ring-1 ring-ink-900/[0.05]"><div className="text-[13px]">📞</div><div className="text-[6.5px] font-bold text-ink-700">Виртуальная АТС</div></div>
        <span className="text-[11px] text-ink-300">↔</span>
        <div className="rounded-lg bg-white p-2 shadow-soft ring-1 ring-ink-900/[0.06]">
          <div className="text-[7px] font-extrabold text-ink-900">Карточка сделки</div>
          <div className="mt-1 flex gap-1"><span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[6.5px] font-bold text-white">Позвонить</span><span className="rounded-full bg-white px-1.5 py-0.5 text-[6.5px] font-bold text-ink-600 ring-1 ring-ink-900/[0.06]">1С</span></div>
        </div>
        <span className="text-[11px] text-ink-300">↔</span>
        <div className="rounded-lg bg-white p-1.5 text-center ring-1 ring-ink-900/[0.05]"><div className="text-[11px] font-extrabold text-ink-700">1С</div><div className="text-[6.5px] font-bold text-ink-700">Контрагент · счёт</div></div>
      </div>
    ),
  },
}

export const ILLO_OPTIONS = [
  { value: '', label: 'Без иллюстрации' },
  { value: 'overview', label: 'Главный экран' },
  { value: 'kanban', label: 'Воронки · канбан' },
  { value: 'deal', label: 'Карточка сделки' },
  { value: 'docbuilder', label: 'Конструктор документов' },
  { value: 'word', label: 'Свой Word-шаблон' },
  { value: 'docgen', label: 'Формирование документа' },
  { value: 'tasks', label: 'Задачи · дела' },
  { value: 'registries', label: 'Лагеря и смены' },
  { value: 'team', label: 'Чаты и команда' },
  { value: 'integrations', label: 'Телефония и 1С' },
]

export default function Illustration({ name }) {
  const d = DATA[name]
  if (!d) return null
  return (
    <div className="my-4">
      <Frame title={d.title}>
        <d.Mock />
        {d.pins.map((p, i) => <Pin key={i} n={i + 1} x={p.x} y={p.y} />)}
      </Frame>
      <Legend items={d.legend} />
    </div>
  )
}
