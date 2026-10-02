import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconListBullet, IconListNumber } from '../../components/icons'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Sheet } from '../../components/Sheet'
import { PAPER_COLORS, type Note, type PaperColor } from '../../lib/notes'
import { sanitizeHtml } from '../../lib/sanitize'

type Props = {
  open: boolean
  /** The note being edited, or undefined to write a new one. */
  note?: Note
  onClose: () => void
  onSave: (html: string, color: PaperColor) => void
}

const PAPER_LABELS: Record<PaperColor, string> = {
  amarelo: 'Amarelo',
  rosa: 'Rosa',
  azul: 'Azul',
  verde: 'Verde',
  branco: 'Branco',
}

const TEXT_COLORS = [
  { label: 'Preto', value: '#172033' },
  { label: 'Vermelho', value: '#b91c1c' },
  { label: 'Azul', value: '#1d4ed8' },
  { label: 'Verde', value: '#047857' },
  { label: 'Roxo', value: '#7c3aed' },
]

// Values for the browser's fontSize command (1–7).
const SIZES = [
  { label: 'Normal', value: '3' },
  { label: 'Grande', value: '5' },
  { label: 'Enorme', value: '6' },
]

type Formats = { bold: boolean; italic: boolean; ul: boolean; ol: boolean }

const TOOL =
  'flex h-12 min-w-12 shrink-0 items-center justify-center rounded-xl px-3 text-lg font-extrabold transition-colors'
const toolState = (active: boolean) => (active ? 'bg-brand text-white' : 'bg-surface text-ink active:bg-line')

export function NoteEditorSheet({ open, note, onClose, onSave }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState<PaperColor>('amarelo')
  const [formats, setFormats] = useState<Formats>({ bold: false, italic: false, ul: false, ol: false })
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open) return
    setColor(note?.color ?? 'amarelo')
    setError(false)
    // The editor is uncontrolled: load the content once when the sheet opens.
    requestAnimationFrame(() => {
      const editor = editorRef.current
      if (!editor) return
      editor.innerHTML = note ? sanitizeHtml(note.html) : ''
      document.execCommand('styleWithCSS', false, 'false')
      if (!note) editor.focus()
    })
  }, [open, note])

  useEffect(() => {
    if (!open) return
    const update = () =>
      setFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
      })
    document.addEventListener('selectionchange', update)
    return () => document.removeEventListener('selectionchange', update)
  }, [open])

  function exec(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    editorRef.current?.dispatchEvent(new Event('input'))
  }

  function handleSave() {
    const editor = editorRef.current
    if (!editor) return
    if (!editor.textContent?.trim()) {
      setError(true)
      return
    }
    onSave(sanitizeHtml(editor.innerHTML), color)
  }

  return (
    <Sheet open={open} title={note ? 'Editar aviso' : 'Novo aviso'} onClose={onClose}>
      <p className="mb-2 text-lg font-bold">Cor do papel</p>
      <div role="radiogroup" aria-label="Cor do papel" className="flex flex-wrap gap-2">
        {(Object.keys(PAPER_COLORS) as PaperColor[]).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={color === c}
            aria-label={PAPER_LABELS[c]}
            onClick={() => setColor(c)}
            className={`size-14 rounded-2xl border-2 ${color === c ? 'border-brand ring-2 ring-brand' : 'border-line'}`}
            style={{ backgroundColor: PAPER_COLORS[c] }}
          />
        ))}
      </div>

      {/* Toolbar buttons keep focus in the editor, so the selection is not lost. */}
      <div
        role="toolbar"
        aria-label="Formatação"
        onMouseDown={(e) => e.preventDefault()}
        className="mt-5 flex flex-wrap gap-2 rounded-2xl bg-canvas p-2"
      >
        <Tool label="Negrito" active={formats.bold} onClick={() => exec('bold')}>
          B
        </Tool>
        <Tool label="Itálico" active={formats.italic} onClick={() => exec('italic')}>
          <span className="font-serif italic">I</span>
        </Tool>
        <Tool label="Lista com marcadores" active={formats.ul} onClick={() => exec('insertUnorderedList')}>
          <IconListBullet />
        </Tool>
        <Tool label="Lista numerada" active={formats.ol} onClick={() => exec('insertOrderedList')}>
          <IconListNumber />
        </Tool>
        {SIZES.map((size) => (
          <Tool key={size.value} label={`Tamanho ${size.label}`} onClick={() => exec('fontSize', size.value)}>
            <span className={size.value === '3' ? 'text-base' : size.value === '5' ? 'text-xl' : 'text-2xl'}>
              {size.label}
            </span>
          </Tool>
        ))}
        <div className="flex gap-2" aria-label="Cor do texto" role="group">
          {TEXT_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={`Texto ${c.label.toLowerCase()}`}
              onClick={() => exec('foreColor', c.value)}
              className="flex size-12 items-center justify-center rounded-xl bg-surface active:bg-line"
            >
              <span className="size-7 rounded-full" style={{ backgroundColor: c.value }} />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Texto do aviso"
        data-placeholder="Escreva o aviso… Ex.: Senha do Wi-Fi: casa1234"
        onInput={() => setError(false)}
        className="rich mt-3 min-h-48 rounded-2xl border-2 border-line p-4 text-lg leading-relaxed focus:border-brand"
        style={{ backgroundColor: PAPER_COLORS[color] }}
      />
      {error && (
        <p role="alert" className="mt-2 text-base font-bold text-danger">
          Escreva alguma coisa no aviso.
        </p>
      )}

      <div className="mt-6 space-y-3">
        <button type="button" onClick={handleSave} className={BUTTON_PRIMARY}>
          {note ? 'Salvar' : 'Colocar no mural'}
        </button>
        <button type="button" onClick={onClose} className={BUTTON_SECONDARY}>
          Cancelar
        </button>
      </div>
    </Sheet>
  )
}

type ToolProps = { label: string; active?: boolean; onClick: () => void; children: ReactNode }

function Tool({ label, active = false, onClick, children }: ToolProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`${TOOL} ${toolState(active)}`}
    >
      {children}
    </button>
  )
}
