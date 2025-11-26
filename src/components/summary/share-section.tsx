// src/components/summary/share-section.tsx

'use client'

import { useCallback, useState } from 'react'

import { cn } from '@/lib/utils'
import { useSummaryStore } from '@/store/summary-store'

interface ShareSectionProps {
  className?: string
}

type SharePlatform = 'twitter' | 'linkedin' | 'copy'

export function ShareSection({ className }: ShareSectionProps) {
  const debateId = useSummaryStore((s) => s.debateId)
  const topic = useSummaryStore((s) => s.topic)
  const assignment = useSummaryStore((s) => s.assignment)
  const revealState = useSummaryStore((s) => s.revealState)

  const [copied, setCopied] = useState(false)

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/debate/${debateId}/summary`
  }, [debateId])

  const getShareText = useCallback(() => {
    const baseText = `I just watched an AI debate on "${topic}"`

    if (revealState === 'revealed' && assignment) {
      return `${baseText}. ${assignment.for.displayName} argued FOR and ${assignment.against.displayName} argued AGAINST. Check it out!`
    }

    return `${baseText}. Can you guess which AI argued which side?`
  }, [topic, revealState, assignment])

  const handleShare = useCallback(
    async (platform: SharePlatform) => {
      const url = getShareUrl()
      const text = getShareText()

      switch (platform) {
        case 'twitter': {
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
          window.open(twitterUrl, '_blank', 'noopener,noreferrer')
          break
        }

        case 'linkedin': {
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
          break
        }

        case 'copy': {
          try {
            await navigator.clipboard.writeText(`${text}\n\n${url}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch {
            console.error('Failed to copy to clipboard')
          }
          break
        }
      }
    },
    [getShareUrl, getShareText]
  )

  return (
    <section className={cn('w-full', className)}>
      {/* Section header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Share This Debate</h2>
        <p className="text-muted-foreground">
          Share with friends and see if they can guess which AI argued which side
        </p>
      </div>

      {/* Share buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Twitter/X */}
        <button
          onClick={() => handleShare('twitter')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-black text-white',
            'hover:bg-gray-800 transition-colors',
            'focus:outline-none focus:ring-4 focus:ring-gray-500/30'
          )}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-medium">Share on X</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-[#0077B5] text-white',
            'hover:bg-[#006097] transition-colors',
            'focus:outline-none focus:ring-4 focus:ring-[#0077B5]/30'
          )}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="font-medium">Share on LinkedIn</span>
        </button>

        {/* Copy link */}
        <button
          onClick={() => handleShare('copy')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-muted text-foreground border border-border',
            'hover:bg-muted/80 transition-colors',
            'focus:outline-none focus:ring-4 focus:ring-primary/20'
          )}
        >
          {copied ? (
            <>
              <svg
                className="w-5 h-5 text-emerald-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-medium text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="font-medium">Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Share preview */}
      <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border">
        <div className="text-sm text-muted-foreground mb-2">Share preview:</div>
        <p className="text-foreground/80 text-sm italic">&ldquo;{getShareText()}&rdquo;</p>
      </div>
    </section>
  )
}
