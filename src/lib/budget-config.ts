// src/lib/budget-config.ts

import type { BudgetConfig } from '@/types/budget'

/**
 * Default budget configuration
 * Note: Token budget must account for both input (context) and output tokens.
 * Budget scales with turn count - see calculateBudgetForTurns().
 */
export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  maxTokensPerDebate: 250000, // Default for max turns (10); scaled down for fewer turns
  maxTokensPerTurn: 15000, // Input context + output (context grows as debate progresses)
  warningThresholdPercent: 80,
  hardLimitEnabled: true,
  costLimitUsd: undefined,
}

/**
 * Calculate appropriate token budget based on turn count.
 * More turns = more context accumulation = more tokens needed.
 */
export function calculateBudgetForTurns(turnCount: number): number {
  // Base: ~20k tokens per debater turn (input context grows + output)
  // Plus moderator overhead: ~5k per moderator turn
  // Formula: debaterTurns * 20k + moderatorTurns * 5k + 20k buffer
  const moderatorTurns = turnCount + 2 // intro + transitions + summary
  const estimatedTokens = turnCount * 20000 + moderatorTurns * 5000 + 20000

  // Minimum 100k, maximum 300k
  return Math.min(300000, Math.max(100000, estimatedTokens))
}

/**
 * Get budget config with environment overrides
 */
export function getBudgetConfig(): BudgetConfig {
  return {
    maxTokensPerDebate: parseInt(process.env.TOKEN_BUDGET_PER_DEBATE ?? '150000', 10),
    maxTokensPerTurn: parseInt(process.env.MAX_TOKENS_PER_TURN ?? '12000', 10),
    warningThresholdPercent: parseInt(process.env.BUDGET_WARNING_THRESHOLD ?? '80', 10),
    hardLimitEnabled: process.env.BUDGET_HARD_LIMIT !== 'false',
    costLimitUsd: process.env.COST_LIMIT_USD ? parseFloat(process.env.COST_LIMIT_USD) : undefined,
  }
}

/**
 * Validate budget config values
 */
export function validateBudgetConfig(config: BudgetConfig): string[] {
  const errors: string[] = []

  if (config.maxTokensPerDebate < 1000) {
    errors.push('maxTokensPerDebate must be at least 1000')
  }

  if (config.maxTokensPerDebate > 500000) {
    errors.push('maxTokensPerDebate exceeds safe limit of 500000')
  }

  if (config.maxTokensPerTurn < 100) {
    errors.push('maxTokensPerTurn must be at least 100')
  }

  if (config.maxTokensPerTurn > config.maxTokensPerDebate) {
    errors.push('maxTokensPerTurn cannot exceed maxTokensPerDebate')
  }

  if (config.warningThresholdPercent < 50 || config.warningThresholdPercent > 99) {
    errors.push('warningThresholdPercent must be between 50 and 99')
  }

  if (config.costLimitUsd !== undefined && config.costLimitUsd <= 0) {
    errors.push('costLimitUsd must be positive')
  }

  return errors
}

/**
 * Get budget config with validation
 */
export function getValidatedBudgetConfig(): { config: BudgetConfig; errors: string[] } {
  const config = getBudgetConfig()
  const errors = validateBudgetConfig(config)
  return { config, errors }
}
