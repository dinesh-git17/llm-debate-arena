// src/lib/prompts/transition-prompt.ts

import { buildModeratorSystemPrompt } from './moderator-system'

import type { CompiledPrompt, DebateHistoryEntry, ModeratorContext } from '@/types/prompts'
import type { TurnType } from '@/types/turn'

/**
 * Template for turn transitions
 */
export const TRANSITION_PROMPT_TEMPLATE = `You are transitioning between speakers in the debate. Generate a brief transition that:

1. Acknowledges the previous speaker finished (without evaluating quality)
2. Announces the next speaker and their turn type
3. Optionally provides a neutral, factual observation about the debate state

## Current State
- Debate Topic: "{{topic}}"
- Previous Speaker: {{previousSpeaker}} ({{previousTurnType}})
- Next Speaker: {{nextSpeaker}} ({{nextTurnType}})
- Turn Progress: {{currentTurnNumber}} of {{totalTurns}} debater turns

{{previousTurnSection}}

## Guidelines
- Keep it SHORT (30-50 words maximum)
- Do NOT evaluate or praise the previous argument
- Simply announce the transition neutrally
- You may note what type of response is expected (rebuttal, constructive, etc.)

## Your Transition
Write a brief moderator transition.`

/**
 * Get display name for turn type
 */
function getTurnTypeDisplay(turnType: TurnType | undefined): string {
  if (!turnType) return 'turn'

  const displays: Record<string, string> = {
    opening: 'opening statement',
    constructive: 'constructive argument',
    rebuttal: 'rebuttal',
    cross_examination: 'cross-examination',
    closing: 'closing statement',
    moderator_intro: 'introduction',
    moderator_transition: 'transition',
    moderator_intervention: 'intervention',
    moderator_summary: 'summary',
  }
  return displays[turnType] ?? 'turn'
}

/**
 * Determine expected turn type based on context
 * Uses the actual next turn type from the sequence when available
 */
function getExpectedTurnType(context: ModeratorContext): string {
  // Use the actual next turn type if provided (preferred)
  if (context.nextTurnType) {
    return getTurnTypeDisplay(context.nextTurnType)
  }

  // Fallback to inference based on debate history (for backwards compatibility)
  const lastTurn = context.debateHistory.at(-1)
  if (!lastTurn) return 'opening statement'

  if (lastTurn.turnType === 'opening') {
    return context.currentTurnNumber <= 2 ? 'opening statement' : 'rebuttal'
  }
  if (lastTurn.turnType === 'constructive') {
    return 'rebuttal'
  }
  if (lastTurn.turnType === 'rebuttal') {
    return context.currentTurnNumber >= context.totalTurns - 1 ? 'closing statement' : 'rebuttal'
  }
  if (lastTurn.turnType === 'cross_examination') {
    return 'response'
  }
  return 'response'
}

/**
 * Extract key sentences from content for summary
 */
function extractKeySentences(content: string, count: number): string {
  const sentences = content.match(/[^.!?]+[.!?]+/g) ?? []
  return sentences.slice(0, count).join(' ').trim()
}

/**
 * Build previous turn section
 */
function buildPreviousTurnSection(
  previousTurnContent: string | undefined,
  previousSpeaker: string
): string {
  if (!previousTurnContent) {
    return ''
  }

  const summary = extractKeySentences(previousTurnContent, 2)
  return `## Previous Turn Summary
The ${previousSpeaker} position just completed their turn. Key points touched on (factually, not evaluatively):
${summary}

`
}

/**
 * Get speaker label for display
 */
function getSpeakerLabel(speaker: string | undefined): string {
  if (!speaker) return 'Unknown'
  return speaker === 'for' ? 'FOR' : speaker === 'against' ? 'AGAINST' : 'MODERATOR'
}

/**
 * Compile transition prompt with context
 */
export function compileTransitionPrompt(context: ModeratorContext): CompiledPrompt {
  const systemPrompt = buildModeratorSystemPrompt(context.format)

  const lastDebaterTurn = context.debateHistory
    .filter((h: DebateHistoryEntry) => h.speaker !== 'moderator')
    .at(-1)

  const previousSpeakerLabel = getSpeakerLabel(context.previousTurnSpeaker)
  const nextSpeakerLabel = getSpeakerLabel(context.nextSpeaker)

  const previousTurnSection = buildPreviousTurnSection(
    context.previousTurnContent,
    previousSpeakerLabel
  )

  const userPrompt = TRANSITION_PROMPT_TEMPLATE.replace('{{topic}}', context.topic)
    .replace('{{previousSpeaker}}', previousSpeakerLabel)
    .replace('{{previousTurnType}}', getTurnTypeDisplay(lastDebaterTurn?.turnType))
    .replace('{{nextSpeaker}}', nextSpeakerLabel)
    .replace('{{nextTurnType}}', getExpectedTurnType(context))
    .replace('{{currentTurnNumber}}', String(context.currentTurnNumber))
    .replace('{{totalTurns}}', String(context.totalTurns))
    .replace('{{previousTurnSection}}', previousTurnSection)

  return {
    systemPrompt,
    userPrompt,
    maxTokens: 150,
    temperature: 0.5,
  }
}
