import { EmptyState } from '../components/EmptyState'
import { IconCart } from '../components/icons'

export function ComprasTab() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-extrabold">Compras</h1>
      <EmptyState
        icon={<IconCart className="size-10" />}
        title="Nada por aqui ainda"
        text="A lista de compras vai aparecer aqui."
      />
    </section>
  )
}
