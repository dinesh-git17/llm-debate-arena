// src/components/ui/textarea.tsx
'use client'

import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  showCount?: boolean
  currentLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, showCount, currentLength = 0, maxLength, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y',
            error ? 'border-destructive' : 'border-border',
            showCount && 'pb-8',
            className
          )}
          ref={ref}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {showCount && maxLength && (
          <div
            className={cn(
              'absolute bottom-2 right-3 text-xs',
              currentLength > maxLength ? 'text-destructive' : 'text-muted-foreground'
            )}
            aria-live="polite"
          >
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
