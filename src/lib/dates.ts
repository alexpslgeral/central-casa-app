// All calendar dates in the app are São Paulo dates, stored as plain YYYY-MM-DD strings.
export const TIME_ZONE = 'America/Sao_Paulo'

const isoDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, weekday: 'long' })

const dayMonthFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'long',
})

/** The São Paulo calendar date (YYYY-MM-DD) of the given instant. */
export function toLocalISODate(instant: Date = new Date()): string {
  const parts = isoDateFormatter.formatToParts(instant)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

// Noon UTC is 09:00 in São Paulo, so formatting a YYYY-MM-DD date never shifts the day.
const middayOf = (isoDate: string) => new Date(`${isoDate}T12:00:00Z`)

/** "Sexta-feira" for a YYYY-MM-DD date. */
export function formatWeekday(isoDate: string): string {
  const text = weekdayFormatter.format(middayOf(isoDate))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "2 de outubro" for a YYYY-MM-DD date. */
export function formatDayMonth(isoDate: string): string {
  return dayMonthFormatter.format(middayOf(isoDate))
}
