// src/hooks/use-create-debate.ts
import { useMutation } from '@tanstack/react-query'

import type { CreateDebateInput, Debate } from '@/types'

/**
 * Mutation hook for creating new debates.
 * Will be fully implemented when API routes are built in Phase 4.
 */
export function useCreateDebate() {
  return useMutation<Debate, Error, CreateDebateInput>({
    mutationFn: async (_input) => {
      throw new Error('Not implemented: API routes pending Phase 4')
    },
  })
}
