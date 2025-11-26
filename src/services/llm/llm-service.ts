// src/services/llm/llm-service.ts

import { consumeCapacity, waitForCapacity } from '@/lib/rate-limiter'
import { withRetry } from '@/lib/retry'
import { LLMError } from '@/types/llm'

import { getDebateProvider, getProvider } from './provider-factory'

import type { GenerateParams, GenerateResult, LLMProviderType, StreamChunk } from '@/types/llm'

export interface GenerateOptions {
  provider: LLMProviderType | 'chatgpt' | 'grok' | 'claude'
  params: GenerateParams
  enableRetry?: boolean | undefined
  enableRateLimit?: boolean | undefined
}

/**
 * Generate a response from an LLM provider
 */
export async function generate(options: GenerateOptions): Promise<GenerateResult> {
  const { provider: providerName, params, enableRetry = true, enableRateLimit = true } = options

  const provider = ['chatgpt', 'grok', 'claude'].includes(providerName)
    ? getDebateProvider(providerName as 'chatgpt' | 'grok' | 'claude')
    : getProvider(providerName as LLMProviderType)

  if (!provider.isConfigured()) {
    throw new LLMError(
      `Provider ${providerName} is not configured`,
      'auth_error',
      provider.providerType
    )
  }

  const estimatedTokens =
    provider.countMessagesTokens(params.systemPrompt, params.messages) + params.maxTokens

  if (enableRateLimit) {
    await waitForCapacity(provider.providerType, estimatedTokens)
  }

  const generateFn = async () => {
    try {
      const result = await provider.generate(params)

      if (enableRateLimit) {
        consumeCapacity(provider.providerType, result.totalTokens)
      }

      return result
    } catch (error) {
      console.error(`[LLM] ${provider.providerType} error:`, {
        error: error instanceof Error ? error.message : 'Unknown',
        type: error instanceof LLMError ? error.type : 'unknown',
      })
      throw error
    }
  }

  if (enableRetry) {
    return withRetry(generateFn, { maxRetries: 3 })
  }

  return generateFn()
}

/**
 * Generate a streaming response
 */
export async function* generateStream(
  options: GenerateOptions
): AsyncGenerator<StreamChunk, GenerateResult, unknown> {
  const { provider: providerName, params, enableRateLimit = true } = options

  const provider = ['chatgpt', 'grok', 'claude'].includes(providerName)
    ? getDebateProvider(providerName as 'chatgpt' | 'grok' | 'claude')
    : getProvider(providerName as LLMProviderType)

  if (!provider.isConfigured()) {
    throw new LLMError(
      `Provider ${providerName} is not configured`,
      'auth_error',
      provider.providerType
    )
  }

  const estimatedTokens =
    provider.countMessagesTokens(params.systemPrompt, params.messages) + params.maxTokens

  if (enableRateLimit) {
    await waitForCapacity(provider.providerType, estimatedTokens)
  }

  const startTime = Date.now()
  let fullContent = ''
  let outputTokens = 0

  try {
    for await (const chunk of provider.generateStream(params)) {
      fullContent += chunk.content
      outputTokens = provider.countTokens(fullContent)
      yield chunk
    }

    const inputTokens = provider.countMessagesTokens(params.systemPrompt, params.messages)

    if (enableRateLimit) {
      consumeCapacity(provider.providerType, inputTokens + outputTokens)
    }

    return {
      content: fullContent,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      finishReason: 'stop',
      latencyMs: Date.now() - startTime,
      provider: provider.providerType,
      model: provider.info.model,
    }
  } catch (error) {
    console.error(`[LLM] ${provider.providerType} stream error:`, {
      error: error instanceof Error ? error.message : 'Unknown',
    })
    throw error
  }
}

/**
 * Estimate tokens for a generation request
 */
export function estimateTokens(
  providerName: LLMProviderType | 'chatgpt' | 'grok' | 'claude',
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxOutputTokens: number
): number {
  const provider = ['chatgpt', 'grok', 'claude'].includes(providerName)
    ? getDebateProvider(providerName as 'chatgpt' | 'grok' | 'claude')
    : getProvider(providerName as LLMProviderType)

  return provider.countMessagesTokens(systemPrompt, messages) + maxOutputTokens
}
