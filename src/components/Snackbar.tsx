import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type ShowSnackbar = (message: string, onUndo?: () => void) => void

type Snack = { key: number; message: string; onUndo?: () => void }

const SnackbarContext = createContext<ShowSnackbar>(() => {})

export const useSnackbar = () => useContext(SnackbarContext)

const DURATION_MS = 5000

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snack, setSnack] = useState<Snack | null>(null)

  const show = useCallback<ShowSnackbar>((message, onUndo) => {
    setSnack({ key: Date.now(), message, onUndo })
  }, [])

  useEffect(() => {
    if (!snack) return
    const timer = window.setTimeout(() => setSnack(null), DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [snack])

  return (
    <SnackbarContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4"
      >
        {snack && (
          <div
            key={snack.key}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-ink py-2 pr-2 pl-5 text-white shadow-bar"
          >
            <p className="min-w-0 flex-1 text-lg font-semibold">{snack.message}</p>
            {snack.onUndo && (
              <button
                type="button"
                onClick={() => {
                  snack.onUndo?.()
                  setSnack(null)
                }}
                className="h-14 shrink-0 rounded-xl px-4 text-lg font-extrabold text-sky-300 active:bg-white/10"
              >
                Desfazer
              </button>
            )}
          </div>
        )}
      </div>
    </SnackbarContext.Provider>
  )
}
