import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  text: string
}

export function EmptyState({ icon, title, text }: Props) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-surface px-6 py-12 text-center shadow-card">
      <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-brand-soft text-brand">
        {icon}
      </span>
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="mt-2 text-lg text-muted">{text}</p>
    </div>
  )
}
