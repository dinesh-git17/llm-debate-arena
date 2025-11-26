// src/hooks/use-smooth-text.ts

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSmoothTextOptions {
  /** Characters per second to display (default: 60) */
  charsPerSecond?: number
  /** Whether streaming is complete */
  isComplete?: boolean
  /** Skip animation when content is already complete */
  skipAnimationWhenComplete?: boolean
  /** Callback when animation completes (content fully displayed) */
  onAnimationComplete?: (() => void) | undefined
}

interface UseSmoothTextReturn {
  /** The text to display (smoothly animated) */
  displayText: string
  /** Whether animation is still in progress */
  isAnimating: boolean
  /** Skip to showing all content immediately */
  skipAnimation: () => void
}

/**
 * Hook that provides smooth text display for streaming content.
 * Buffers incoming text and releases it at a controlled rate for
 * a natural, human-readable typing experience.
 */
export function useSmoothText(
  content: string,
  options: UseSmoothTextOptions = {}
): UseSmoothTextReturn {
  const {
    charsPerSecond = 60,
    isComplete = false,
    skipAnimationWhenComplete = true,
    onAnimationComplete,
  } = options

  const onAnimationCompleteRef = useRef(onAnimationComplete)
  onAnimationCompleteRef.current = onAnimationComplete
  const hasCalledCompleteRef = useRef(false)

  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const displayIndexRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)
  const skippedRef = useRef(false)

  // Calculate interval between character updates
  const msPerChar = 1000 / charsPerSecond

  // Helper to mark animation as complete and fire callback
  const markComplete = useCallback(() => {
    if (!hasCalledCompleteRef.current) {
      hasCalledCompleteRef.current = true
      setIsAnimating(false)
      onAnimationCompleteRef.current?.()
    }
  }, [])

  // Skip animation function
  const skipAnimation = useCallback(() => {
    skippedRef.current = true
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setDisplayText(content)
    displayIndexRef.current = content.length
    markComplete()
  }, [content, markComplete])

  // If content is already complete on first render, skip animation
  useEffect(() => {
    if (
      skipAnimationWhenComplete &&
      isComplete &&
      displayIndexRef.current === 0 &&
      content.length > 0
    ) {
      // Content arrived all at once (e.g., page reload), show immediately
      skipAnimation()
    }
  }, [skipAnimationWhenComplete, isComplete, content.length, skipAnimation])

  // Animation loop
  useEffect(() => {
    // Skip if animation was manually skipped
    if (skippedRef.current) {
      return
    }

    const currentIndex = displayIndexRef.current
    const targetLength = content.length

    // Nothing to animate - but only mark complete if streaming is done
    if (currentIndex >= targetLength) {
      if (isComplete && targetLength > 0) {
        markComplete()
      } else {
        setIsAnimating(false)
      }
      return
    }

    setIsAnimating(true)

    const animate = (timestamp: number) => {
      if (skippedRef.current) return

      const elapsed = timestamp - lastUpdateRef.current

      if (elapsed >= msPerChar) {
        const charsToAdd = Math.min(
          Math.floor(elapsed / msPerChar),
          targetLength - displayIndexRef.current
        )

        if (charsToAdd > 0) {
          displayIndexRef.current += charsToAdd
          setDisplayText(content.slice(0, displayIndexRef.current))
          lastUpdateRef.current = timestamp
        }
      }

      // Continue animation if not caught up
      if (displayIndexRef.current < content.length) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else if (isComplete) {
        // Animation finished and streaming is complete
        markComplete()
      } else {
        // Caught up but still streaming - wait for more content
        setIsAnimating(false)
      }
    }

    // Initialize timing on first frame
    if (lastUpdateRef.current === 0) {
      lastUpdateRef.current = performance.now()
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [content, msPerChar, isComplete, markComplete])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    displayText,
    isAnimating,
    skipAnimation,
  }
}
