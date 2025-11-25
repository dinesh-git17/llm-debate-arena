// src/hooks/use-debate.ts
import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import type { Debate } from '@/types'

/**
 * Fetches debate details by ID.
 * Returns a disabled query when id is null.
 * Will be fully implemented when API routes are built in Phase 4.
 */
export function useDebate(id: string | null) {
  return useQuery<Debate | null>({
    queryKey: id ? queryKeys.debates.detail(id) : ['debates', 'detail', null],
    queryFn: async () => {
      if (!id) return null
      return null
    },
    enabled: false,
  })
}
