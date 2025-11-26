// src/services/budget-manager.ts

import { getBudgetConfig } from '@/lib/budget-config'
import { calculateCost, estimateCost, mapProviderForCost } from '@/lib/provider-pricing'
import { getCostBreakdown, getUsage, initializeUsage, recordTurnUsage } from '@/lib/usage-store'

import type { BudgetCheckResult, CostBreakdown, DebateUsage, TurnUsage } from '@/types/budget'
import type { GenerateResult, LLMProviderType } from '@/types/llm'

/**
 * Initialize budget tracking for a new debate
 * @param debateId - Unique identifier for the debate
 * @param turnCount - Number of debater turns (used to calculate appropriate budget)
 */
export function initializeDebateBudget(debateId: string, turnCount?: number): DebateUsage {
  return initializeUsage(debateId, turnCount)
}

/**
 * Check if a turn can proceed within budget
 */
export function checkBudget(
  debateId: string,
  provider: LLMProviderType,
  estimatedInputTokens: number,
  maxOutputTokens: number
): BudgetCheckResult {
  const config = getBudgetConfig()
  const usage = getUsage(debateId)

  const tokensRequested = estimatedInputTokens + maxOutputTokens
  const estimatedCostUsd = estimateCost(provider, estimatedInputTokens, maxOutputTokens)

  if (!usage) {
    return {
      allowed: tokensRequested <= config.maxTokensPerDebate,
      tokensRequested,
      tokensRemaining: config.maxTokensPerDebate,
      estimatedCostUsd,
      warningLevel: 'none',
    }
  }

  const tokensRemaining = usage.budgetRemainingTokens

  const wouldExceedBudget = tokensRequested > tokensRemaining

  const wouldExceedCostLimit =
    config.costLimitUsd !== undefined && usage.totalCostUsd + estimatedCostUsd > config.costLimitUsd

  const utilizationAfterTurn = ((usage.totalTokens + tokensRequested) / usage.budgetTokens) * 100

  let warningLevel: 'none' | 'warning' | 'critical' = 'none'
  if (utilizationAfterTurn >= 95) {
    warningLevel = 'critical'
  } else if (utilizationAfterTurn >= config.warningThresholdPercent) {
    warningLevel = 'warning'
  }

  let allowed = true
  let reason: string | undefined

  if (config.hardLimitEnabled && wouldExceedBudget) {
    allowed = false
    reason = `Turn would exceed token budget. Requested: ${tokensRequested}, Remaining: ${tokensRemaining}`
  } else if (wouldExceedCostLimit) {
    allowed = false
    reason = `Turn would exceed cost limit of $${config.costLimitUsd}`
  }

  return {
    allowed,
    reason,
    tokensRequested,
    tokensRemaining,
    estimatedCostUsd,
    warningLevel,
  }
}

/**
 * Record usage after a turn completes
 */
export function recordUsage(
  debateId: string,
  turnId: string,
  provider: LLMProviderType | 'claude',
  result: GenerateResult
): DebateUsage {
  const providerKey = mapProviderForCost(provider)
  const cost = calculateCost(providerKey, result.inputTokens, result.outputTokens)

  const turnUsage: TurnUsage = {
    turnId,
    provider,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    totalTokens: result.totalTokens,
    costUsd: cost.totalCost,
    timestamp: new Date(),
  }

  const usage = recordTurnUsage(debateId, turnUsage)

  return usage
}

/**
 * Get current budget status for a debate
 */
export function getBudgetStatus(debateId: string): {
  usage: DebateUsage | null
  config: ReturnType<typeof getBudgetConfig>
  breakdown: CostBreakdown[]
} {
  return {
    usage: getUsage(debateId),
    config: getBudgetConfig(),
    breakdown: getCostBreakdown(debateId),
  }
}

/**
 * Check if debate should end due to budget
 */
export function shouldEndDueToBudget(debateId: string): {
  shouldEnd: boolean
  reason?: string | undefined
} {
  const config = getBudgetConfig()
  const usage = getUsage(debateId)

  if (!usage) {
    return { shouldEnd: false }
  }

  if (config.hardLimitEnabled && usage.budgetRemainingTokens < 100) {
    return {
      shouldEnd: true,
      reason: 'Token budget exhausted',
    }
  }

  if (config.costLimitUsd !== undefined && usage.totalCostUsd >= config.costLimitUsd) {
    return {
      shouldEnd: true,
      reason: `Cost limit of $${config.costLimitUsd} reached`,
    }
  }

  return { shouldEnd: false }
}

/**
 * Estimate total cost for a debate configuration
 */
export function estimateDebateCost(
  turns: number,
  _format: string,
  averageInputTokens: number = 500,
  averageOutputTokens: number = 400
): {
  estimatedTokens: number
  estimatedCostUsd: number
  breakdown: { provider: string; cost: number }[]
} {
  const debaterTurnsEach = Math.ceil(turns / 2)
  const moderatorTurns = turns + 2

  const chatgptTokens = debaterTurnsEach * (averageInputTokens + averageOutputTokens)
  const grokTokens = debaterTurnsEach * (averageInputTokens + averageOutputTokens)
  const claudeTokens = moderatorTurns * (averageInputTokens / 2 + averageOutputTokens / 2)

  const chatgptCost = estimateCost('openai', chatgptTokens * 0.6, chatgptTokens * 0.4)
  const grokCost = estimateCost('xai', grokTokens * 0.6, grokTokens * 0.4)
  const claudeCost = estimateCost('anthropic', claudeTokens * 0.6, claudeTokens * 0.4)

  return {
    estimatedTokens: chatgptTokens + grokTokens + claudeTokens,
    estimatedCostUsd: Math.round((chatgptCost + grokCost + claudeCost) * 10000) / 10000,
    breakdown: [
      { provider: 'ChatGPT', cost: chatgptCost },
      { provider: 'Grok', cost: grokCost },
      { provider: 'Claude (Moderator)', cost: claudeCost },
    ],
  }
}

/**
 * Get remaining budget percentage
 */
export function getRemainingBudgetPercent(debateId: string): number {
  const usage = getUsage(debateId)
  if (!usage) {
    return 100
  }
  return Math.max(0, 100 - usage.budgetUtilizationPercent)
}

/**
 * Check if budget tracking is initialized for a debate
 */
export function isBudgetInitialized(debateId: string): boolean {
  return getUsage(debateId) !== null
}
