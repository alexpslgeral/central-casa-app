import type { Member } from '../lib/members'
import { Avatar, EveryoneAvatar } from './Avatar'

type Props = {
  members: Member[]
  /** Selected member ids; empty means "Todos". */
  value: string[]
  onChange: (consumers: string[]) => void
  wrap?: boolean
}

const CHIP = 'flex h-14 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-lg font-bold transition-colors'
const chipState = (selected: boolean) =>
  selected ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-ink active:bg-canvas'

export function ConsumerChips({ members, value, onChange, wrap = false }: Props) {
  function toggle(id: string) {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    // Everyone selected is the same as "Todos".
    onChange(next.length === members.length ? [] : next)
  }

  return (
    <div
      role="group"
      aria-label="Para quem"
      className={`flex gap-2 ${wrap ? 'flex-wrap' : '-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]'}`}
    >
      <button
        type="button"
        aria-pressed={value.length === 0}
        onClick={() => onChange([])}
        className={`${CHIP} pl-1.5 ${chipState(value.length === 0)}`}
      >
        <EveryoneAvatar size="sm" />
        Todos
      </button>
      {members.map((member) => {
        const selected = value.includes(member.id)
        return (
          <button
            key={member.id}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(member.id)}
            className={`${CHIP} pl-1.5 ${chipState(selected)}`}
          >
            <Avatar member={member} size="sm" />
            {member.name}
          </button>
        )
      })}
    </div>
  )
}
