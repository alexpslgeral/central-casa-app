// Notes are stored as HTML produced by the browser's rich-text editing. Before rendering,
// keep only the small set of formatting the editor can create and drop everything else.

const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'P', 'DIV', 'BR', 'FONT', 'SPAN'])
const DROP_WITH_CONTENT = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'SVG', 'MATH'])

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.\s,%]+\))$/i
const STYLE_RULES: Record<string, RegExp> = {
  color: COLOR,
  'font-weight': /^(bold|[1-9]00|normal)$/,
  'font-style': /^(italic|normal)$/,
  'font-size': /^(small|medium|large|x-large|xx-large|xxx-large|-webkit-xxx-large|\d{1,2}(\.\d+)?(px|em|rem))$/,
}

function cleanStyle(style: string): string {
  return style
    .split(';')
    .map((rule) => rule.split(':').map((part) => part.trim().toLowerCase()))
    .filter(([prop, value]) => prop && value && STYLE_RULES[prop]?.test(value))
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ')
}

function cleanChildren(parent: Element) {
  for (const node of [...parent.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) continue
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove()
      continue
    }
    const el = node as Element
    if (DROP_WITH_CONTENT.has(el.tagName)) {
      el.remove()
      continue
    }
    cleanChildren(el)
    if (!ALLOWED_TAGS.has(el.tagName)) {
      el.replaceWith(...el.childNodes)
      continue
    }
    for (const attr of [...el.attributes]) {
      const { name, value } = attr
      const keep =
        (el.tagName === 'FONT' && name === 'size' && /^[1-7]$/.test(value)) ||
        (el.tagName === 'FONT' && name === 'color' && COLOR.test(value)) ||
        (name === 'style' && cleanStyle(value) !== '')
      if (!keep) el.removeAttribute(name)
      else if (name === 'style') el.setAttribute('style', cleanStyle(value))
    }
  }
}

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  if (!root) return ''
  cleanChildren(root)
  return root.innerHTML
}
