import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Bottom sheet on phones, centered card on wider screens. */
export function Sheet({ open, title, onClose, children }: Props) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-bar sm:rounded-3xl"
      >
        <h2 id={titleId} className="mb-5 text-2xl font-extrabold">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export const BUTTON_PRIMARY =
  'h-14 w-full rounded-2xl bg-brand text-xl font-extrabold text-white active:bg-brand-strong'
export const BUTTON_SECONDARY =
  'h-14 w-full rounded-2xl bg-canvas text-xl font-extrabold text-ink active:bg-line'
export const BUTTON_DANGER =
  'h-14 w-full rounded-2xl bg-danger-soft text-xl font-extrabold text-danger active:bg-red-100'
export const INPUT =
  'h-14 w-full rounded-2xl border-2 border-line bg-canvas px-4 text-xl focus:border-brand focus:bg-surface'
