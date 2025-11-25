// src/store/debate-view-store.ts

import { create } from 'zustand'

import type {
  DebateMessage,
  DebateViewState,
  DebateViewStatus,
  ViewConnectionStatus,
  ViewProgress,
} from '@/types/debate-ui'

interface DebateViewActions {
  setDebateInfo: (info: { debateId: string; topic: string; format: string }) => void
  setStatus: (status: DebateViewStatus) => void
  setConnection: (status: ViewConnectionStatus) => void
  setError: (error: string | null) => void

  addMessage: (message: DebateMessage) => void
  updateMessage: (id: string, updates: Partial<DebateMessage>) => void
  appendToMessage: (id: string, chunk: string) => void
  completeMessage: (id: string, finalContent: string, tokenCount: number) => void

  setProgress: (progress: ViewProgress) => void
  setCurrentTurn: (turnId: string | null) => void

  reset: () => void
}

type DebateViewStore = DebateViewState & DebateViewActions

const initialState: DebateViewState = {
  debateId: '',
  topic: '',
  format: '',
  status: 'ready',
  messages: [],
  currentTurnId: null,
  progress: {
    currentTurn: 0,
    totalTurns: 0,
    percentComplete: 0,
  },
  connection: 'disconnected',
  error: null,
}

export const useDebateViewStore = create<DebateViewStore>()((set) => ({
  ...initialState,

  setDebateInfo: (info) =>
    set({
      debateId: info.debateId,
      topic: info.topic,
      format: info.format,
    }),

  setStatus: (status) => set({ status }),

  setConnection: (connection) => set({ connection }),

  setError: (error) => set({ error }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    })),

  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + chunk } : msg
      ),
    })),

  completeMessage: (id, finalContent, tokenCount) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id
          ? { ...msg, content: finalContent, isStreaming: false, isComplete: true, tokenCount }
          : msg
      ),
    })),

  setProgress: (progress) => set({ progress }),

  setCurrentTurn: (turnId) => set({ currentTurnId: turnId }),

  reset: () => set(initialState),
}))
