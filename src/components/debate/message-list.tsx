// src/components/debate/message-list.tsx

'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { useDebateViewStore } from '@/store/debate-view-store'

import { MessageBubble } from './message-bubble'

interface MessageListProps {
  className?: string
  autoScroll?: boolean
}

export function MessageList({ className, autoScroll = true }: MessageListProps) {
  const messages = useDebateViewStore((s) => s.messages)
  const currentTurnId = useDebateViewStore((s) => s.currentTurnId)
  const containerRef = useRef<HTMLDivElement>(null)
  const isUserScrolling = useRef(false)
  const lastMessageCount = useRef(0)

  useEffect(() => {
    if (!autoScroll || isUserScrolling.current) return

    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: messages.length > lastMessageCount.current ? 'smooth' : 'auto',
      })
    }

    lastMessageCount.current = messages.length
  }, [messages, currentTurnId, autoScroll])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100

      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      scrollTimeout = setTimeout(() => {
        isUserScrolling.current = !isAtBottom
      }, 150)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  if (messages.length === 0) {
    return (
      <div
        className={cn('flex h-full items-center justify-center', className)}
        role="status"
        aria-live="polite"
      >
        <div className="text-center text-muted-foreground">
          <p className="mb-2 text-lg">Waiting for debate to begin...</p>
          <p className="text-sm">Messages will appear here in real-time</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex-1 scroll-smooth overflow-y-auto px-4 py-6', className)}
      role="log"
      aria-live="polite"
      aria-label="Debate messages"
    >
      <div className="mx-auto max-w-4xl">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} showTimestamp={message.isComplete} />
        ))}

        <div id="scroll-anchor" aria-hidden="true" />
      </div>
    </div>
  )
}
