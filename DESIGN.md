# Дизайн-кит «Чистый премиум-SaaS» (светлая тема, Linear/Notion-стиль)

Переносимый дизайн-язык, который использован в этом приложении. Можно вставлять как
промт в ИИ-агента **или** копировать токены/код в новый проект (React + Tailwind).

---

## 1. ПРОМТ (скопировать в ИИ для нового приложения)

> Ты — продуктовый UI-дизайнер уровня Linear / Notion / Vercel. Делай интерфейс в стиле
> **«Soft Structuralism»**: светлый фон, мягкие диффузные тени (НЕ чёрные), азур-акцент,
> много воздуха, скруглённые «squircle»-формы, тонкие линейные иконки, плавные пружинные
> анимации. Премиум, спокойно, дорого — без визуального шума.
>
> **Шрифт:** Manrope (или Onest / Geist) — обязательно с кириллицей, веса 400–800.
> Заголовки `font-extrabold tracking-tight`. НИКОГДА не используй Inter, Roboto, Arial.
>
> **Палитра:**
> - Фон приложения: `#f5f7fb`; поверхности (карточки): `#ffffff`
> - Текст: 900 `#0d1326`, 700 `#2a3145`, 500 `#5b6479`, 400 `#838ca0`, 300 `#aab2c4`
> - Акцент (азур): основной `#1f47f5`, hover `#1736e1`, светлый фон `#eef4ff`
> - Семантика: success `#84cc16`, warning `#e08a16`, danger `#f0654a`,
>   доп. оттенки cyan `#0ea5a3`, violet `#7c5cff`. Мягкие подложки = цвет + альфа `18`/`14`.
>
> **Тени** (синеватые, мягкие, без жёсткого чёрного):
> - soft: `0 1px 2px rgba(16,28,64,.04), 0 8px 24px -12px rgba(16,28,64,.12)`
> - lift (hover/модалки): `0 2px 4px rgba(16,28,64,.05), 0 18px 40px -16px rgba(16,28,64,.22)`
> - glow (CTA): `0 10px 40px -12px rgba(31,71,245,.45)`
>
> **Радиусы:** карточки/инпуты `rounded-2xl` (1rem), контейнеры `rounded-3xl`,
> модалки `rounded-4xl` (2rem), кнопки-пиллы/иконки/чипы `rounded-full`.
>
> **Границы:** только волосяные через `ring` (`ring-1 ring-ink-900/[0.05]`), разделители
> `border-ink-900/[0.06]`. НИКАКИХ серых `1px solid border`, никаких острых углов.
>
> **Движение:** всё на пружинном `cubic-bezier(0.32,0.72,0,1)`. Карточка при наведении:
> `-translate-y-0.5` + усиление тени + азур-ring. Нажатие: `active:scale-[0.98]`.
> Появление элементов: мягкий fade-up / scale-in / slide-in. Никаких `linear`/`ease-in-out`
> и мгновенных переключений.
>
> **Иконки:** только тонкие линейные (stroke 1.5–1.6) — свои SVG или Phosphor Light.
> Без толстых и заливных.
>
> **Анти-паттерны (запрещено):** Inter/Roboto/Arial; `shadow-md`/чёрные тени; серые 1px
> бордеры; острые углы; резкие переходы; толстые иконки; кислотные градиенты; плотная
> вёрстка без воздуха.
>
> Стек: React + Tailwind CSS. Используй приложенные токены (раздел 2) дословно.

---

## 2. КОД: токены Tailwind (`tailwind.config.js` → `theme.extend`)

```js
extend: {
  fontFamily: { sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
  colors: {
    brand: { 50:'#eef4ff',100:'#dce8ff',200:'#c0d6ff',300:'#97baff',400:'#6892ff',
             500:'#3f67ff',600:'#1f47f5',700:'#1736e1',800:'#192fb6',900:'#1a2e8f' },
    ink:   { 900:'#0d1326',700:'#2a3145',500:'#5b6479',400:'#838ca0',300:'#aab2c4' },
    canvas: '#f5f7fb',
    surface: '#ffffff',
  },
  boxShadow: {
    soft: '0 1px 2px rgba(16,28,64,0.04), 0 8px 24px -12px rgba(16,28,64,0.12)',
    lift: '0 2px 4px rgba(16,28,64,0.05), 0 18px 40px -16px rgba(16,28,64,0.22)',
    glow: '0 10px 40px -12px rgba(31,71,245,0.45)',
  },
  borderRadius: { '4xl': '2rem' },
  transitionTimingFunction: { spring: 'cubic-bezier(0.32, 0.72, 0, 1)' },
  keyframes: {
    'fade-up':  { '0%':{opacity:'0',transform:'translateY(10px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
    'scale-in': { '0%':{opacity:'0',transform:'scale(0.97)'},      '100%':{opacity:'1',transform:'scale(1)'} },
    'slide-in': { '0%':{opacity:'0',transform:'translateX(24px)'}, '100%':{opacity:'1',transform:'translateX(0)'} },
  },
  animation: {
    'fade-up':  'fade-up 0.5s cubic-bezier(0.32,0.72,0,1) both',
    'scale-in': 'scale-in 0.4s cubic-bezier(0.32,0.72,0,1) both',
    'slide-in': 'slide-in 0.45s cubic-bezier(0.32,0.72,0,1) both',
  },
},
```

