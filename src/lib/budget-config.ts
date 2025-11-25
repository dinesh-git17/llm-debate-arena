// src/lib/budget-config.ts

import type { BudgetConfig } from '@/types/budget'

/**
 * Default budget configuration
 */
export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  maxTokensPerDebate: 50000,
  maxTokensPerTurn: 2000,
  warningThresholdPercent: 80,
  hardLimitEnabled: true,
  costLimitUsd: undefined,
}

/**
 * Get budget config with environment overrides
 */
export function getBudgetConfig(): BudgetConfig {
  return {
    maxTokensPerDebate: parseInt(process.env.TOKEN_BUDGET_PER_DEBATE ?? '50000', 10),
    maxTokensPerTurn: parseInt(process.env.MAX_TOKENS_PER_TURN ?? '2000', 10),
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
