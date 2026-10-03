// Turns what people type into working links. Pure functions, covered by unit tests.

const digits = (value: string) => value.replace(/\D/g, '')

/** wa.me link; Brazilian numbers typed without "+" and country code get +55. */
export function whatsappUrl(value: string): string | null {
  let number = digits(value)
  if (number.length < 8) return null
  const hasCountryCode = value.trim().startsWith('+')
  if (!hasCountryCode && (number.length === 10 || number.length === 11)) number = `55${number}`
  return `https://wa.me/${number}`
}

export function phoneUrl(value: string): string | null {
  const trimmed = value.trim()
  const number = digits(trimmed)
  if (number.length < 3) return null
  return `tel:${trimmed.startsWith('+') ? '+' : ''}${number}`
}

/** Accepts "@perfil", "perfil" or a full instagram.com URL. */
export function instagramUrl(value: string): string | null {
  const handle = value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
  if (!/^[\w.]{1,30}$/.test(handle)) return null
  return `https://instagram.com/${handle}`
}

export function websiteUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed || /\s/.test(trimmed)) return null
  const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('.') ? parsed.href : null
  } catch {
    return null
  }
}