## 3. КОД: базовый CSS (`index.css`)

```css
@tailwind base; @tailwind components; @tailwind utilities;

body {
  margin: 0;
  background: theme('colors.canvas');
  color: theme('colors.ink.900');
  font-family: theme('fontFamily.sans');
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* тонкий ненавязчивый скроллбар */
.scroll-thin { scrollbar-width: thin; scrollbar-color: rgba(131,140,160,.35) transparent; }
.scroll-thin::-webkit-scrollbar { height: 10px; width: 10px; }
.scroll-thin::-webkit-scrollbar-thumb { background: rgba(131,140,160,.3); border-radius: 999px; border: 3px solid transparent; background-clip: content-box; }
.scroll-thin::-webkit-scrollbar-thumb:hover { background: rgba(131,140,160,.5); background-clip: content-box; }
.scroll-thin::-webkit-scrollbar-track { background: transparent; }
```

## 4. Шрифт (в `<head>` index.html)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

---

## 5. Шпаргалка по компонентам (Tailwind-классы)

**Карточка**
```html
<div class="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-ink-900/[0.04]
            transition-all duration-300 ease-spring
            hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-500/30 active:scale-[0.98]">
```

**CTA-кнопка (primary)** — с «кнопкой-в-кнопке» иконкой
```html
<button class="group flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2
               text-[13px] font-bold text-white shadow-glow
               transition-all duration-300 ease-spring hover:bg-brand-700 active:scale-95">
  Позвонить
  <span class="grid h-8 w-8 place-items-center rounded-full bg-white/15
               transition-transform duration-300 ease-spring
               group-hover:translate-x-0.5 group-hover:-translate-y-px"><!-- icon --></span>
</button>
```

**Вторичная кнопка**
```html
<button class="rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink-700
               shadow-soft ring-1 ring-ink-900/[0.06]
               transition-all hover:ring-brand-500/40 active:scale-[0.98]">
```

**Чип / тег** (цвет через инлайн-стиль: `color`, `backgroundColor: color+'18'`)
```html
<span class="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
      style="color:#1f47f5; background:#1f47f518">Звонок</span>
```

**Аватар с инициалами**
```html
<span class="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-white"
      style="background:#1f47f5">ОД</span>
```

**Модалка**
```html
<div class="fixed inset-0 z-40 grid place-items-center p-6">
  <div class="absolute inset-0 bg-ink-900/40 backdrop-blur-[3px]"></div>
  <div class="relative w-full max-w-2xl rounded-4xl bg-canvas shadow-lift animate-scale-in">
    <header class="bg-white px-6 py-4 rounded-t-4xl">…</header>
    …
  </div>
</div>
```

**Боковое меню — активный пункт**
```html
<button class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5
               bg-brand-50 text-brand-700">  <!-- активный -->
  <span class="grid h-7 w-7 place-items-center rounded-xl bg-brand-600 text-white"><!-- icon --></span>
  <span class="text-[13.5px] font-bold tracking-tight">Воронки</span>
</button>
<!-- неактивный: text-ink-500 hover:bg-ink-900/[0.04]; иконка text-ink-400 -->
```

**Инпут**
```html
<input class="rounded-xl bg-canvas px-3 py-2 text-[13px] font-semibold text-ink-900
              outline-none ring-1 ring-ink-900/[0.06] transition-shadow
              focus:ring-2 focus:ring-brand-500 placeholder:text-ink-300" />
```

**Шкала прогресса**
```html
<div class="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/[0.06]">
  <div class="h-full rounded-full" style="width:62%; background:#1f47f5"></div> <!-- #84cc16 при 100% -->
</div>
```

**Эйброу / заголовок секции**
```html
<h3 class="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-400">Данные сделки</h3>
```

**Пульсирующий индикатор статуса** (онлайн / интеграция активна)
```html
<span class="relative flex h-2 w-2">
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
  <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
</span>
```

---

## 6. Шкала типографики (плотный продуктовый UI)

| Назначение | Классы |
|---|---|
| H1 / заголовок страницы | `text-[18px] font-extrabold tracking-tight` |
| Заголовок в модалке | `text-[20px]–[22px] font-extrabold tracking-tight` |
| Крупная сумма/число | `text-[13px]–[15px] font-extrabold` |
| Тело | `text-[12.5px]–[13px] font-medium` / `font-semibold` |
| Подпись/мета | `text-[10.5px]–[11px] font-medium text-ink-400` |
| Эйброу (uppercase) | `text-[10px]–[11px] font-bold uppercase tracking-[0.15em]–[0.2em]` |

Размеры намеренно мелкие и плотные (как в Linear) — это часть «дорогого» ощущения.

## 7. Иконки
Тонкие линейные SVG, единый стиль:
```jsx
const base = { fill:'none', stroke:'currentColor', strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' }
const Icon = (props) => <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>{/* paths */}</svg>
```
Размер задаётся через `font-size` родителя (`text-[15px]`), цвет — `currentColor`.
```
