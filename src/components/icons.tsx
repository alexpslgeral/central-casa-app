import type { ReactNode } from 'react'

type IconProps = { className?: string }

function Svg({ className = 'size-6', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const IconHouse = (props: IconProps) => (
  <Svg {...props}>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
    <path d="M10 20v-6h4v6" />
  </Svg>
)

export const IconToday = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.8 2.8L16.5 9.5" />
  </Svg>
)

export const IconCart = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3.5h2.6l2.4 12h11.2l2-8.5H6.2" />
  </Svg>
)

export const IconPantry = (props: IconProps) => (
  <Svg {...props}>
    <rect x="3" y="4" width="18" height="5" rx="1.5" />
    <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
    <path d="M10 13h4" />
  </Svg>
)

export const IconPot = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M2 11h2M20 11h2" />
    <path d="M9 7.5c0-1.2 1.2-1.3 1.2-2.5M14 7.5c0-1.2 1.2-1.3 1.2-2.5" />
  </Svg>
)

export const IconChevronDown = (props: IconProps) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const IconArrowLeft = (props: IconProps) => (
  <Svg {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
)

export const IconCheck = (props: IconProps) => (
  <Svg {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const IconAlert = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.5v.01" />
  </Svg>
)

export const IconPlus = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IconPencil = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="m13.5 6.5 4 4" />
  </Svg>
)

export const IconChevronRight = (props: IconProps) => (
  <Svg {...props}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const IconRepeat = (props: IconProps) => (
  <Svg {...props}>
    <path d="M17 2.5 20.5 6 17 9.5" />
    <path d="M3.5 11V9a3 3 0 0 1 3-3h14" />
    <path d="M7 21.5 3.5 18 7 14.5" />
    <path d="M20.5 13v2a3 3 0 0 1-3 3h-14" />
  </Svg>
)

export const IconParty = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 20 9 7l8 8z" />
    <path d="M14 4.5c.5 1 .3 2-.5 2.8M19.5 10c-1-.5-2-.3-2.8.5" />
    <path d="M17 3v.01M21 7v.01M20 3.5v.01" />
  </Svg>
)

export const IconTrash = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 7h16" />
    <path d="M9 7V4.5h6V7" />
    <path d="M6 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
)

export const IconUsers = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
    <path d="M15.5 4.9a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.5 14.3c2.1.6 3.5 2.6 3.5 5.2" />
  </Svg>
)

export const IconPin = (props: IconProps) => (
  <Svg {...props}>
    <path d="M9 3.5h6l-1 6 3.5 3.5h-11L10 9.5z" />
    <path d="M12 13v7.5" />
  </Svg>
)

export const IconListBullet = (props: IconProps) => (
  <Svg {...props}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4.5 6v.01M4.5 12v.01M4.5 18v.01" strokeWidth={3.2} />
  </Svg>
)

export const IconListNumber = (props: IconProps) => (
  <Svg {...props}>
    <path d="M10 6h10M10 12h10M10 18h10" />
    <path d="M4 4.5h1.5V9M3.8 9h3.2" strokeWidth={1.8} />
    <path d="M3.8 14.3c.4-.6 1-.9 1.6-.9.9 0 1.5.6 1.5 1.3 0 1.4-3.1 2.2-3.1 4.3H7" strokeWidth={1.8} />
  </Svg>
)

export const IconContacts = (props: IconProps) => (
  <Svg {...props}>
    <rect x="4" y="3" width="15" height="18" rx="2" />
    <circle cx="11.5" cy="10" r="2.6" />
    <path d="M7.5 17c.6-2 2.1-3 4-3s3.4 1 4 3" />
    <path d="M19 7h2M19 12h2M19 17h2" />
  </Svg>
)

export const IconPhone = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z" />
  </Svg>
)

export const IconGlobe = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" />
  </Svg>
)

export const IconWhatsapp = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 20.5 5.3 16.6A8.5 8.5 0 1 1 8.6 19.6z" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.3-2.3l.9-1-1-2z" strokeWidth={1.6} />
  </Svg>
)

export const IconInstagram = (props: IconProps) => (
  <Svg {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17 7v.01" strokeWidth={3} />
  </Svg>
)

export const IconSearch = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Svg>
)
