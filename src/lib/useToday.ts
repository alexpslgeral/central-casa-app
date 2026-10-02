import { useEffect, useState } from 'react'
import { toLocalISODate } from './dates'

/**
 * Today's São Paulo date, updated shortly after midnight without a reload.
 * Polling (instead of one long timer) stays correct after the device sleeps.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => toLocalISODate())

  useEffect(() => {
    const check = () => setToday(toLocalISODate())
    const timer = window.setInterval(check, 30_000)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  return today
}
