import { AppLogo, CenteredScreen } from '../components/CenteredScreen'

export function LoadingScreen() {
  return (
    <CenteredScreen>
      <div role="status" className="flex flex-col items-center gap-4">
        <AppLogo className="animate-pulse" />
        <p className="text-lg font-bold text-muted">Carregando…</p>
      </div>
    </CenteredScreen>
  )
}
