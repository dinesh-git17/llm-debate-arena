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
  pulse: 'none' | 'ping' | 'breathe'
}

const CONNECTION_CONFIGS: Record<ViewConnectionStatus, ConnectionConfig> = {
  disconnected: {
    dot: 'bg-muted-foreground/50',
    text: 'Offline',
    pulse: 'none',
  },
  connecting: {
    dot: 'bg-amber-400',
    text: 'Connecting',
    pulse: 'ping',
  },
  connected: {
    // Softer green, not neon
    dot: 'bg-emerald-400',
    text: 'Live',
    pulse: 'breathe',
  },
  reconnecting: {
    dot: 'bg-amber-400',
    text: 'Reconnecting',
    pulse: 'ping',
  },
  error: {
    dot: 'bg-red-400',
    text: 'Error',
    pulse: 'none',
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
      {/* Status dot - optically centered with text */}
      <span className="relative flex h-[6px] w-[6px]">
        {/* Ping animation for connecting/reconnecting states */}
        {config.pulse === 'ping' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
              config.dot
            )}
          />
        )}
        {/* Apple-style breathing glow for live state */}
        {config.pulse === 'breathe' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-breathe-glow rounded-full',
              config.dot
            )}
          />
        )}
        {/* Core dot - breathing animation when live */}
        <span
          className={cn(
            'relative inline-flex h-[6px] w-[6px] rounded-full',
            config.dot,
            config.pulse === 'breathe' && 'animate-breathe'
          )}
        />
      </span>
      {/* Label - baseline aligned with other text in header */}
      <span className="text-[13px] leading-none text-muted-foreground/60">{config.text}</span>
    </div>
  )
}
