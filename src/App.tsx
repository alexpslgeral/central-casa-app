import { useState } from 'react'
import { Header } from './components/Header'
import { TabBar, type TabId } from './components/TabBar'
import { useAuthUser } from './lib/auth'
import { useDeviceRole } from './lib/device'
import { isFirebaseConfigured } from './lib/firebase'
import { useMembers } from './lib/members'
import { useToday } from './lib/useToday'
import { LoadingScreen } from './screens/LoadingScreen'
import { LoginScreen } from './screens/LoginScreen'
import { MessageScreen } from './screens/MessageScreen'
import { WhoAreYouScreen } from './screens/WhoAreYouScreen'
import { ComprasTab } from './tabs/ComprasTab'
import { DespensaTab } from './tabs/DespensaTab'
import { HojeTab } from './tabs/HojeTab'

export default function App() {
  if (!isFirebaseConfigured) {
    return (
      <MessageScreen
        title="Falta configurar o Firebase"
        text="Preencha o arquivo src/firebase-config.ts seguindo o README."
      />
    )
  }
  return <AuthGate />
}

function AuthGate() {
  const user = useAuthUser()
  if (user === undefined) return <LoadingScreen />
  if (user === null) return <LoginScreen />
  return <SignedInApp />
}

function SignedInApp() {
  const { members, errorCode } = useMembers()
  const [role, setRole] = useDeviceRole()
  const [choosingPerson, setChoosingPerson] = useState(false)
  const [tab, setTab] = useState<TabId>('hoje')
  const today = useToday()

  if (errorCode) {
    return errorCode === 'permission-denied' ? (
      <MessageScreen
        title="Sem acesso aos dados"
        text="As regras do Firestore não reconhecem esta conta. Confira o UID em firestore.rules."
        actionLabel="Tentar de novo"
        onAction={() => location.reload()}
      />
    ) : (
      <MessageScreen
        title="Não foi possível carregar"
        text="Verifique a internet e tente de novo."
        actionLabel="Tentar de novo"
        onAction={() => location.reload()}
      />
    )
  }

  if (!members) return <LoadingScreen />

  const member = role?.kind === 'member' ? members.find((m) => m.id === role.memberId) : undefined
  // Ask again if nothing is saved or the saved person no longer exists.
  const needsChoice = !role || (role.kind === 'member' && !member)

  if (needsChoice || choosingPerson) {
    return (
      <WhoAreYouScreen
        members={members}
        current={role}
        onChoose={(next) => {
          setRole(next)
          setChoosingPerson(false)
        }}
        onCancel={needsChoice ? undefined : () => setChoosingPerson(false)}
      />
    )
  }

  return (
    <div className="min-h-dvh">
      <Header today={today} role={role} member={member} onChangePerson={() => setChoosingPerson(true)} />
      <main className="mx-auto max-w-2xl px-4 pt-2 pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
        {tab === 'hoje' && <HojeTab />}
        {tab === 'compras' && <ComprasTab />}
        {tab === 'despensa' && <DespensaTab />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
