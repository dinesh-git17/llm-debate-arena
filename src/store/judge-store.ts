// src/store/judge-store.ts

import { create } from 'zustand'

import type { JudgeAnalysis } from '@/types/judge'

interface JudgeState {
  analysis: JudgeAnalysis | null
  isLoading: boolean
  error: string | null
  generationTime: number | null
  cached: boolean
}

interface JudgeActions {
  fetchAnalysis: (debateId: string, forceRegenerate?: boolean) => Promise<void>
  setError: (error: string | null) => void
  reset: () => void
}

type JudgeStore = JudgeState & JudgeActions

const initialState: JudgeState = {
  analysis: null,
  isLoading: false,
  error: null,
  generationTime: null,
  cached: false,
}

export const useJudgeStore = create<JudgeStore>()((set) => ({
  ...initialState,

  fetchAnalysis: async (debateId: string, forceRegenerate = false) => {
    set({ isLoading: true, error: null })

    try {
      const url = forceRegenerate
        ? `/api/debate/${debateId}/judge?regenerate=true`
        : `/api/debate/${debateId}/judge`

      const response = await fetch(url)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch analysis')
      }

      const data = await response.json()

      set({
        analysis: {
          ...data.analysis,
          generatedAt: new Date(data.analysis.generatedAt),
        },
        isLoading: false,
        error: null,
        generationTime: data.generationTimeMs ?? null,
        cached: data.cached ?? false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
        analysis: null,
        generationTime: null,
        cached: false,
      })
    }
  },

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}))

/**
 * Selector for total combined score
 */
export const selectTotalCombinedScore = (state: JudgeStore): number => {
  if (!state.analysis) return 0
  return state.analysis.forAnalysis.totalScore + state.analysis.againstAnalysis.totalScore
}

/**
 * Selector for average percentage
 */
export const selectAveragePercentage = (state: JudgeStore): number => {
  if (!state.analysis) return 0
  return Math.round(
    (state.analysis.forAnalysis.percentage + state.analysis.againstAnalysis.percentage) / 2
  )
}

/**
 * Selector for checking if scores are close
 */
export const selectIsCloseDebate = (state: JudgeStore): boolean => {
  if (!state.analysis) return false
  const diff = Math.abs(
    state.analysis.forAnalysis.percentage - state.analysis.againstAnalysis.percentage
  )
  return diff <= 10
}
