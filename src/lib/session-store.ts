// src/lib/session-store.ts
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

import type { DebateSession, DebateSessionPublic } from '@/types/debate'

const sessionStore = new Map<string, string>()

const SALT = 'llm-debate-arena-session-salt'

function getEncryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required')
  }
  return scryptSync(secret, SALT, 32)
}

function serializeSession(session: DebateSession): string {
  return JSON.stringify({
    ...session,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
  })
}

function deserializeSession(json: string): DebateSession {
  const parsed = JSON.parse(json) as {
    id: string
    topic: string
    turns: number
    format: DebateSession['format']
    customRules: string[]
    assignment: DebateSession['assignment']
    status: DebateSession['status']
    createdAt: string
    updatedAt: string
    expiresAt: string
  }
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
    updatedAt: new Date(parsed.updatedAt),
    expiresAt: new Date(parsed.expiresAt),
  }
}

/**
 * Encrypts session data before storage using AES-256-GCM.
 */
function encryptSession(session: DebateSession): string {
  const key = getEncryptionKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', key, iv)

  const jsonData = serializeSession(session)
  const encrypted = Buffer.concat([cipher.update(jsonData, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  const combined = Buffer.concat([iv, authTag, encrypted])
  return combined.toString('base64')
}

/**
 * Decrypts session data from storage.
 */
function decryptSession(encryptedData: string): DebateSession {
  const key = getEncryptionKey()
  const combined = Buffer.from(encryptedData, 'base64')

  const iv = combined.subarray(0, 16)
  const authTag = combined.subarray(16, 32)
  const encrypted = combined.subarray(32)

  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return deserializeSession(decrypted.toString('utf8'))
}

/**
 * Stores a debate session securely with encryption.
 */
export async function storeSession(session: DebateSession): Promise<void> {
  const encrypted = encryptSession(session)
  sessionStore.set(session.id, encrypted)
}

/**
 * Retrieves a debate session by ID.
 * Returns null if not found or expired.
 */
export async function getSession(id: string): Promise<DebateSession | null> {
  const encrypted = sessionStore.get(id)
  if (!encrypted) return null

  try {
    const session = decryptSession(encrypted)

    if (session.expiresAt < new Date()) {
      sessionStore.delete(id)
      return null
    }

    return session
  } catch {
    sessionStore.delete(id)
    return null
  }
}

/**
 * Updates an existing debate session.
 */
export async function updateSession(
  id: string,
  updates: Partial<Omit<DebateSession, 'id' | 'createdAt'>>
): Promise<DebateSession | null> {
  const existing = await getSession(id)
  if (!existing) return null

  const updated: DebateSession = {
    ...existing,
    ...updates,
    updatedAt: new Date(),
  }

  await storeSession(updated)
  return updated
}

/**
 * Deletes a debate session.
 */
export async function deleteSession(id: string): Promise<boolean> {
  return sessionStore.delete(id)
}

/**
 * Converts full session to public (client-safe) version.
 * Strips the assignment to prevent client from knowing which model argues which side.
 */
export function toPublicSession(session: DebateSession): DebateSessionPublic {
  return {
    id: session.id,
    topic: session.topic,
    turns: session.turns,
    format: session.format,
    customRules: session.customRules,
    status: session.status,
    createdAt: session.createdAt,
  }
}

/**
 * Cleans up expired sessions from the store.
 */
export function cleanExpiredSessions(): void {
  const now = new Date()
  for (const [id] of sessionStore) {
    const encrypted = sessionStore.get(id)
    if (!encrypted) continue

    try {
      const session = decryptSession(encrypted)
      if (session.expiresAt < now) {
        sessionStore.delete(id)
      }
    } catch {
      sessionStore.delete(id)
    }
  }
}

/**
 * Gets the current session count (for monitoring).
 */
export function getSessionCount(): number {
  return sessionStore.size
}
