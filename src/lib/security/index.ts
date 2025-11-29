// src/lib/security/index.ts
// Security module barrel export

export {
  sanitize,
  sanitizeTopic,
  sanitizeCustomRule,
  sanitizeMessage,
  sanitizeForRendering,
  containsDangerousPatterns,
  escapeForJson,
} from './sanitizer'

export {
  filterContent,
  filterDebateTopic,
  filterCustomRule,
  isPromptInjection,
  getFilterStats,
} from './content-filter'

export {
  checkRateLimit,
  isRateLimited,
  getRateLimitHeaders,
  getRateLimitConfig,
  updateRateLimitConfig,
  trackActiveDebate,
  releaseActiveDebate,
  getActiveDebateCount,
  clearActiveDebates,
  getRateLimitStore,
  setRateLimitStore,
} from './rate-limiter'

export { getSecurityHeaders, applySecurityHeaders, getCorsHeaders, validateOrigin } from './headers'

export {
  logRateLimitViolation,
  logContentFilterViolation,
  logCsrfViolation,
  logInjectionAttempt,
  getRecentLogs,
  getAbuseStats,
  extractSecurityContext,
  clearLogs,
} from './abuse-logger'

export {
  validateDebateTopic,
  validateCustomRules,
  validateAndSanitizeDebateConfig,
} from './validate-input'

export { moderateWithOpenAI, isOpenAIModerationEnabled } from './openai-moderation'

export { semanticFilter, isSemanticFilterEnabled } from './semantic-filter'

export type { ValidationResult, BlockReason, DebateConfigValidationResult } from './validate-input'

export type { OpenAIModerationResult } from './openai-moderation'

export type { SemanticFilterResult } from './semantic-filter'

export type {
  SanitizationContext,
  SanitizationOptions,
  SanitizationResult,
  ContentFilterSeverity,
  ContentFilterCategory,
  ContentFilterMatch,
  ContentFilterResult,
  ContentFilterConfig,
  RateLimitType,
  RateLimitConfig,
  RateLimitResult,
  SecurityRateLimitState,
  SecurityRateLimitStore,
  SecurityHeaders,
  AbuseLogEntry,
  SecurityContext,
} from '@/types/security'
