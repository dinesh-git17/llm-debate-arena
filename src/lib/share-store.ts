// src/lib/share-store.ts

import { generateShortCode, getShareUrl } from './short-code'

import type { ShareSettings, ShareVisibility, ShortUrlMapping } from '@/types/share'

// In-memory stores (replace with database in production)
const shareSettingsStore = new Map<string, ShareSettings>()
const shortCodeStore = new Map<string, ShortUrlMapping>()

/**
 * Get or create share settings for a debate
 */
export async function getOrCreateShareSettings(
  debateId: string,
  visibility: ShareVisibility = 'public'
): Promise<ShareSettings> {
  const existing = shareSettingsStore.get(debateId)
  if (existing) {
    return existing
  }

  let shortCode: string
  do {
    shortCode = generateShortCode(8)
  } while (shortCodeStore.has(shortCode))

  const settings: ShareSettings = {
    debateId,
    visibility,
    shortCode,
    shareUrl: getShareUrl(shortCode),
    embedEnabled: visibility === 'public',
    createdAt: new Date(),
  }

  shareSettingsStore.set(debateId, settings)
  shortCodeStore.set(shortCode, {
    shortCode,
    debateId,
    createdAt: new Date(),
    clickCount: 0,
  })

  return settings
}

/**
 * Get share settings by debate ID
 */
export async function getShareSettings(debateId: string): Promise<ShareSettings | null> {
  return shareSettingsStore.get(debateId) ?? null
}

/**
 * Update share visibility
 */
export async function updateShareVisibility(
  debateId: string,
  visibility: ShareVisibility
): Promise<ShareSettings | null> {
  const settings = shareSettingsStore.get(debateId)
  if (!settings) return null

  settings.visibility = visibility
  settings.embedEnabled = visibility === 'public'
  shareSettingsStore.set(debateId, settings)

  return settings
}

/**
 * Resolve short code to debate ID
 */
export async function resolveShortCode(shortCode: string): Promise<string | null> {
  const mapping = shortCodeStore.get(shortCode)
  if (!mapping) return null

  mapping.clickCount++
  shortCodeStore.set(shortCode, mapping)

  return mapping.debateId
}

/**
 * Check if debate is publicly accessible
 */
export async function isPubliclyAccessible(debateId: string): Promise<boolean> {
  const settings = shareSettingsStore.get(debateId)
  if (!settings) return true
  return settings.visibility !== 'private'
}

/**
 * Get share analytics
 */
export async function getShareAnalytics(debateId: string): Promise<{
  shortCode: string
  visibility: ShareVisibility
  clickCount: number
  createdAt: Date
} | null> {
  const settings = shareSettingsStore.get(debateId)
  if (!settings) return null

  const mapping = shortCodeStore.get(settings.shortCode)

  return {
    shortCode: settings.shortCode,
    visibility: settings.visibility,
    clickCount: mapping?.clickCount ?? 0,
    createdAt: settings.createdAt,
  }
}
