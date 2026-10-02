import { useEffect, useState } from 'react'
import { useSnackbar } from '../components/Snackbar'
import type { Member } from '../lib/members'
import { createList, deleteList, updateList, type Item, type ShoppingList } from '../lib/shopping'
import { LoadingScreen } from '../screens/LoadingScreen'
import { ListDetail } from './compras/ListDetail'
import { ListSheet } from './compras/ListSheet'
import { ListsOverview } from './compras/ListsOverview'

type Props = {
  lists: ShoppingList[] | null
  items: Item[] | null
  members: Member[]
  memberId: string | null
}

// No router: an open list is pushed onto browser history so the phone's back button closes it.
const HISTORY_KEY = 'casaList'

export function ComprasTab({ lists, items, members, memberId }: Props) {
  const snackbar = useSnackbar()
  const [openListId, setOpenListId] = useState<string | null>(
    () => (history.state as Record<string, string> | null)?.[HISTORY_KEY] ?? null,
  )
  // undefined: sheet closed; null: creating; a list: editing it.
  const [sheetList, setSheetList] = useState<ShoppingList | null | undefined>(undefined)

  useEffect(() => {
    const onPop = (e: PopStateEvent) => setOpenListId(e.state?.[HISTORY_KEY] ?? null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (!lists || !items) return <LoadingScreen />

  const openList = (id: string) => {
    history.pushState({ [HISTORY_KEY]: id }, '')
    setOpenListId(id)
  }
  const closeList = () => {
    if (history.state?.[HISTORY_KEY]) history.back()
    else setOpenListId(null)
  }
  const itemsOf = (listId: string) => items.filter((i) => i.listId === listId)

  function removeList(list: ShoppingList, message: string) {
    if (openListId === list.id) closeList()
    deleteList(list.id, itemsOf(list.id))
    snackbar(message)
  }

  const current = lists.find((l) => l.id === openListId)

  return (
    <>
      {current ? (
        <ListDetail
          list={current}
          items={itemsOf(current.id)}
          members={members}
          memberId={memberId}
          onBack={closeList}
          onEdit={() => setSheetList(current)}
          onFinish={() => removeList(current, `Lista "${current.name}" encerrada`)}
        />
      ) : (
        <ListsOverview
          lists={lists}
          items={items}
          onOpen={(list) => openList(list.id)}
          onEdit={(list) => setSheetList(list)}
          onCreate={() => setSheetList(null)}
        />
      )}

      <ListSheet
        open={sheetList !== undefined}
        list={sheetList ?? undefined}
        itemCount={sheetList ? itemsOf(sheetList.id).length : 0}
        onClose={() => setSheetList(undefined)}
        onSave={(fields) => {
          if (sheetList) updateList(sheetList.id, fields)
          else openList(createList(fields.name, fields.kind, memberId))
          setSheetList(undefined)
        }}
        onDelete={() => {
          if (sheetList) removeList(sheetList, `Lista "${sheetList.name}" excluída`)
          setSheetList(undefined)
        }}
      />
    </>
  )
}
