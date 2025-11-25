// src/components/debate/debate-controls.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDebateViewStore } from '@/store/debate-view-store'

interface DebateControlsProps {
  debateId: string
  className?: string
}

export function DebateControls({ debateId, className }: DebateControlsProps) {
  const status = useDebateViewStore((s) => s.status)
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/debate/${debateId}/engine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to start debate')
      }
    } catch (error) {
      console.error('Start error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePause = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/debate/${debateId}/engine/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to pause debate')
      }
    } catch (error) {
      console.error('Pause error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResume = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/debate/${debateId}/engine/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to resume debate')
      }
    } catch (error) {
      console.error('Resume error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    const confirmed = window.confirm('Are you sure you want to end this debate early?')
    if (!confirmed) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/debate/${debateId}/engine/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end', reason: 'Cancelled by user' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to end debate')
      }
    } catch (error) {
      console.error('Cancel error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {status === 'ready' && (
        <Button onClick={handleStart} disabled={isLoading} variant="primary">
          {isLoading ? 'Starting...' : 'Start Debate'}
        </Button>
      )}

      {status === 'active' && (
        <>
          <Button variant="outline" onClick={handlePause} disabled={isLoading}>
            {isLoading ? 'Pausing...' : 'Pause'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            End Early
          </Button>
        </>
      )}

      {status === 'paused' && (
        <>
          <Button onClick={handleResume} disabled={isLoading} variant="primary">
            {isLoading ? 'Resuming...' : 'Resume'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            End Debate
          </Button>
        </>
      )}

      {status === 'completed' && (
        <Button variant="outline" asChild>
          <Link href={`/debate/${debateId}/summary`}>View Summary</Link>
        </Button>
      )}

      {status === 'error' && (
        <Button onClick={handleStart} disabled={isLoading} variant="primary">
          {isLoading ? 'Retrying...' : 'Retry'}
        </Button>
      )}
    </div>
  )
}
