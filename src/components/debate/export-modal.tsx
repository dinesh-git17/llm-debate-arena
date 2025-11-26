// src/components/debate/export-modal.tsx

'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { ExportFormat, ExportConfig } from '@/types/export'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (config: ExportConfig) => void
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown')
  const [includeTimestamps, setIncludeTimestamps] = useState(true)
  const [includeTokenCounts, setIncludeTokenCounts] = useState(false)
  const [includeModeratorTurns, setIncludeModeratorTurns] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleExport = () => {
    onExport({
      format,
      includeMetadata: true,
      includeTimestamps,
      includeTokenCounts,
      includeModeratorTurns,
    })
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const formatOptions: { value: ExportFormat; label: string; description: string }[] = [
    {
      value: 'markdown',
      label: 'Markdown (.md)',
      description: 'Formatted with headers and styling',
    },
    {
      value: 'text',
      label: 'Plain Text (.txt)',
      description: 'Simple text with line breaks',
    },
    {
      value: 'json',
      label: 'JSON (.json)',
      description: 'Structured data for developers',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="animate-scale-in relative z-10 mx-4 w-full max-w-lg rounded-xl border bg-card shadow-xl">
        <div className="p-6">
          {/* Header */}
          <h2 className="mb-1 text-lg font-semibold">Export Transcript</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Choose format and options for your export
          </p>

          {/* Format selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium">Format</label>
            <div className="space-y-2">
              {formatOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                    format === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <input
                    type="radio"
                    name="format"
                    value={option.value}
                    checked={format === option.value}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium">Options</label>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeModeratorTurns}
                  onChange={(e) => setIncludeModeratorTurns(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Include moderator messages</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Include timestamps</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeTokenCounts}
                  onChange={(e) => setIncludeTokenCounts(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Include token counts</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
