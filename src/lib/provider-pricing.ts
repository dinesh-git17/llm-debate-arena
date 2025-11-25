// src/lib/provider-pricing.ts

import type { LLMProviderType } from '@/types/llm'

/**
 * Pricing per 1,000 tokens (USD)
 * Keep in sync with provider pricing pages
 */
export const PROVIDER_PRICING: Record<LLMProviderType, { input: number; output: number }> = {
  openai: {
    input: 0.01,
    output: 0.03,
  },
  anthropic: {
    input: 0.003,
    output: 0.015,
  },
  xai: {
    input: 0.005,
    output: 0.015,
  },
}

/**
 * Calculate cost for token usage
 */
export function calculateCost(
  provider: LLMProviderType,
  inputTokens: number,
  outputTokens: number
): { inputCost: number; outputCost: number; totalCost: number } {
  const pricing = PROVIDER_PRICING[provider]

  const inputCost = (inputTokens / 1000) * pricing.input
  const outputCost = (outputTokens / 1000) * pricing.output

  return {
    inputCost: Math.round(inputCost * 1000000) / 1000000,
    outputCost: Math.round(outputCost * 1000000) / 1000000,
    totalCost: Math.round((inputCost + outputCost) * 1000000) / 1000000,
  }
}

/**
 * Estimate cost for a planned request
 */
export function estimateCost(
  provider: LLMProviderType,
  estimatedInputTokens: number,
  maxOutputTokens: number
): number {
  const { totalCost } = calculateCost(provider, estimatedInputTokens, maxOutputTokens)
  return totalCost
}

/**
 * Format cost as currency string
 */
export function formatCost(costUsd: number): string {
  if (costUsd < 0.01) {
    return `$${costUsd.toFixed(4)}`
  }
  return `$${costUsd.toFixed(2)}`
}

/**
 * Get provider display name for cost reports
 */
export function getProviderDisplayName(provider: LLMProviderType | 'claude'): string {
  const names: Record<string, string> = {
    openai: 'ChatGPT (GPT-4 Turbo)',
    anthropic: 'Claude (Sonnet 4)',
    xai: 'Grok',
    claude: 'Claude (Moderator)',
  }
  return names[provider] ?? provider
}

/**
 * Map debate role to LLM provider type for cost calculation
 */
export function mapProviderForCost(provider: LLMProviderType | 'claude'): LLMProviderType {
  return provider === 'claude' ? 'anthropic' : provider
}
