// src/components/debate/connection-status.tsx

'use client'

import { cn } from '@/lib/utils'
import { useDebateViewStore } from '@/store/debate-view-store'

import type { ViewConnectionStatus } from '@/types/debate-ui'

interface ConnectionStatusProps {
  className?: string
}

interface ConnectionConfig {
  dot: string
  text: string
  pulse: boolean
}

const CONNECTION_CONFIGS: Record<ViewConnectionStatus, ConnectionConfig> = {
  disconnected: {
    dot: 'bg-gray-400',
    text: 'Disconnected',
    pulse: false,
  },
  connecting: {
    dot: 'bg-amber-400',
    text: 'Connecting...',
    pulse: true,
  },
  connected: {
    dot: 'bg-green-500',
    text: 'Live',
    pulse: true,
  },
  reconnecting: {
    dot: 'bg-amber-400',
    text: 'Reconnecting...',
    pulse: true,
  },
  error: {
    dot: 'bg-red-500',
    text: 'Connection error',
    pulse: false,
  },
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const connection = useDebateViewStore((s) => s.connection)
  const config = CONNECTION_CONFIGS[connection]

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-label={`Connection status: ${config.text}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              config.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', config.dot)} />
      </span>
      <span className="text-xs text-muted-foreground">{config.text}</span>
    </div>
  )
}
