import { useRef, type MouseEvent, type PointerEvent } from 'react'

const LONG_PRESS_MS = 500
const MOVE_TOLERANCE_PX = 10

/** Tap runs onTap; holding for half a second runs onLongPress instead. Scrolling cancels. */
export function useLongPress(onLongPress: () => void, onTap: () => void) {
  const timer = useRef<number | undefined>(undefined)
  const fired = useRef(false)
  const start = useRef<{ x: number; y: number } | null>(null)

  const cancel = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
    start.current = null
  }

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0) return
      fired.current = false
      start.current = { x: e.clientX, y: e.clientY }
      timer.current = window.setTimeout(() => {
        fired.current = true
        navigator.vibrate?.(30)
        onLongPress()
      }, LONG_PRESS_MS)
    },
    onPointerMove: (e: PointerEvent) => {
      const s = start.current
      if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > MOVE_TOLERANCE_PX) cancel()
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onClick: () => {
      if (fired.current) {
        fired.current = false
        return
      }
      onTap()
    },
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
  }
}
