import { IconArrowLeft, IconCheck, IconPot } from '../components/icons'
import { readableTextColor } from '../lib/color'
import type { DeviceRole } from '../lib/device'
import type { Member } from '../lib/members'

type Props = {
  members: Member[]
  current: DeviceRole | null
  onChoose: (role: DeviceRole) => void
  onCancel?: () => void
}

const TILE =
  'relative flex min-h-40 flex-col justify-between gap-3 rounded-3xl p-5 text-left shadow-card transition-transform active:scale-[0.97]'

function SelectedBadge() {
  return (
    <span className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white text-ink shadow-card">
      <IconCheck className="size-6" />
      <span className="sr-only">(escolhido)</span>
    </span>
  )
}

export function WhoAreYouScreen({ members, current, onChoose, onCancel }: Props) {
  const isKitchen = current?.kind === 'kitchen'

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="-ml-2 flex h-14 items-center gap-2 self-start rounded-2xl px-3 text-lg font-bold text-muted active:bg-surface"
        >
          <IconArrowLeft />
          Voltar
        </button>
      )}

      <h1 className="mt-6 text-4xl font-extrabold">Quem é você?</h1>
      <p className="mt-2 text-lg text-muted">Toque no seu nome.</p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {members.map((member) => {
          const selected = current?.kind === 'member' && current.memberId === member.id
          const textColor = readableTextColor(member.color)
          const lightText = textColor === '#ffffff'
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onChoose({ kind: 'member', memberId: member.id })}
              className={TILE}
              style={{ backgroundColor: member.color, color: textColor }}
            >
              <span
                aria-hidden="true"
                className={`flex size-14 items-center justify-center rounded-full text-2xl font-extrabold ${
                  lightText ? 'bg-white/25' : 'bg-black/10'
                }`}
              >
                {member.name.trim().charAt(0).toUpperCase() || '?'}
              </span>
              <span className="text-2xl leading-tight font-extrabold break-words">{member.name}</span>
              {selected && <SelectedBadge />}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onChoose({ kind: 'kitchen' })}
          className={`${TILE} border-2 border-line bg-surface text-ink`}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <IconPot className="size-8" />
          </span>
          <span className="text-2xl leading-tight font-extrabold">Tablet da cozinha</span>
          {isKitchen && <SelectedBadge />}
        </button>
      </div>
    </main>
  )
}
