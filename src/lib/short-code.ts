// src/lib/short-code.ts

import { randomBytes } from 'crypto'

/**
 * Characters used for short codes (URL-safe, unambiguous)
 * Excludes: 0, O, I, l, 1 to avoid confusion
 */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'

/**
 * Generate a random short code
 */
export function generateShortCode(length: number = 8): string {
  const bytes = randomBytes(length)
  let code = ''

  for (let i = 0; i < length; i++) {
    const byte = bytes[i]
    if (byte !== undefined) {
      code += ALPHABET[byte % ALPHABET.length]
    }
  }

  return code
}

/**
 * Validate short code format
 */
export function isValidShortCode(code: string): boolean {
  if (code.length < 6 || code.length > 12) return false
  return /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz]+$/.test(code)
}

/**
 * Generate share URL from short code
 */
export function getShareUrl(shortCode: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''
  return `${base}/s/${shortCode}`
}

/**
 * Generate full debate URL
 */
export function getDebateUrl(debateId: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''
  return `${base}/debate/${debateId}/summary`
}
