// src/lib/rate-limiter.ts

import type { LLMProviderType } from '@/types/llm'

interface RateLimitConfig {
  tokensPerMinute: number
  requestsPerMinute: number
}

interface RateLimitBucket {
  tokens: number
  requests: number
  lastRefill: number
}

const PROVIDER_LIMITS: Record<LLMProviderType, RateLimitConfig> = {
  openai: {
    tokensPerMinute: 90000,
    requestsPerMinute: 500,
  },
  anthropic: {
    tokensPerMinute: 100000,
    requestsPerMinute: 1000,
  },
  xai: {
    tokensPerMinute: 60000,
    requestsPerMinute: 300,
  },
}

const buckets = new Map<LLMProviderType, RateLimitBucket>()

/**
 * Get or create a rate limit bucket for a provider
 */
function getBucket(provider: LLMProviderType): RateLimitBucket {
  const existing = buckets.get(provider)
  if (existing) {
    return existing
  }

  const limits = PROVIDER_LIMITS[provider]
  const bucket: RateLimitBucket = {
    tokens: limits.tokensPerMinute,
    requests: limits.requestsPerMinute,
    lastRefill: Date.now(),
  }
  buckets.set(provider, bucket)
  return bucket
}

/**
 * Refill buckets based on elapsed time
 */
function refillBucket(provider: LLMProviderType): void {
  const bucket = getBucket(provider)
  const limits = PROVIDER_LIMITS[provider]
  const now = Date.now()
  const elapsed = now - bucket.lastRefill

  if (elapsed >= 60000) {
    bucket.tokens = limits.tokensPerMinute
    bucket.requests = limits.requestsPerMinute
    bucket.lastRefill = now
  } else {
    const refillRatio = elapsed / 60000
    bucket.tokens = Math.min(
      limits.tokensPerMinute,
      bucket.tokens + limits.tokensPerMinute * refillRatio
    )
    bucket.requests = Math.min(
      limits.requestsPerMinute,
      bucket.requests + limits.requestsPerMinute * refillRatio
    )
    bucket.lastRefill = now
  }
}

/**
 * Check if a request can proceed
 */
export function canMakeRequest(provider: LLMProviderType, estimatedTokens: number): boolean {
  refillBucket(provider)
  const bucket = getBucket(provider)

  return bucket.requests >= 1 && bucket.tokens >= estimatedTokens
}

/**
 * Consume rate limit capacity
 */
export function consumeCapacity(provider: LLMProviderType, tokens: number): void {
  const bucket = getBucket(provider)
  bucket.requests -= 1
  bucket.tokens -= tokens
}

/**
 * Get time until rate limit resets (ms)
 */
export function getResetTime(provider: LLMProviderType): number {
  const bucket = getBucket(provider)
  const elapsed = Date.now() - bucket.lastRefill
  return Math.max(0, 60000 - elapsed)
}

/**
 * Get current rate limit state
 */
export function getRateLimitState(provider: LLMProviderType) {
  refillBucket(provider)
  const bucket = getBucket(provider)
  const limits = PROVIDER_LIMITS[provider]

  return {
    tokensRemaining: Math.floor(bucket.tokens),
    tokensLimit: limits.tokensPerMinute,
    requestsRemaining: Math.floor(bucket.requests),
    requestsLimit: limits.requestsPerMinute,
    resetInMs: getResetTime(provider),
  }
}

/**
 * Wait until rate limit allows request
 */
export async function waitForCapacity(
  provider: LLMProviderType,
  estimatedTokens: number
): Promise<void> {
  while (!canMakeRequest(provider, estimatedTokens)) {
    const resetTime = getResetTime(provider)
    const waitTime = Math.min(resetTime + 100, 5000)

    await new Promise((resolve) => setTimeout(resolve, waitTime))
  }
}

/**
 * Reset rate limits (for testing)
 */
export function resetRateLimits(): void {
  buckets.clear()
}
