// src/types/budget.ts

import type { LLMProviderType } from './llm'

/**
 * Token usage for a single turn
 */
export interface TurnUsage {
  turnId: string
  provider: LLMProviderType | 'claude'
  inputTokens: number
  outputTokens: number
  totalTokens: number
  costUsd: number
  timestamp: Date
}

/**
 * Cumulative usage for a debate
 */
export interface DebateUsage {
  debateId: string
  turns: TurnUsage[]
  totalInputTokens: number
  totalOutputTokens: number
  totalTokens: number
  totalCostUsd: number
  budgetTokens: number
  budgetRemainingTokens: number
  budgetUtilizationPercent: number
  startedAt: Date
  lastUpdatedAt: Date
}

/**
 * Budget configuration
 */
export interface BudgetConfig {
  maxTokensPerDebate: number
  maxTokensPerTurn: number
  warningThresholdPercent: number
  hardLimitEnabled: boolean
  costLimitUsd?: number | undefined
}

/**
 * Budget check result
 */
export interface BudgetCheckResult {
  allowed: boolean
  reason?: string | undefined
  tokensRequested: number
  tokensRemaining: number
  estimatedCostUsd: number
  warningLevel: 'none' | 'warning' | 'critical'
}

/**
 * Cost breakdown by provider
 */
export interface CostBreakdown {
  provider: LLMProviderType | 'claude'
  inputTokens: number
  outputTokens: number
  inputCostUsd: number
  outputCostUsd: number
  totalCostUsd: number
}

/**
 * Aggregate usage statistics
 */
export interface UsageStats {
  period: 'hour' | 'day' | 'week' | 'month'
  debatesCount: number
  totalTokens: number
  totalCostUsd: number
  averageTokensPerDebate: number
  averageCostPerDebate: number
  byProvider: CostBreakdown[]
  timestamp: Date
}

/**
 * Budget status response for API
 */
export interface BudgetStatusResponse {
  budget: {
    total: number
    used: number
    remaining: number
    utilizationPercent: number
  }
  cost: {
    total: string
    totalRaw: number
    limit: string | null
  }
  breakdown: {
    provider: string
    tokens: number
    cost: string
  }[]
  turns: number
  lastUpdated: string
}

/**
 * Cost estimate response for API
 */
export interface CostEstimateResponse {
  estimatedTokens: number
  estimatedCost: string
  estimatedCostRaw: number
  breakdown: {
    provider: string
    cost: string
  }[]
}
