// src/services/llm/anthropic-provider.ts

import Anthropic from '@anthropic-ai/sdk'

import { LLMError } from '@/types/llm'

import { BaseLLMProvider } from './base-provider'

import type {
  GenerateParams,
  GenerateResult,
  LLMErrorType,
  LLMProviderType,
  ProviderHealth,
  ProviderInfo,
  StreamChunk,
} from '@/types/llm'

const MODEL = 'claude-sonnet-4-20250514'

export class AnthropicProvider extends BaseLLMProvider {
  readonly providerType: LLMProviderType = 'anthropic'
  readonly info: ProviderInfo = {
    name: 'Claude',
    provider: 'anthropic',
    model: MODEL,
    maxContextTokens: 200000,
    maxOutputTokens: 8192,
    supportsStreaming: true,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
  }

  private client: Anthropic | null = null

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new LLMError('ANTHROPIC_API_KEY not configured', 'auth_error', 'anthropic')
      }
      this.client = new Anthropic({ apiKey })
    }
    return this.client
  }

  isConfigured(): boolean {
    return !!process.env.ANTHROPIC_API_KEY
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  countMessagesTokens(systemPrompt: string, messages: { role: string; content: string }[]): number {
    let total = this.countTokens(systemPrompt)

    for (const msg of messages) {
      total += this.countTokens(msg.content) + 4
    }

    return total
  }

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const client = this.getClient()
    const startTime = Date.now()

    try {
      const response = await client.messages.create({
        model: MODEL,
        system: params.systemPrompt,
        messages: params.messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        max_tokens: params.maxTokens,
        temperature: params.temperature ?? 0.7,
        ...(params.stopSequences ? { stop_sequences: params.stopSequences } : {}),
      })

      const textBlock = response.content[0]
      const content = textBlock?.type === 'text' ? textBlock.text : ''

      const finishReason = response.stop_reason === 'end_turn' ? 'stop' : 'max_tokens'

      return {
        content,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        finishReason,
        latencyMs: Date.now() - startTime,
        provider: 'anthropic',
        model: MODEL,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async *generateStream(params: GenerateParams): AsyncGenerator<StreamChunk, void, unknown> {
    const client = this.getClient()

    try {
      const stream = client.messages.stream({
        model: MODEL,
        system: params.systemPrompt,
        messages: params.messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        max_tokens: params.maxTokens,
        temperature: params.temperature ?? 0.7,
        ...(params.stopSequences ? { stop_sequences: params.stopSequences } : {}),
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield {
            content: event.delta.text,
            isComplete: false,
          }
        }

        if (event.type === 'message_stop') {
          yield {
            content: '',
            isComplete: true,
            finishReason: 'stop',
          }
        }
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async checkHealth(): Promise<ProviderHealth> {
    const startTime = Date.now()

    try {
      const client = this.getClient()
      await client.messages.create({
        model: MODEL,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      })

      return {
        provider: 'anthropic',
        isHealthy: true,
        lastCheck: new Date(),
        latencyMs: Date.now() - startTime,
      }
    } catch (error) {
      return {
        provider: 'anthropic',
        isHealthy: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private handleError(error: unknown): LLMError {
    if (error instanceof Anthropic.APIError) {
      const type = this.mapErrorType(error.status)
      const retryable = error.status === 429 || (error.status !== undefined && error.status >= 500)

      return new LLMError(error.message, type, 'anthropic', error.status, retryable)
    }

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return new LLMError(error.message, 'timeout', 'anthropic', undefined, true)
      }
      if (error.message.includes('network')) {
        return new LLMError(error.message, 'network_error', 'anthropic', undefined, true)
      }
    }

    return new LLMError(
      error instanceof Error ? error.message : 'Unknown error',
      'unknown',
      'anthropic'
    )
  }

  private mapErrorType(status?: number): LLMErrorType {
    if (status === 401) return 'auth_error'
    if (status === 429) return 'rate_limit'
    if (status === 400) return 'invalid_request'
    if (status !== undefined && status >= 500) return 'server_error'
    return 'unknown'
  }
}
