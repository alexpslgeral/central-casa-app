import { CenteredScreen } from '../components/CenteredScreen'
import { IconAlert } from '../components/icons'

type Props = {
  title: string
  text: string
  actionLabel?: string
  onAction?: () => void
}

export function MessageScreen({ title, text, actionLabel, onAction }: Props) {
  return (
    <CenteredScreen>
      <div role="alert" className="flex flex-col items-center rounded-3xl bg-surface p-8 text-center shadow-card">
        <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-danger-soft text-danger">
          <IconAlert className="size-9" />
        </span>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-2 text-lg text-muted">{text}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 h-14 w-full rounded-2xl bg-brand text-xl font-extrabold text-white active:bg-brand-strong"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </CenteredScreen>
  )
}
