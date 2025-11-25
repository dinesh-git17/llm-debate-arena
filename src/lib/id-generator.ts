// src/lib/id-generator.ts
import { randomBytes } from 'crypto'

/**
 * Generates a cryptographically secure unique ID for debates.
 * Format: db_xxxxxxxxxxxxxxxxxxxx (20 chars total: prefix + 16 char base64url)
 */
export function generateDebateId(): string {
  const bytes = randomBytes(12)
  const id = bytes.toString('base64url')
  return `db_${id}`
}

/**
 * Validates a debate ID format.
 * Expected format: db_ followed by 16 base64url characters
 */
export function isValidDebateId(id: string): boolean {
  return /^db_[A-Za-z0-9_-]{16}$/.test(id)
}
