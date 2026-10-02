import { readableTextColor } from '../lib/color'
import { IconUsers } from './icons'
import type { Member } from '../lib/members'

const SIZES = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-lg',
  lg: 'size-14 text-2xl',
}

type Props = {
  member: Pick<Member, 'name' | 'color'>
  size?: keyof typeof SIZES
}

export function Avatar({ member, size = 'md' }: Props) {
  const initial = member.name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ${SIZES[size]}`}
      style={{ backgroundColor: member.color, color: readableTextColor(member.color) }}
    >
      {initial}
    </span>
  )
}

/** Stands in for an avatar when something belongs to everyone in the house. */
export function EveryoneAvatar({ size = 'md' }: { size?: keyof typeof SIZES }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand ${SIZES[size]}`}
    >
      <IconUsers className={size === 'sm' ? 'size-5' : size === 'md' ? 'size-6' : 'size-8'} />
    </span>
  )
}
