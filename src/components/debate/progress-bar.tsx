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
  completed: 'Complete',
  error: 'Error',
}

// Apple-style gradient colors for progress bar
const STATUS_GRADIENTS: Record<DebateViewStatus, string> = {
  ready: 'from-muted-foreground/40 to-muted-foreground/60',
  active: 'from-blue-400 to-blue-600',
  paused: 'from-amber-400 to-amber-500',
  completed: 'from-emerald-400 to-emerald-600',
  error: 'from-red-400 to-red-500',
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

  const gradient = STATUS_GRADIENTS[status] ?? STATUS_GRADIENTS.ready

  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={progress.percentComplete}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Debate progress"
    >
      {/* Label row - baseline aligned */}
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[13px] leading-none text-muted-foreground/70">
          {getStatusLabel()}
        </span>
        <span className="text-[13px] tabular-nums leading-none text-muted-foreground/50">
          {progress.percentComplete}%
        </span>
      </div>
      {/* Progress track */}
      <div className="h-1 overflow-hidden rounded-[2px] bg-foreground/[0.06]">
        <div
          className={cn(
            'h-full rounded-[2px] bg-gradient-to-r transition-all duration-700 ease-out',
            gradient
          )}
          style={{ width: `${Math.max(progress.percentComplete, 0)}%` }}
        />
      </div>
    </div>
  )
}
