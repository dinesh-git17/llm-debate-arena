// src/app/(debate)/debate/new/new-debate-form.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { DebateForm } from '@/components/features/debate-form'
import { Card } from '@/components/ui/card'

import { createDebate } from './actions'

import type { DebateFormValues } from '@/lib/schemas/debate-schema'

export function NewDebateForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: DebateFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createDebate(data)
      if (result.success && result.debateId) {
        router.push(`/debate/${result.debateId}`)
        return { success: true }
      }
      return { success: false, error: result.error ?? 'Failed to create debate' }
    } catch {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <DebateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Card>
  )
}
