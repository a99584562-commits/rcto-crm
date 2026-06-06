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
}

export const ILLO_OPTIONS = [
  { value: '', label: 'Без иллюстрации' },
  { value: 'kanban', label: 'Воронки · канбан' },
  { value: 'deal', label: 'Карточка сделки' },
  { value: 'docbuilder', label: 'Конструктор документов' },
  { value: 'tasks', label: 'Задачи · дела' },
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
