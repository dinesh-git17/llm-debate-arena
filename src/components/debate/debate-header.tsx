// src/components/debate/debate-header.tsx

'use client'

import { cn } from '@/lib/utils'
import { useDebateViewStore } from '@/store/debate-view-store'

import { ConnectionStatus } from './connection-status'
import { DebateControls } from './debate-controls'
import { ProgressBar } from './progress-bar'

interface DebateHeaderProps {
  debateId: string
  className?: string
}

const FORMAT_DISPLAY_NAMES: Record<string, string> = {
  standard: 'Standard Debate',
  oxford: 'Oxford Style',
  'lincoln-douglas': 'Lincoln-Douglas',
}

export function DebateHeader({ debateId, className }: DebateHeaderProps) {
  const topic = useDebateViewStore((s) => s.topic)
  const format = useDebateViewStore((s) => s.format)

  const formatDisplayName = FORMAT_DISPLAY_NAMES[format] ?? format

  return (
    <header className={cn('border-b bg-card', className)}>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-foreground md:text-2xl">
              {topic || 'Loading...'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{formatDisplayName}</p>
          </div>

          <div className="flex items-center gap-4">
            <ConnectionStatus />
            <DebateControls debateId={debateId} />
          </div>
        </div>

        <ProgressBar />
      </div>
    </header>
  )
}
