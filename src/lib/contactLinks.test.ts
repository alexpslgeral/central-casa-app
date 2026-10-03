import { describe, expect, it } from 'vitest'
import { instagramUrl, phoneUrl, websiteUrl, whatsappUrl } from './contactLinks'

describe('whatsappUrl', () => {
  it('adds the Brazilian country code to local numbers', () => {
    expect(whatsappUrl('(11) 98765-4321')).toBe('https://wa.me/5511987654321')
    expect(whatsappUrl('11 3333-4444')).toBe('https://wa.me/551133334444')
  })
  it('keeps numbers that already have a country code', () => {
    expect(whatsappUrl('+55 11 98765-4321')).toBe('https://wa.me/5511987654321')
    expect(whatsappUrl('+56 9 1234 5678')).toBe('https://wa.me/56912345678')
  })
  it('rejects too-short input', () => {
    expect(whatsappUrl('123')).toBeNull()
  })
})

describe('phoneUrl', () => {
  it('builds tel links', () => {
    expect(phoneUrl('(11) 3333-4444')).toBe('tel:1133334444')
    expect(phoneUrl('+55 11 3333-4444')).toBe('tel:+551133334444')
    expect(phoneUrl('190')).toBe('tel:190')
  })
})

describe('instagramUrl', () => {
  it('accepts handles and profile URLs', () => {
    expect(instagramUrl('@fidu.viagens')).toBe('https://instagram.com/fidu.viagens')
    expect(instagramUrl('fidu_viagens')).toBe('https://instagram.com/fidu_viagens')
    expect(instagramUrl('https://www.instagram.com/fidu/?hl=pt')).toBe('https://instagram.com/fidu')
  })
  it('rejects invalid handles', () => {
    expect(instagramUrl('não é perfil')).toBeNull()
  })
})

describe('websiteUrl', () => {
  it('adds https when missing', () => {
    expect(websiteUrl('fidu.com.br')).toBe('https://fidu.com.br/')
    expect(websiteUrl('http://exemplo.com/a')).toBe('http://exemplo.com/a')
  })
  it('rejects text that is not a site', () => {
    expect(websiteUrl('sem site')).toBeNull()
    expect(websiteUrl('localhost')).toBeNull()
  })
})
