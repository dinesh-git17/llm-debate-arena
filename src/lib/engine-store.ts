// src/lib/engine-store.ts

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

import { Redis } from '@upstash/redis'

import type { DebateEngineState, SerializedEngineState, Turn } from '@/types/turn'

// Redis client - initialized lazily
let redisClient: Redis | null = null

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    redisClient = new Redis({ url, token })
    return redisClient
  }

  return null
}

// In-memory fallback for local development (with HMR-safe global)
const globalForStore = globalThis as unknown as {
  engineStore: Map<string, string> | undefined
}
const memoryStore = globalForStore.engineStore ?? new Map<string, string>()
if (process.env.NODE_ENV === 'development') {
  globalForStore.engineStore = memoryStore
}

const REDIS_KEY_PREFIX = 'debate:engine:'
const ENGINE_TTL_SECONDS = 24 * 60 * 60 // 24 hours

const SALT = 'debate-lab-engine-salt'

function getEncryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required')
  }
  return scryptSync(secret, SALT, 32)
}

function serializeState(state: DebateEngineState): string {
  const serialized: SerializedEngineState = {
    debateId: state.debateId,
    currentTurnIndex: state.currentTurnIndex,
    totalTurns: state.totalTurns,
    turnSequence: state.turnSequence,
    status: state.status,
    error: state.error,
    completedTurns: state.completedTurns.map((turn) => ({
      ...turn,
      startedAt: turn.startedAt.toISOString(),
      completedAt: turn.completedAt.toISOString(),
    })),
  }

  if (state.startedAt) {
    serialized.startedAt = state.startedAt.toISOString()
  }
  if (state.completedAt) {
    serialized.completedAt = state.completedAt.toISOString()
  }

  return JSON.stringify(serialized)
}

function deserializeState(json: string): DebateEngineState {
  const parsed = JSON.parse(json) as SerializedEngineState

  const state: DebateEngineState = {
    debateId: parsed.debateId,
    currentTurnIndex: parsed.currentTurnIndex,
    totalTurns: parsed.totalTurns,
    turnSequence: parsed.turnSequence,
    status: parsed.status,
    completedTurns: parsed.completedTurns.map(
      (turn): Turn => ({
        ...turn,
        startedAt: new Date(turn.startedAt),
        completedAt: new Date(turn.completedAt),
      })
    ),
  }

  if (parsed.error) {
    state.error = parsed.error
  }
  if (parsed.startedAt) {
    state.startedAt = new Date(parsed.startedAt)
  }
  if (parsed.completedAt) {
    state.completedAt = new Date(parsed.completedAt)
  }

  return state
}

/**
 * Encrypts engine state before storage using AES-256-GCM.
 */
function encrypt(data: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', key, iv)

  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

/**
 * Decrypts engine state from storage.
 */
function decrypt(encryptedData: string): string {
  const key = getEncryptionKey()
  const combined = Buffer.from(encryptedData, 'base64')

  const iv = combined.subarray(0, 16)
  const authTag = combined.subarray(16, 32)
  const encrypted = combined.subarray(32)

  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}

/**
 * Store engine state securely with encryption.
 */
export async function storeEngineState(debateId: string, state: DebateEngineState): Promise<void> {
  const serialized = serializeState(state)
  const encrypted = encrypt(serialized)
  const redis = getRedisClient()

  if (redis) {
    const key = `${REDIS_KEY_PREFIX}${debateId}`
    await redis.set(key, encrypted, { ex: ENGINE_TTL_SECONDS })
  } else {
    memoryStore.set(debateId, encrypted)
  }
}

/**
 * Retrieve engine state by debate ID.
 * Returns null if not found or decryption fails.
 */
export async function getEngineState(debateId: string): Promise<DebateEngineState | null> {
  const redis = getRedisClient()
  let encrypted: string | null = null

  if (redis) {
    const key = `${REDIS_KEY_PREFIX}${debateId}`
    encrypted = await redis.get<string>(key)
  } else {
    encrypted = memoryStore.get(debateId) ?? null
  }

  if (!encrypted) return null

  try {
    const decrypted = decrypt(encrypted)
    return deserializeState(decrypted)
  } catch {
    // Corrupted data - clean up
    if (redis) {
      await redis.del(`${REDIS_KEY_PREFIX}${debateId}`)
    } else {
      memoryStore.delete(debateId)
    }
    return null
  }
}

/**
 * Delete engine state for a debate.
 */
export async function deleteEngineState(debateId: string): Promise<boolean> {
  const redis = getRedisClient()

  if (redis) {
    const key = `${REDIS_KEY_PREFIX}${debateId}`
    const deleted = await redis.del(key)
    return deleted > 0
  } else {
    return memoryStore.delete(debateId)
  }
}

/**
 * Check if engine state exists for a debate.
 */
export async function hasEngineState(debateId: string): Promise<boolean> {
  const redis = getRedisClient()

  if (redis) {
    const key = `${REDIS_KEY_PREFIX}${debateId}`
    const exists = await redis.exists(key)
    return exists > 0
  } else {
    return memoryStore.has(debateId)
  }
}

/**
 * Update engine state (get, modify, store pattern).
 */
export async function updateEngineState(
  debateId: string,
  updater: (state: DebateEngineState) => DebateEngineState
): Promise<DebateEngineState | null> {
  const existing = await getEngineState(debateId)
  if (!existing) return null

  const updated = updater(existing)
  await storeEngineState(debateId, updated)
  return updated
}

/**
 * Get all active debate IDs (for monitoring).
 * Note: Only accurate for memory store. Returns empty array when using Redis.
 */
export function getActiveDebateIds(): string[] {
  const redis = getRedisClient()
  if (redis) {
    // Would need SCAN to get Redis keys - return empty for now
    return []
  }
  return Array.from(memoryStore.keys())
}

/**
 * Get the count of active engine states.
 * Note: Only accurate for memory store. Returns -1 when using Redis.
 */
export function getEngineCount(): number {
  const redis = getRedisClient()
  if (redis) {
    // Would need SCAN to count Redis keys - return -1 to indicate unknown
    return -1
  }
  return memoryStore.size
}

/**
 * Clear all engine states (for testing).
 * Note: Only clears memory store. Does not clear Redis.
 */
export function clearAllEngineStates(): void {
  memoryStore.clear()
}
