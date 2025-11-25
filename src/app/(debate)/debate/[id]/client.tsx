// src/app/(debate)/debate/[id]/client.tsx

'use client'

import { useEffect } from 'react'

import { DebateHeader } from '@/components/debate/debate-header'
import { MessageList } from '@/components/debate/message-list'
import { useDebateStream } from '@/hooks/use-debate-stream'
import { useDebateViewStore } from '@/store/debate-view-store'

import type { DebatePhase } from '@/types/debate'
import type { DebateViewStatus } from '@/types/debate-ui'

interface DebatePageClientProps {
  debateId: string
  initialTopic: string
  initialFormat: string
  initialStatus: DebatePhase
}

function mapPhaseToViewStatus(phase: DebatePhase): DebateViewStatus {
  switch (phase) {
    case 'idle':
    case 'configuring':
    case 'validating':
    case 'ready':
      return 'ready'
    case 'active':
      return 'active'
    case 'paused':
      return 'paused'
    case 'completed':
      return 'completed'
    case 'error':
      return 'error'
    default:
      return 'ready'
  }
}

export function DebatePageClient({
  debateId,
  initialTopic,
  initialFormat,
  initialStatus,
}: DebatePageClientProps) {
  const { setDebateInfo, setStatus, reset } = useDebateViewStore()

  useEffect(() => {
    setDebateInfo({
      debateId,
      topic: initialTopic,
      format: initialFormat,
    })
    setStatus(mapPhaseToViewStatus(initialStatus))

    return () => {
      reset()
    }
  }, [debateId, initialTopic, initialFormat, initialStatus, setDebateInfo, setStatus, reset])

  useDebateStream({
    debateId,
    autoConnect: true,
    onDebateComplete: () => {
      console.log('[Debate] Completed')
    },
    onError: (error) => {
      console.error('[Debate] Error:', error)
    },
  })

  return (
    <div className="flex h-screen flex-col bg-background">
      <DebateHeader debateId={debateId} />

      <main className="flex-1 overflow-hidden">
        <MessageList autoScroll />
      </main>

      <div className="safe-area-inset-bottom" />
    </div>
  )
}
