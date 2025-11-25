// src/services/debate-service.ts
import { generateDebateAssignment, getProviderForPosition } from '@/lib/debate-assignment'
import { generateDebateId } from '@/lib/id-generator'
import { getSession, storeSession, toPublicSession, updateSession } from '@/lib/session-store'

import type { DebateFormValues } from '@/lib/schemas/debate-schema'
import type {
  DebatePhase,
  DebatePosition,
  DebateSession,
  DebateSessionPublic,
  LLMProvider,
} from '@/types/debate'

const SESSION_TTL_HOURS = 24

export interface CreateDebateResult {
  success: boolean
  debateId?: string | undefined
  session?: DebateSessionPublic | undefined
  error?: string | undefined
}

/**
 * Creates a new debate session with random LLM assignment.
 */
export async function createDebateSession(formData: DebateFormValues): Promise<CreateDebateResult> {
  try {
    const debateId = generateDebateId()
    const assignment = generateDebateAssignment()
    const now = new Date()

    const session: DebateSession = {
      id: debateId,
      topic: formData.topic,
      turns: formData.turns,
      format: formData.format,
      customRules: formData.customRules ?? [],
      assignment,
      status: 'ready',
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(now.getTime() + SESSION_TTL_HOURS * 60 * 60 * 1000),
    }

    await storeSession(session)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Debate ${debateId}] Created with assignment:`, {
        for: assignment.forPosition,
        against: assignment.againstPosition,
      })
    }

    return {
      success: true,
      debateId,
      session: toPublicSession(session),
    }
  } catch (error) {
    console.error('Failed to create debate session:', error)
    return {
      success: false,
      error: 'Failed to create debate session',
    }
  }
}

/**
 * Retrieves a debate session (public version only).
 * Use this for client-facing operations.
 */
export async function getDebateSession(debateId: string): Promise<DebateSessionPublic | null> {
  const session = await getSession(debateId)
  if (!session) return null
  return toPublicSession(session)
}

/**
 * Retrieves full session including assignment (internal use only).
 * Never expose this to client responses.
 */
export async function getFullDebateSession(debateId: string): Promise<DebateSession | null> {
  return getSession(debateId)
}

/**
 * Gets the LLM provider for a specific position in a debate.
 * Internal use only - used by debate engine.
 */
export async function getProviderForTurn(
  debateId: string,
  position: DebatePosition
): Promise<LLMProvider | null> {
  const session = await getSession(debateId)
  if (!session) return null
  return getProviderForPosition(session.assignment, position)
}

/**
 * Updates debate status.
 */
export async function updateDebateStatus(debateId: string, status: DebatePhase): Promise<boolean> {
  const updated = await updateSession(debateId, { status })
  return updated !== null
}

/**
 * Reveals assignment after debate completion.
 * Only call this when debate status is 'completed'.
 */
export async function revealAssignment(
  debateId: string
): Promise<{ forModel: string; againstModel: string } | null> {
  const session = await getSession(debateId)
  if (!session) return null

  if (session.status !== 'completed') {
    return null
  }

  const modelNames: Record<LLMProvider, string> = {
    chatgpt: 'ChatGPT',
    grok: 'Grok',
  }

  return {
    forModel: modelNames[session.assignment.forPosition],
    againstModel: modelNames[session.assignment.againstPosition],
  }
}
