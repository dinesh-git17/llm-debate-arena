// src/hooks/use-debate-messages.ts
import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import type { Message } from '@/types'

interface MessagesPage {
  messages: Message[]
  nextCursor: string | undefined
}

/**
 * Fetches debate messages with infinite scroll pagination.
 * Returns a disabled query when debateId is null.
 * Will be fully implemented when API routes are built in Phase 4.
 */
export function useDebateMessages(debateId: string | null) {
  return useInfiniteQuery<MessagesPage>({
    queryKey: debateId ? queryKeys.debates.messages(debateId) : ['debates', 'messages', null],
    queryFn: async () => {
      return { messages: [], nextCursor: undefined }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: false,
  })
}
