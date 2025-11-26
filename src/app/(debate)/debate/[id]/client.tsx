// src/app/(debate)/debate/[id]/client.tsx

'use client'

import { useEffect } from 'react'

import { DebateHeader } from '@/components/debate/debate-header'
import { FloatingControls } from '@/components/debate/floating-controls'
import { MessageList } from '@/components/debate/message-list'
import { ShortcutsHelp } from '@/components/debate/shortcuts-help'
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
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <DebateHeader debateId={debateId} />

      <main className="relative min-h-0 flex-1">
        <MessageList autoScroll className="h-full" />

        {/* Shortcuts help - bottom right */}
        <div className="absolute bottom-4 right-4 z-10">
          <ShortcutsHelp />
        </div>
      </main>

      {/* Floating controls */}
      <FloatingControls debateId={debateId} />

      <div className="safe-area-inset-bottom" />
    </div>
  )
}
