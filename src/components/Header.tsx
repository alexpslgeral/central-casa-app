import { formatDayMonth, formatWeekday } from '../lib/dates'
import type { DeviceRole } from '../lib/device'
import type { Member } from '../lib/members'
import { Avatar } from './Avatar'
import { IconChevronDown, IconPot } from './icons'

type Props = {
  today: string
  role: DeviceRole
  member?: Member
  onChangePerson: () => void
}

export function Header({ today, role, member, onChangePerson }: Props) {
  const name = role.kind === 'kitchen' ? 'Cozinha' : (member?.name ?? '')

  return (
    <header className="sticky top-0 z-20 bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-2">
        <p className="flex shrink-0 flex-col leading-tight">
          <span className="text-sm font-bold text-muted">{formatWeekday(today)}</span>
          <span className="text-lg font-extrabold">{formatDayMonth(today)}</span>
        </p>
        <button
          type="button"
          onClick={onChangePerson}
          aria-label={`Trocar pessoa. Agora: ${name}`}
          className="flex h-14 min-w-0 items-center gap-2 rounded-full bg-surface pr-3 pl-2 shadow-card active:bg-brand-soft"
        >
          {role.kind === 'kitchen' ? (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <IconPot />
            </span>
          ) : (
            member && <Avatar member={member} />
          )}
          <span className="truncate text-lg font-bold">{name}</span>
          <IconChevronDown className="size-5 shrink-0 text-muted" />
        </button>
      </div>
    </header>
  )
}
