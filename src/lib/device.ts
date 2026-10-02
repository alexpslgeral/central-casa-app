import { useCallback, useState } from 'react'

// Who this device belongs to. The Firebase account is shared, so this is a local choice.
export type DeviceRole = { kind: 'member'; memberId: string } | { kind: 'kitchen' }

const STORAGE_KEY = 'casa.device'

function readRole(): DeviceRole | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw)
    if (value?.kind === 'kitchen') return { kind: 'kitchen' }
    if (value?.kind === 'member' && typeof value.memberId === 'string') {
      return { kind: 'member', memberId: value.memberId }
    }
  } catch {
    // Storage unavailable or corrupted: ask again.
  }
  return null
}

export function useDeviceRole() {
  const [role, setRoleState] = useState<DeviceRole | null>(readRole)

  const setRole = useCallback((next: DeviceRole) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Still works for this session even if it cannot be saved.
    }
    setRoleState(next)
  }, [])

  return [role, setRole] as const
}
