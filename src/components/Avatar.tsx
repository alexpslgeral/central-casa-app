import { readableTextColor } from '../lib/color'
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
