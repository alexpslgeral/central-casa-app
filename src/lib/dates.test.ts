import { describe, expect, it } from 'vitest'
import { formatDayMonth, formatWeekday, toLocalISODate } from './dates'

describe('toLocalISODate', () => {
  it('uses the São Paulo calendar day, not UTC', () => {
    // São Paulo is UTC-3, so 02:59 UTC on Jan 1 is still Dec 31 locally.
    expect(toLocalISODate(new Date('2026-01-01T02:59:59Z'))).toBe('2025-12-31')
    expect(toLocalISODate(new Date('2026-01-01T03:00:00Z'))).toBe('2026-01-01')
  })

  it('zero-pads month and day', () => {
    expect(toLocalISODate(new Date('2026-03-05T15:00:00Z'))).toBe('2026-03-05')
  })
})

describe('header date formatting', () => {
  it('formats in Brazilian Portuguese with a capitalized weekday', () => {
    expect(formatWeekday('2026-10-02')).toBe('Sexta-feira')
    expect(formatDayMonth('2026-10-02')).toBe('2 de outubro')
    expect(formatWeekday('2027-01-03')).toBe('Domingo')
    expect(formatDayMonth('2027-01-03')).toBe('3 de janeiro')
  })
})
