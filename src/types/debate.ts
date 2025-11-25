// src/types/debate.ts

export type DebatePhase =
  | 'idle'
  | 'configuring'
  | 'validating'
  | 'ready'
  | 'active'
  | 'paused'
  | 'completed'
  | 'error'

export type DebateFormat = 'standard' | 'oxford' | 'lincoln-douglas'

export type MessageRole = 'debater_for' | 'debater_against' | 'moderator' | 'system'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

export interface Message {
  id: string
  debateId: string
  role: MessageRole
  content: string
  turnType?: string
  turnNumber?: number
  tokenCount?: number
  isStreaming?: boolean
  createdAt: Date
}

export interface Debate {
  id: string
  topic: string
  turns: number
  format: DebateFormat
  customRules: string[]
  status: DebatePhase
  createdAt: Date
  updatedAt: Date
}

export interface DebateFilters {
  status?: DebatePhase
  limit?: number
  offset?: number
}

export interface CreateDebateInput {
  topic: string
  turns?: number
  format?: DebateFormat
  customRules?: string[]
}
