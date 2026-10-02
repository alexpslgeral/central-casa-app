import { EmptyState } from '../components/EmptyState'
import { IconToday } from '../components/icons'

export function HojeTab() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-extrabold">Hoje</h1>
      <EmptyState
        icon={<IconToday className="size-10" />}
        title="Nada por aqui ainda"
        text="As tarefas da casa vão aparecer aqui."
      />
    </section>
  )
}
