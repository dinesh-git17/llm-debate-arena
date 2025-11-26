// src/types/share.ts

/**
 * Visibility settings for shared debates
 */
export type ShareVisibility = 'public' | 'unlisted' | 'private'

/**
 * Share configuration for a debate
 */
export interface ShareSettings {
  debateId: string
  visibility: ShareVisibility
  shortCode: string
  shareUrl: string
  embedEnabled: boolean
  createdAt: Date
  expiresAt?: Date
}

/**
 * Share metadata for social cards
 */
export interface ShareMetadata {
  title: string
  description: string
  imageUrl: string
  url: string
  siteName: string
  twitterCard: 'summary' | 'summary_large_image'
  twitterSite?: string
}

/**
 * OG Image generation parameters
 */
export interface OGImageParams {
  topic: string
  format: string
  forModel: string
  againstModel: string
  status: 'completed' | 'in_progress'
  turnCount: number
  date: string
}

/**
 * Embed configuration
 */
export interface EmbedConfig {
  debateId: string
  width: number
  height: number
  theme: 'light' | 'dark' | 'auto'
  showSummary: boolean
  showScores: boolean
}

/**
 * Share analytics for tracking
 */
export interface ShareAnalytics {
  debateId: string
  totalViews: number
  uniqueViews: number
  shareClicks: {
    twitter: number
    linkedin: number
    facebook: number
    copy: number
    embed: number
  }
  referrers: { source: string; count: number }[]
}

/**
 * Short URL mapping
 */
export interface ShortUrlMapping {
  shortCode: string
  debateId: string
  createdAt: Date
  clickCount: number
}

/**
 * Share settings API response
 */
export interface ShareSettingsResponse {
  settings: ShareSettings
  analytics: {
    shortCode: string
    visibility: ShareVisibility
    clickCount: number
    createdAt: Date
  } | null
}
