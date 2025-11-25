// src/services/debate-engine.ts

import { getProviderForPosition } from '@/lib/debate-assignment'
import { getEngineState, storeEngineState } from '@/lib/engine-store'
import { getFullDebateSession, updateDebateStatus } from '@/services/debate-service'
import { TurnSequencer } from '@/services/turn-sequencer'

import type { DebateSession, LLMProvider } from '@/types/debate'
import type { DebateEngineState, DebateProgress, TurnConfig, TurnProvider } from '@/types/turn'

export interface DebateEngineContext {
  session: DebateSession
  sequencer: TurnSequencer
}

export interface StartDebateResult {
  success: boolean
  error?: string
}

export interface RecordTurnResult {
  success: boolean
  isComplete: boolean
  error?: string
}

export interface CurrentTurnInfo {
  turn: TurnConfig
  provider: TurnProvider
  progress: DebateProgress
  context: string
}

/**
 * Initialize a debate engine for a session.
 * Creates new or resumes existing engine state.
 */
export async function initializeEngine(debateId: string): Promise<DebateEngineContext | null> {
  const session = await getFullDebateSession(debateId)
  if (!session) {
    console.error(`[Engine] Session not found: ${debateId}`)
    return null
  }

  const existingState = await getEngineState(debateId)
  if (existingState) {
    console.log(`[Engine] Resuming existing engine: ${debateId}`)
    const sequencer = TurnSequencer.fromState(existingState)
    return { session, sequencer }
  }

  const sequencer = new TurnSequencer({
    debateId,
    format: session.format,
    turnCount: session.turns,
    customRules: session.customRules,
  })

  await storeEngineState(debateId, sequencer.getState())

  console.log(`[Engine] Initialized new engine: ${debateId}`)

  return { session, sequencer }
}

/**
 * Start a debate.
 */
