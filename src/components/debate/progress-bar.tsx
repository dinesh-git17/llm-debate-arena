// src/components/debate/progress-bar.tsx

'use client'

import { cn } from '@/lib/utils'
import { useDebateViewStore } from '@/store/debate-view-store'

import type { DebateViewStatus } from '@/types/debate-ui'

interface ProgressBarProps {
  className?: string
}

const STATUS_LABELS: Record<DebateViewStatus, string> = {
  ready: 'Ready to start',
  active: 'In progress',
  paused: 'Paused',
  completed: 'Debate complete',
  error: 'Error occurred',
}

const STATUS_COLORS: Record<DebateViewStatus, string> = {
  ready: 'bg-muted-foreground',
  active: 'bg-primary',
  paused: 'bg-amber-500',
  completed: 'bg-green-500',
  error: 'bg-red-500',
}

export function ProgressBar({ className }: ProgressBarProps) {
  const progress = useDebateViewStore((s) => s.progress)
  const status = useDebateViewStore((s) => s.status)

  const getStatusLabel = (): string => {
    if (status === 'active' && progress.totalTurns > 0) {
      return `Turn ${progress.currentTurn} of ${progress.totalTurns}`
    }
    return STATUS_LABELS[status]
  }

  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={progress.percentComplete}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Debate progress"
    >
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{getStatusLabel()}</span>
        <span className="font-medium">{progress.percentComplete}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            STATUS_COLORS[status]
          )}
          style={{ width: `${progress.percentComplete}%` }}
        />
      </div>
    </div>
  )
}
