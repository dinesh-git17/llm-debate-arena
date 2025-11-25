// src/services/llm/base-provider.ts

import type {
  GenerateParams,
  GenerateResult,
  LLMProviderType,
  ProviderHealth,
  ProviderInfo,
  StreamChunk,
} from '@/types/llm'

/**
 * Abstract base class for LLM providers
 */
export abstract class BaseLLMProvider {
  abstract readonly providerType: LLMProviderType
  abstract readonly info: ProviderInfo

  /**
   * Generate a response (non-streaming)
   */
  abstract generate(params: GenerateParams): Promise<GenerateResult>

  /**
   * Generate a response (streaming)
   */
  abstract generateStream(params: GenerateParams): AsyncGenerator<StreamChunk, void, unknown>

  /**
   * Count tokens in text
   */
  abstract countTokens(text: string): number

  /**
   * Count tokens in messages
   */
  abstract countMessagesTokens(
    systemPrompt: string,
    messages: { role: string; content: string }[]
  ): number

  /**
   * Check provider health
   */
  abstract checkHealth(): Promise<ProviderHealth>

  /**
   * Validate API key is configured
   */
  abstract isConfigured(): boolean
}
