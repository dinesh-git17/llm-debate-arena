// src/store/summary-store.ts

import { create } from 'zustand'

import { getModelIdentity } from '@/types/summary'

import type { RevealedAssignment, SummaryResponse, SummaryState } from '@/types/summary'

interface SummaryActions {
  loadSummary: (data: SummaryResponse) => void
  setStatus: (status: 'loading' | 'ready' | 'error') => void
  setError: (error: string | null) => void

  startReveal: () => void
  completeReveal: () => void
  resetReveal: () => void

  setClaudeSummary: (summary: string) => void
  setSummaryLoading: (loading: boolean) => void

  reset: () => void
}

type SummaryStore = SummaryState & SummaryActions

const initialState: SummaryState = {
  debateId: '',
  topic: '',
  format: '',
  status: 'loading',
  error: null,
  turns: [],
  statistics: null,
  revealState: 'hidden',
  assignment: null,
  claudeSummary: null,
  isSummaryLoading: false,
}

export const useSummaryStore = create<SummaryStore>()((set, get) => ({
  ...initialState,

  loadSummary: (data: SummaryResponse) => {
    let assignment: RevealedAssignment | null = null

    if (data.assignment) {
      const forIdentity = getModelIdentity(data.assignment.forModel.toLowerCase())
      const againstIdentity = getModelIdentity(data.assignment.againstModel.toLowerCase())

      assignment = {
        for: forIdentity,
        against: againstIdentity,
      }
    }

    set({
      debateId: data.debateId,
      topic: data.topic,
      format: data.format,
      status: 'ready',
      error: null,
      turns: data.turns,
      statistics: data.statistics,
      assignment,
      revealState: 'hidden',
    })
  },

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: error ? 'error' : get().status }),

  startReveal: () => {
    set({ revealState: 'revealing' })
  },

  completeReveal: () => {
    set({ revealState: 'revealed' })
  },

  resetReveal: () => {
    set({ revealState: 'hidden' })
  },

  setClaudeSummary: (summary) => set({ claudeSummary: summary, isSummaryLoading: false }),

  setSummaryLoading: (loading) => set({ isSummaryLoading: loading }),

  reset: () => set(initialState),
}))

/**
 * Selector for checking if reveal can be triggered
 */
export const selectCanReveal = (state: SummaryStore): boolean =>
  state.status === 'ready' && state.revealState === 'hidden' && state.assignment !== null

/**
 * Selector for getting formatted duration
 */
export const selectFormattedDuration = (state: SummaryStore): string => {
  if (!state.statistics) return '0:00'

  const totalSeconds = Math.floor(state.statistics.durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
