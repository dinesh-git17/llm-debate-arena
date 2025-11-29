// src/app/(debate)/debate/new/actions.ts
'use server'

import { logger, logDebateEvent, logSecurityEvent } from '@/lib/logging'
import { debateFormSchema } from '@/lib/schemas/debate-schema'
import { validateAndSanitizeDebateConfig } from '@/lib/security'
import { createDebateSession } from '@/services/debate-service'

import type { DebateFormValues } from '@/lib/schemas/debate-schema'
import type { BlockReason } from '@/lib/security'
import type { DebateFormat } from '@/types/debate'

// Map BlockReason to human-readable descriptions for logging
const BLOCK_REASON_DESCRIPTIONS: Record<BlockReason, string> = {
  prompt_injection: 'Prompt injection attempt detected',
  harmful_content: 'Harmful or prohibited content detected',
  profanity: 'Profanity or inappropriate language detected',
  manipulation: 'AI manipulation attempt detected',
  dangerous_pattern: 'Dangerous formatting or pattern detected',
  sensitive_topic: 'Sensitive or prohibited topic detected',
  content_policy: 'General content policy violation',
}

export interface CreateDebateActionResult {
  success: boolean
  debateId?: string | undefined
  error?: string | undefined
  fieldErrors?: Record<string, string[] | undefined> | undefined
  blocked?: boolean | undefined
  blockReason?: BlockReason | undefined
}

export async function createDebate(data: DebateFormValues): Promise<CreateDebateActionResult> {
  const validated = debateFormSchema.safeParse(data)

  if (!validated.success) {
    logger.warn('Debate creation failed: Invalid form data', {
      fieldErrors: validated.error.flatten().fieldErrors,
    })
    return {
      success: false,
      error: 'Invalid form data',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  // Security validation and sanitization (hybrid: regex patterns + OpenAI Moderation API)
  const securityValidation = await validateAndSanitizeDebateConfig({
    topic: validated.data.topic,
    turns: validated.data.turns,
    format: validated.data.format,
    customRules: validated.data.customRules,
  })

  if (!securityValidation.valid || !securityValidation.sanitizedConfig) {
    // Log blocked content with detailed information
    const blockReason = securityValidation.blockReason ?? 'content_policy'
    const severity =
      blockReason === 'prompt_injection' ||
      blockReason === 'harmful_content' ||
      blockReason === 'sensitive_topic'
        ? 'critical'
        : blockReason === 'manipulation' || blockReason === 'dangerous_pattern'
          ? 'high'
          : 'medium'

    logSecurityEvent('debate_creation_blocked', severity, {
      blockReason,
      blockReasonDescription: BLOCK_REASON_DESCRIPTIONS[blockReason],
      contentPreview: validated.data.topic.slice(0, 100),
      contentLength: validated.data.topic.length,
      format: validated.data.format,
      turns: validated.data.turns,
      hasCustomRules: (validated.data.customRules?.length ?? 0) > 0,
      validationErrors: securityValidation.errors,
    })

    return {
      success: false,
      error: securityValidation.errors[0] ?? 'Content validation failed',
      fieldErrors: { topic: securityValidation.errors },
      blocked: securityValidation.blocked,
      blockReason: securityValidation.blockReason,
    }
  }

  // Use sanitized config for debate creation
  const result = await createDebateSession({
    topic: securityValidation.sanitizedConfig.topic,
    turns: securityValidation.sanitizedConfig.turns,
    format: securityValidation.sanitizedConfig.format as DebateFormat,
    customRules: securityValidation.sanitizedConfig.customRules,
  })

  if (!result.success) {
    logger.error('Debate creation failed: Service error', null, {
      error: result.error,
      topic: securityValidation.sanitizedConfig.topic.slice(0, 100),
      format: securityValidation.sanitizedConfig.format,
      turns: securityValidation.sanitizedConfig.turns,
    })
    return {
      success: false,
      error: result.error ?? 'Failed to create debate',
    }
  }

  // Log successful debate creation
  logDebateEvent('debate_created', result.debateId!, {
    topic: securityValidation.sanitizedConfig.topic.slice(0, 100),
    format: securityValidation.sanitizedConfig.format,
    turns: securityValidation.sanitizedConfig.turns,
    hasCustomRules: (securityValidation.sanitizedConfig.customRules?.length ?? 0) > 0,
    customRulesCount: securityValidation.sanitizedConfig.customRules?.length ?? 0,
  })

  return {
    success: true,
    debateId: result.debateId,
  }
}
