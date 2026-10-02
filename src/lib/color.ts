const INK = '#172033'
const WHITE = '#ffffff'

function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value
  const channels = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** White or dark text, whichever reads better on the given background color. */
export function readableTextColor(background: string): string {
  if (!/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(background)) return WHITE
  return contrast(background, WHITE) >= contrast(background, INK) ? WHITE : INK
}
