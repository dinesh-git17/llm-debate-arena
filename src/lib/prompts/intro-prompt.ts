// src/lib/prompts/intro-prompt.ts

import { buildModeratorSystemPrompt, getFormatDisplayName } from './moderator-system'

import type { CompiledPrompt, ModeratorContext } from '@/types/prompts'

/**
 * Template for debate introduction
 */
export const INTRO_PROMPT_TEMPLATE = `You are opening this debate as the moderator. Generate a welcoming introduction that:

1. Welcomes the audience to the debate
2. Clearly states the topic being debated
3. Briefly explains the format and structure
4. Introduces the two positions (FOR and AGAINST) without bias
5. Sets expectations for respectful discourse
6. Announces who will speak first

## Debate Details
- Topic: "{{topic}}"
- Format: {{format}}
- Total Debater Turns: {{totalTurns}}
- First Speaker: {{nextSpeaker}} position

{{customRulesSection}}

## Standard Rules in Effect
- No personal attacks on opponents
- Arguments must stay on topic
- Claims should be supported with reasoning
- Professional language required
- Turn length limits will be enforced

## Your Introduction
Write a moderator introduction of 100-150 words. Be welcoming but professional. Do not express any opinion on the topic itself.`

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

  const userPrompt = INTRO_PROMPT_TEMPLATE.replace('{{topic}}', context.topic)
    .replace('{{format}}', getFormatDisplayName(context.format))
    .replace('{{totalTurns}}', String(context.totalTurns))
    .replace('{{nextSpeaker}}', nextSpeakerLabel)
    .replace('{{customRulesSection}}', customRulesSection)

  return {
    systemPrompt,
    userPrompt,
    maxTokens: 200,
    temperature: 0.7,
  }
}
