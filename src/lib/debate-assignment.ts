// src/lib/debate-assignment.ts
import { randomInt } from 'crypto'

import type { DebateAssignment, DebatePosition, LLMProvider } from '@/types/debate'

/**
 * Generates a cryptographically random debate assignment.
 * Uses Node.js crypto.randomInt for true randomness (not Math.random).
 *
 * @returns DebateAssignment with random FOR/AGAINST positions
 */
export function generateDebateAssignment(): DebateAssignment {
  // 0 = ChatGPT argues FOR, Grok argues AGAINST
  // 1 = Grok argues FOR, ChatGPT argues AGAINST
  const coinFlip = randomInt(0, 2)

  if (coinFlip === 0) {
    return {
      forPosition: 'chatgpt',
      againstPosition: 'grok',
    }
  } else {
    return {
      forPosition: 'grok',
      againstPosition: 'chatgpt',
    }
  }
}

/**
 * Gets the provider for a given position in a debate.
 */
export function getProviderForPosition(
  assignment: DebateAssignment,
  position: DebatePosition
): LLMProvider {
  return position === 'for' ? assignment.forPosition : assignment.againstPosition
}

/**
 * Gets the position for a given provider in a debate.
 */
export function getPositionForProvider(
  assignment: DebateAssignment,
  provider: LLMProvider
): DebatePosition {
  return assignment.forPosition === provider ? 'for' : 'against'
}
