// src/components/debate/message-bubble.tsx

'use client'

import { memo } from 'react'

import { getSpeakerConfig, getTurnTypeLabel } from '@/lib/speaker-config'
import { cn } from '@/lib/utils'

import type { DebateMessage } from '@/types/debate-ui'

interface MessageBubbleProps {
  message: DebateMessage
  showTimestamp?: boolean
}

export const MessageBubble = memo(function MessageBubble({
  message,
  showTimestamp = false,
}: MessageBubbleProps) {
  const config = getSpeakerConfig(message.speaker)
  const isCenter = config.position === 'center'
  const isRight = config.position === 'right'

  return (
    <div
      className={cn(
        'mb-4 flex w-full',
        isCenter && 'justify-center',
        isRight && 'justify-end',
        !isCenter && !isRight && 'justify-start'
      )}
      role="article"
      aria-label={`${config.label} - ${getTurnTypeLabel(message.turnType)}`}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl border px-4 py-3 md:max-w-[75%]',
          config.bgColor,
          config.borderColor,
          isCenter && 'max-w-[90%] text-center md:max-w-[80%]'
        )}
      >
        <div className={cn('mb-2 flex items-center gap-2', isCenter && 'justify-center')}>
          <span className="text-lg" role="img" aria-label={config.label}>
            {config.icon}
          </span>
          <span className={cn('text-sm font-semibold', config.color)}>{config.shortLabel}</span>
          <span className="text-xs text-muted-foreground">
            {getTurnTypeLabel(message.turnType)}
          </span>
        </div>

        <div className="whitespace-pre-wrap leading-relaxed text-foreground">
          {message.content}
          {message.isStreaming && (
            <span
              className="ml-1 inline-block h-4 w-2 animate-pulse bg-current"
              aria-label="Generating content"
            />
          )}
        </div>

        {(message.isComplete || showTimestamp) && (
          <div className={cn('mt-2 flex items-center gap-3 border-t pt-2', config.borderColor)}>
            {message.tokenCount !== undefined && message.tokenCount > 0 && (
              <span className="text-xs text-muted-foreground">{message.tokenCount} tokens</span>
            )}
            {showTimestamp && (
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString()}
              </span>
            )}
            {message.violations && message.violations.length > 0 && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {message.violations.length} violation{message.violations.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
