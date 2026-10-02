import { EmptyState } from '../components/EmptyState'
import { IconPantry } from '../components/icons'

export function DespensaTab() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-extrabold">Despensa</h1>
      <EmptyState
        icon={<IconPantry className="size-10" />}
        title="Nada por aqui ainda"
        text="O que tem em casa vai aparecer aqui."
      />
    </section>
  )
}
