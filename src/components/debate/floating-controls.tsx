// src/components/debate/floating-controls.tsx

'use client'

import { useState, useEffect } from 'react'

import { cn } from '@/lib/utils'
import { useDebateViewStore } from '@/store/debate-view-store'

import { DebateControls } from './debate-controls'

interface FloatingControlsProps {
  debateId: string
}

export function FloatingControls({ debateId }: FloatingControlsProps) {
  const status = useDebateViewStore((s) => s.status)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shouldShow = isVisible || status === 'active' || status === 'paused'

  if (!shouldShow) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-40 -translate-x-1/2',
        'transition-all duration-300',
        shouldShow ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
    >
      <DebateControls debateId={debateId} variant="floating" />
    </div>
  )
}
