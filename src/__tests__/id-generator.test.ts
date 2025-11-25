// src/__tests__/id-generator.test.ts
import { describe, expect, it } from 'vitest'

import { generateDebateId, isValidDebateId } from '@/lib/id-generator'

describe('id-generator', () => {
  describe('generateDebateId', () => {
    it('should generate an ID with the correct prefix', () => {
      const id = generateDebateId()
      expect(id.startsWith('db_')).toBe(true)
    })

    it('should generate an ID with the correct length (19 chars: db_ + 16 base64url)', () => {
      const id = generateDebateId()
      expect(id.length).toBe(19)
    })

    it('should generate unique IDs', () => {
      const ids = new Set<string>()
      for (let i = 0; i < 1000; i++) {
        ids.add(generateDebateId())
      }
      expect(ids.size).toBe(1000)
    })

    it('should generate IDs that pass validation', () => {
      for (let i = 0; i < 100; i++) {
        const id = generateDebateId()
        expect(isValidDebateId(id)).toBe(true)
      }
    })

    it('should only contain valid base64url characters after prefix', () => {
      const id = generateDebateId()
      const suffix = id.slice(3)
      expect(suffix).toMatch(/^[A-Za-z0-9_-]+$/)
    })
  })

  describe('isValidDebateId', () => {
    it('should accept valid debate IDs', () => {
      expect(isValidDebateId('db_1234567890123456')).toBe(true)
      expect(isValidDebateId('db_ABCDEFGHIJKLMNOP')).toBe(true)
      expect(isValidDebateId('db_abc-_123XYZ78901')).toBe(true)
    })

    it('should reject IDs without the correct prefix', () => {
      expect(isValidDebateId('1234567890123456789')).toBe(false)
      expect(isValidDebateId('deb_123456789012345')).toBe(false)
      expect(isValidDebateId('debate_1234567890123')).toBe(false)
    })

    it('should reject IDs with incorrect length', () => {
      expect(isValidDebateId('db_123')).toBe(false)
      expect(isValidDebateId('db_12345678901234567890')).toBe(false)
      expect(isValidDebateId('db_')).toBe(false)
    })

    it('should reject IDs with invalid characters', () => {
      expect(isValidDebateId('db_123456789012345!')).toBe(false)
      expect(isValidDebateId('db_12345678901234 6')).toBe(false)
      expect(isValidDebateId('db_1234567890123.56')).toBe(false)
    })

    it('should reject empty strings and non-strings', () => {
      expect(isValidDebateId('')).toBe(false)
      // @ts-expect-error testing invalid input
      expect(isValidDebateId(null)).toBe(false)
      // @ts-expect-error testing invalid input
      expect(isValidDebateId(undefined)).toBe(false)
      // @ts-expect-error testing invalid input
      expect(isValidDebateId(123)).toBe(false)
    })
  })
})
