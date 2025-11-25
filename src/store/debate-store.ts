// src/store/debate-store.ts
import { create } from 'zustand'

import type { ConnectionStatus, DebatePhase, MessageRole } from '@/types'

export interface LocalMessage {
  id: string
  role: MessageRole
  content: string
  turnType?: string
  isStreaming?: boolean
  createdAt: Date
}

interface DebateState {
  currentDebateId: string | null
  debatePhase: DebatePhase
  localMessages: LocalMessage[]
  connectionStatus: ConnectionStatus
}

interface DebateActions {
  setDebateId: (id: string | null) => void
  setPhase: (phase: DebatePhase) => void
  addLocalMessage: (message: LocalMessage) => void
  updateLocalMessage: (id: string, updates: Partial<LocalMessage>) => void
  clearLocalMessages: () => void
  setConnectionStatus: (status: ConnectionStatus) => void
  reset: () => void
}

type DebateStore = DebateState & DebateActions

const initialState: DebateState = {
  currentDebateId: null,
  debatePhase: 'idle',
  localMessages: [],
  connectionStatus: 'disconnected',
}

export const useDebateStore = create<DebateStore>()((set) => ({
  ...initialState,

  setDebateId: (id) => set({ currentDebateId: id }),

  setPhase: (phase) => set({ debatePhase: phase }),

  addLocalMessage: (message) =>
    set((state) => ({
      localMessages: [...state.localMessages, message],
    })),

  updateLocalMessage: (id, updates) =>
    set((state) => ({
      localMessages: state.localMessages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  clearLocalMessages: () => set({ localMessages: [] }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  reset: () => set(initialState),
}))
