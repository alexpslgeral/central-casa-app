import { useState, type FormEvent } from 'react'
import { AppLogo, CenteredScreen } from '../components/CenteredScreen'
import { FAMILY_EMAIL } from '../firebase-config'
import { signInErrorMessage, signInFamily } from '../lib/auth'

export function LoginScreen() {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    if (!password) {
      setError('Digite a senha.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      // On success the auth listener in App swaps this screen out.
      await signInFamily(password)
    } catch (err) {
      setError(signInErrorMessage(err))
      setBusy(false)
    }
  }

  return (
    <CenteredScreen>
      <div className="mb-8 flex flex-col items-center text-center">
        <AppLogo />
        <h1 className="mt-5 text-4xl font-extrabold">Casa</h1>
        <p className="mt-1 text-lg text-muted">Tarefas e compras da família</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="rounded-3xl bg-surface p-6 shadow-card">
        {/* Lets password managers save the login under the family email. */}
        <input type="email" name="username" autoComplete="username" value={FAMILY_EMAIL} readOnly hidden />

        <label htmlFor="password" className="text-lg font-bold">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          enterKeyHint="go"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'password-error' : undefined}
          className="mt-2 h-14 w-full rounded-2xl border-2 border-line bg-canvas px-4 text-xl focus:border-brand focus:bg-surface"
        />
        {error && (
          <p id="password-error" role="alert" className="mt-3 text-base font-bold text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 h-14 w-full rounded-2xl bg-brand text-xl font-extrabold text-white active:bg-brand-strong disabled:opacity-70"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </CenteredScreen>
  )
}
