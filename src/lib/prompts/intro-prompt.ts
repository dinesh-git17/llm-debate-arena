// src/lib/prompts/intro-prompt.ts

import { buildModeratorSystemPrompt, getFormatDisplayName } from './moderator-system'

import type { CompiledPrompt, ModeratorContext } from '@/types/prompts'

/**
 * Get turn structure description based on turn count
 */
function getTurnStructureDescription(totalTurns: number): string {
  if (totalTurns <= 4) {
    return 'opening statements and closing statements'
  }
  if (totalTurns <= 6) {
    return 'opening statements, rebuttals, and closing statements'
  }
  if (totalTurns <= 8) {
    return 'opening statements, constructive arguments, rebuttals, and closing statements'
  }
  return 'opening statements, constructive arguments, multiple rebuttals, and closing statements'
}

/**
 * Template for debate introduction
 */
export const INTRO_PROMPT_TEMPLATE = `You are opening this debate as the moderator. Generate a welcoming introduction that:

1. Welcomes the audience to the debate
2. Clearly states the topic being debated
3. Briefly explains the format and structure (use the EXACT turn structure provided below)
4. Introduces the two positions (FOR and AGAINST) without bias
5. Sets expectations for respectful discourse
6. Announces who will speak first and invites them to begin

## Debate Details
- Topic: "{{topic}}"
- Format: {{format}}
- Total Debater Turns: {{totalTurns}}
- Turn Structure: {{turnStructure}}
- First Speaker: {{nextSpeaker}} position

{{customRulesSection}}

## Standard Rules in Effect
- No personal attacks on opponents
- Arguments must stay on topic
- Claims should be supported with reasoning
- Professional language required
- Turn length limits will be enforced

## CRITICAL Instructions
- When describing the format, use EXACTLY this turn structure: "{{turnStructure}}"
- End by clearly inviting the first speaker to begin with a COMPLETE sentence (e.g., "FOR, you have the floor." or "The floor is yours, FOR.")
- Do NOT end mid-sentence or with incomplete thoughts

## Your Introduction
Write a moderator introduction of 120-180 words. Be welcoming but professional. Do not express any opinion on the topic itself.`

/**
 * Build custom rules section for prompt
 */
function buildCustomRulesSection(customRules: string[]): string {
  if (customRules.length === 0) {
    return ''
  }

  const rulesList = customRules.map((rule) => `- ${rule}`).join('\n')
  return `## Custom Rules for This Debate
${rulesList}

`
}

/**
 * Compile introduction prompt with context
 */
export function compileIntroPrompt(context: ModeratorContext): CompiledPrompt {
  const systemPrompt = buildModeratorSystemPrompt(context.format)

  const nextSpeakerLabel =
    context.nextSpeaker === 'for' ? 'FOR (Affirmative)' : 'AGAINST (Negative)'

  const customRulesSection = buildCustomRulesSection(context.customRules)
  const turnStructure = getTurnStructureDescription(context.totalTurns)

  const userPrompt = INTRO_PROMPT_TEMPLATE.replace('{{topic}}', context.topic)
    .replace('{{format}}', getFormatDisplayName(context.format))
    .replace('{{totalTurns}}', String(context.totalTurns))
    .replace(/\{\{turnStructure\}\}/g, turnStructure)
    .replace('{{nextSpeaker}}', nextSpeakerLabel)
    .replace('{{customRulesSection}}', customRulesSection)

  return {
    systemPrompt,
    userPrompt,
    maxTokens: 400,
    temperature: 0.7,
  }
}
