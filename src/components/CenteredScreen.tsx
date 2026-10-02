import type { ReactNode } from 'react'
import { IconHouse } from './icons'

export function CenteredScreen({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      {children}
    </main>
  )
}

export function AppLogo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`flex size-20 items-center justify-center rounded-3xl bg-brand text-white shadow-card ${className}`}
    >
      <IconHouse className="size-11" />
    </span>
  )
}
