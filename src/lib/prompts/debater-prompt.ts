// src/lib/prompts/debater-prompt.ts

import { TARGET_WORD_COUNTS } from '@/lib/debate-formats'

import type { DebateHistoryEntry } from '@/types/prompts'
import type { TurnType } from '@/types/turn'

/**
 * Build system prompt for debater AI (ChatGPT or Grok)
 */
export function buildDebaterSystemPrompt(position: 'for' | 'against', topic: string): string {
  const positionLabel = position === 'for' ? 'FOR (Affirmative)' : 'AGAINST (Negative)'
  const positionStance = position === 'for' ? 'IN FAVOR OF' : 'AGAINST'

  return `You are a skilled debater arguing the ${positionLabel} position in a formal debate.

## Your Position
You are arguing **${positionStance}** the following topic:
"${topic}"

## Your Role
- Present the strongest possible case for your assigned position
- Respond directly to your opponent's arguments
- Use logical reasoning and evidence
- Maintain professional, respectful discourse
- Stay focused on the topic

## Debate Rules
- No personal attacks on your opponent
- Support claims with reasoning
- Address your opponent's points directly in rebuttals
- Do not introduce new arguments in closing statements
- Maintain professional language throughout

## Important
- You are arguing this position regardless of your personal views
- Your goal is to present the most compelling case for your side
- Acknowledge strong opposing points while countering them
- Be persuasive but intellectually honest

## Your Opponent
The ${position === 'for' ? 'AGAINST (Negative)' : 'FOR (Affirmative)'} position will argue against you. Address their points directly when appropriate.`
}

/**
 * Turn type specific instructions
 */
const TURN_INSTRUCTIONS: Record<string, string> = {
  opening: `Present your opening statement. Establish your position clearly, introduce your main arguments, and set the framework for your case. This is your first impression. Be clear about what you will argue and why.`,

  constructive: `Present a constructive argument that builds your case. Introduce new evidence, reasoning, or perspectives that support your position. Develop your arguments with depth and specificity. You may address your opponent's points but focus primarily on building your own case.`,

  rebuttal: `Respond directly to your opponent's arguments. Identify weaknesses in their reasoning, challenge their evidence, and defend your position against their attacks. Be specific about which points you are addressing. You must engage with their actual arguments, not strawman versions.`,

  cross_examination: `Pose strategic questions to your opponent or respond to their questions. Use this opportunity to expose weaknesses in their argument or clarify your own position. Questions should be pointed and purposeful.`,

  closing: `Deliver your closing statement. Summarize your strongest arguments, address the key clashes in the debate, and make your final appeal. Do NOT introduce new arguments. Synthesize what has been discussed and explain why your position should prevail.`,
}

/**
 * Get turn type display name
 */
function getTurnTypeDisplay(turnType: TurnType): string {
  const displays: Record<string, string> = {
    opening: 'Opening Statement',
    constructive: 'Constructive Argument',
    rebuttal: 'Rebuttal',
    cross_examination: 'Cross-Examination',
    closing: 'Closing Statement',
  }
  return displays[turnType] ?? 'Response'
}

/**
 * Get relevant history for debater context
 */
function getRelevantHistory(history: DebateHistoryEntry[]): DebateHistoryEntry[] {
  return history.filter((h) => h.speaker !== 'moderator' || h.turnType === 'moderator_intervention')
}

/**
 * Format history entry for context
 */
function formatHistoryEntry(entry: DebateHistoryEntry): string {
  const label = entry.speaker === 'moderator' ? 'MODERATOR' : entry.speaker.toUpperCase()
  return `[${label}] ${entry.content}`
}

/**
 * Build user prompt for a debater turn
 */
export function buildDebaterTurnPrompt(
  turnType: TurnType,
  position: 'for' | 'against',
  topic: string,
  history: DebateHistoryEntry[],
  _maxTokens: number, // Kept for API compatibility; word count now uses TARGET_WORD_COUNTS
  customRules: string[] = []
): string {
  const instructions = TURN_INSTRUCTIONS[turnType] ?? 'Present your argument.'
  const relevantHistory = getRelevantHistory(history)

  let prompt = `## Current Turn: ${getTurnTypeDisplay(turnType)}

${instructions}

## Debate Topic
"${topic}"

## Your Position
You are arguing ${position === 'for' ? 'FOR (in favor of)' : 'AGAINST'} this topic.
`

  if (customRules.length > 0) {
    prompt += `
## Custom Rules for This Debate
${customRules.map((r) => `- ${r}`).join('\n')}
`
  }

  if (relevantHistory.length > 0) {
    prompt += `
## Debate So Far
${relevantHistory.map(formatHistoryEntry).join('\n\n')}`
  }

  // Use explicit target word count (not derived from maxTokens, which is set high for buffer)
  const targetWordCount = TARGET_WORD_COUNTS[turnType] ?? 600
  const mustAddressOpponent = turnType === 'rebuttal'
  const noNewArguments = turnType === 'closing'

  prompt += `

## CRITICAL: Word Limit (${targetWordCount} words max)
You MUST stay within approximately **${targetWordCount} words**.
- Plan your argument structure BEFORE writing to fit this limit
- Budget your words: intro (~10%), main points (~75%), conclusion (~15%)
- If running long, CUT less important points rather than rushing the ending
- NEVER end mid-sentence or mid-thought — always finish with a complete conclusion
- Include "(Word count: X)" at the end of your response

## Guidelines
- Be substantive and specific within the word limit
${mustAddressOpponent ? '- You MUST address specific points from your opponent\n' : ''}${noNewArguments ? '- Do NOT introduce new arguments. Synthesize your existing case.\n' : ''}- Structure your response clearly (use headers/bullets if helpful)
- Save room for a strong, complete concluding statement

## Your ${getTurnTypeDisplay(turnType)}
Write your response now. Stay within ~${targetWordCount} words, end with a complete thought, and include your word count.`

  return prompt
}

/**
 * Get temperature for debater turn type
 */
export function getDebaterTemperature(turnType: TurnType): number {
  const temperatures: Record<string, number> = {
    opening: 0.8,
    constructive: 0.8,
    rebuttal: 0.7,
    cross_examination: 0.7,
    closing: 0.7,
  }
  return temperatures[turnType] ?? 0.7
}
