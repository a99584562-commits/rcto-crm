import { useEffect, useState } from 'react'
import { IconClose, IconPhone, IconDoc, IconBolt, IconLink, IconCheck } from './Icons.jsx'

const BLOCKS = [
  {
    icon: IconPhone,
    color: '#1f47f5',
    title: 'Телефония',
    desc: 'Виртуальная АТС подключается по API: Mango, UIS, Telfin, Zadarma, Sipuni, Мегафон.',
    points: [
      'Входящий звонок → авто-создание лида и всплывающая карточка',
      'Click-to-call прямо из сделки',
      'Запись разговоров и история звонков',
      'Привязка звонка к клиенту по номеру',
    ],
  },
  {
    icon: IconDoc,
    color: '#0ea5a3',
    title: '1С',
    desc: 'Двусторонний обмен через HTTP-сервисы / OData / EnterpriseData.',
    points: [
      'Из CRM в 1С: контрагент, № договора, счёт',
      'Из 1С в CRM: статус оплаты → стадия «Оплачено»',
      'Контроль остатка и 100% оплаты',
      'Сквозная нумерация путёвок санаториев',
    ],
  },
  {
    icon: IconLink,
    color: '#7c5cff',
    title: 'Другие сервисы',
    desc: 'Всё, у чего есть API — подключается на своём сервере.',
    points: [
      'WhatsApp: памятки, согласия, шаблоны заявлений',
      'Платёжная система (Альфа-Банк / эквайринг)',
      'Сайт «Дизайн18» и группа ВК → заявки в воронку «Лиды»',
      'ЖД-билеты и согласование автобусов',
    ],
  },
]

export default function IntegrationsModal({ onClose }) {
  const [closing, setClosing] = useState(false)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])
  function close() {
    setClosing(true)
    setTimeout(onClose, 200)
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center p-4">
      <div
        className={`absolute inset-0 bg-ink-900/40 backdrop-blur-[3px] transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={close}
      />
      <div
        className={`relative w-full max-w-3xl overflow-hidden rounded-4xl bg-canvas shadow-lift ${closing ? 'opacity-0' : 'animate-scale-in'}`}
      >
        {/* Шапка */}
        <div className="flex items-start gap-3 bg-white px-6 py-5">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">
              <IconBolt className="text-[12px]" /> Интеграции
            </span>
            <h2 className="mt-2.5 text-[22px] font-extrabold tracking-tight text-ink-900">
              Телефония, 1С и другие сервисы
            </h2>
            <p className="mt-1 max-w-xl text-[13px] font-medium leading-relaxed text-ink-500">
              На облачном сервере (VPS) приложение подключается к любым системам с API — гибче и дешевле, чем коробочные
              решения Битрикс24.
            </p>
          </div>
          <button
            onClick={close}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900"
          >
            <IconClose className="text-[18px]" />
          </button>
        </div>

        <div className="grid gap-3 px-6 py-5 sm:grid-cols-3">
          {BLOCKS.map((b) => (
            <div key={b.title} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-ink-900/[0.05]">
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl"
                style={{ backgroundColor: b.color + '16', color: b.color }}
              >
                <b.icon className="text-[19px]" />
              </span>
              <h3 className="mt-3 text-[15px] font-extrabold tracking-tight text-ink-900">{b.title}</h3>
              <p className="mt-1 text-[12px] font-medium leading-snug text-ink-400">{b.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {b.points.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-[12px] font-medium leading-snug text-ink-700">
                    <IconCheck className="mt-0.5 shrink-0 text-[13px]" style={{ color: b.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-6 mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-medium leading-relaxed text-amber-800">
          <b>Важно про демо:</b> GitHub Pages — это статичная витрина без сервера, поэтому кнопки «Позвонить» и «Выгрузить
          в 1С» здесь работают в демо-режиме. Боевые интеграции включаются после переезда на облачный сервер.
        </div>
      </div>
    </div>
  )
}
