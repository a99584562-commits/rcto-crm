// Ультра-тонкие линейные иконки (stroke 1.5), без сторонних библиотек.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const wrap = (children) => (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    {children}
  </svg>
)

export const IconInbox = wrap(
  <>
    <path d="M3 12h4l2 3h6l2-3h4" />
    <path d="M5 6h14l2 6v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" />
  </>,
)
export const IconUser = wrap(
  <>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
  </>,
)
export const IconBuilding = wrap(
  <>
    <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M10.5 20.5v-3h3v3" />
  </>,
)
export const IconGlobe = wrap(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
  </>,
)
export const IconPhone = wrap(
  <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z" />,
)
export const IconSearch = wrap(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-3.5-3.5" />
  </>,
)
export const IconClose = wrap(<path d="M6 6l12 12M18 6L6 18" />)
export const IconCheck = wrap(<path d="M5 12.5l4 4 10-10" />)
export const IconCalendar = wrap(
  <>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </>,
)
export const IconDoc = wrap(
  <>
    <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v4h4M9 12h6M9 15.5h6" />
  </>,
)
export const IconBolt = wrap(<path d="M13 3 5 13h5l-1 8 8-10h-5l1-8z" />)
export const IconLink = wrap(
  <>
    <path d="M9 15l6-6" />
    <path d="M10.5 7.5 12 6a3.5 3.5 0 0 1 5 5l-1.5 1.5" />
    <path d="M13.5 16.5 12 18a3.5 3.5 0 0 1-5-5l1.5-1.5" />
  </>,
)
export const IconRuble = wrap(
  <>
    <path d="M9 20V4h4.5a4 4 0 0 1 0 8H9" />
    <path d="M6.5 15.5h6M6.5 12H9" />
  </>,
)
export const IconArrow = wrap(<path d="M5 12h13M13 6l6 6-6 6" />)
export const IconLayers = wrap(
  <>
    <path d="M12 3 3 8l9 5 9-5-9-5z" />
    <path d="M3 13l9 5 9-5M3 17l9 5 9-5" opacity="0.5" />
  </>,
)
export const IconClock = wrap(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
)

export const IconChat = wrap(
  <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
)
export const IconUsers = wrap(
  <>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M16.5 19a5.5 5.5 0 0 0-2.5-4.6" opacity="0.7" />
  </>,
)

export const ICONS = {
  inbox: IconInbox,
  user: IconUser,
  building: IconBuilding,
  globe: IconGlobe,
}