export async function startDebate(debateId: string): Promise<StartDebateResult> {
  const context = await initializeEngine(debateId)
  if (!context) {
    return { success: false, error: 'Failed to initialize engine' }
  }

  try {
    context.sequencer.start()
    await storeEngineState(debateId, context.sequencer.getState())
    await updateDebateStatus(debateId, 'active')

    console.log(`[Engine] Started debate: ${debateId}`)
    return { success: true }
  } catch (error) {
    console.error(`[Engine] Failed to start debate:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get current turn info for a debate.
 */
export async function getCurrentTurnInfo(debateId: string): Promise<CurrentTurnInfo | null> {
  const engineContext = await initializeEngine(debateId)
  if (!engineContext) return null

  const { session, sequencer } = engineContext
  const currentTurn = sequencer.getCurrentTurn()

  if (!currentTurn) {
    return null
  }

  let provider: TurnProvider
  if (currentTurn.speaker === 'moderator') {
    provider = 'claude'
  } else {
    provider = getProviderForPosition(session.assignment, currentTurn.speaker)
  }

  return {
    turn: currentTurn,
    provider,
    progress: sequencer.getProgress(),
    context: sequencer.getDebateContext(),
  }
}

/**
 * Get next turn info (preview).
 */
export async function getNextTurnInfo(
  debateId: string
): Promise<{ turn: TurnConfig; provider: TurnProvider } | null> {
  const engineContext = await initializeEngine(debateId)
  if (!engineContext) return null

  const { session, sequencer } = engineContext
  const nextTurn = sequencer.getNextTurn()

  if (!nextTurn) {
    return null
  }

  let provider: TurnProvider
  if (nextTurn.speaker === 'moderator') {
    provider = 'claude'
  } else {
    provider = getProviderForPosition(session.assignment, nextTurn.speaker)
  }

  return { turn: nextTurn, provider }
}

/**
 * Record a completed turn.
 */
export async function recordCompletedTurn(
  debateId: string,
  content: string,
  provider: LLMProvider | 'claude',
  tokenCount: number
): Promise<RecordTurnResult> {
  const context = await initializeEngine(debateId)
  if (!context) {
    return { success: false, isComplete: false, error: 'Engine not found' }
  }

  const { sequencer } = context
  const currentTurn = sequencer.getCurrentTurn()

  if (!currentTurn) {
    return { success: false, isComplete: true, error: 'No current turn' }
  }

  try {
    sequencer.recordTurn({
      speaker: currentTurn.speaker,
      provider,
      content,
      tokenCount,
      startedAt: new Date(),
      completedAt: new Date(),
    })

    await storeEngineState(debateId, sequencer.getState())

    const isComplete = sequencer.isComplete()
    if (isComplete) {
      await updateDebateStatus(debateId, 'completed')
    }

    return { success: true, isComplete }
  } catch (error) {
    console.error(`[Engine] Failed to record turn:`, error)
    return {
      success: false,
      isComplete: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Record a turn with timing information.
 */
export async function recordCompletedTurnWithTiming(
  debateId: string,
  content: string,
  provider: LLMProvider | 'claude',
  tokenCount: number,
  startedAt: Date,
  completedAt: Date
): Promise<RecordTurnResult> {
  const context = await initializeEngine(debateId)
  if (!context) {
    return { success: false, isComplete: false, error: 'Engine not found' }
  }

  const { sequencer } = context
  const currentTurn = sequencer.getCurrentTurn()

  if (!currentTurn) {
    return { success: false, isComplete: true, error: 'No current turn' }
  }

  try {
    sequencer.recordTurn({
      speaker: currentTurn.speaker,
      provider,
      content,
      tokenCount,
      startedAt,
      completedAt,
    })

    await storeEngineState(debateId, sequencer.getState())

    const isComplete = sequencer.isComplete()
    if (isComplete) {
      await updateDebateStatus(debateId, 'completed')
    }

    return { success: true, isComplete }
  } catch (error) {
    console.error(`[Engine] Failed to record turn:`, error)
    return {
      success: false,
      isComplete: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Insert a moderator intervention.
 */
export async function insertModeratorIntervention(
  debateId: string,
  content: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const context = await initializeEngine(debateId)
  if (!context) {
    return { success: false, error: 'Engine not found' }
  }

  try {
    context.sequencer.insertIntervention(content, reason)
    await storeEngineState(debateId, context.sequencer.getState())
    return { success: true }
  } catch (error) {
    console.error(`[Engine] Failed to insert intervention:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get engine state for a debate.
 */
export async function getDebateEngineState(debateId: string): Promise<DebateEngineState | null> {
  return getEngineState(debateId)
}

/**
 * Get debate progress.
 */
export async function getDebateProgress(debateId: string): Promise<DebateProgress | null> {
  const context = await initializeEngine(debateId)
  if (!context) return null
  return context.sequencer.getProgress()
}

/**
 * Get full debate transcript.
 */
export async function getDebateTranscript(debateId: string): Promise<string | null> {
  const context = await initializeEngine(debateId)
  if (!context) return null
  return context.sequencer.getFullTranscript()
}

/**
 * End debate early.
 */
export async function endDebateEarly(debateId: string, reason: string): Promise<boolean> {
  const context = await initializeEngine(debateId)
  if (!context) return false

  context.sequencer.cancel(reason)
  await storeEngineState(debateId, context.sequencer.getState())
  await updateDebateStatus(debateId, 'completed')

  console.log(`[Engine] Ended debate early: ${debateId} - ${reason}`)

  return true
}

/**
 * Pause debate.
 */
export async function pauseDebate(debateId: string): Promise<boolean> {
  const context = await initializeEngine(debateId)
  if (!context) return false

  context.sequencer.pause()
  await storeEngineState(debateId, context.sequencer.getState())
  await updateDebateStatus(debateId, 'paused')

  console.log(`[Engine] Paused debate: ${debateId}`)

  return true
}

/**
 * Resume debate.
 */
export async function resumeDebate(debateId: string): Promise<boolean> {
  const context = await initializeEngine(debateId)
  if (!context) return false

  context.sequencer.resume()
  await storeEngineState(debateId, context.sequencer.getState())
  await updateDebateStatus(debateId, 'active')

  console.log(`[Engine] Resumed debate: ${debateId}`)

  return true
}

/**
 * Set debate to error state.
 */
export async function setDebateError(debateId: string, error: string): Promise<boolean> {
  const context = await initializeEngine(debateId)
  if (!context) return false

  context.sequencer.setError(error)
  await storeEngineState(debateId, context.sequencer.getState())
  await updateDebateStatus(debateId, 'error')

  console.error(`[Engine] Debate error: ${debateId} - ${error}`)

  return true
}

/**
 * Check if a debate can be started.
 */
export async function canStartDebate(debateId: string): Promise<{
  canStart: boolean
  reason?: string
}> {
  const session = await getFullDebateSession(debateId)
  if (!session) {
    return { canStart: false, reason: 'Session not found' }
  }

  if (session.status !== 'ready') {
    return { canStart: false, reason: `Invalid session status: ${session.status}` }
  }

  const existingState = await getEngineState(debateId)
  if (existingState && existingState.status !== 'initialized') {
    return { canStart: false, reason: `Engine already in status: ${existingState.status}` }
  }

  return { canStart: true }
}
