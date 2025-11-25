// src/app/(debate)/debate/new/actions.ts
'use server'

import { debateFormSchema } from '@/lib/schemas/debate-schema'
import { createDebateSession } from '@/services/debate-service'

import type { DebateFormValues } from '@/lib/schemas/debate-schema'

export interface CreateDebateActionResult {
  success: boolean
  debateId?: string | undefined
  error?: string | undefined
  fieldErrors?: Record<string, string[] | undefined> | undefined
}

export async function createDebate(data: DebateFormValues): Promise<CreateDebateActionResult> {
  const validated = debateFormSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid form data',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  const result = await createDebateSession(validated.data)

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? 'Failed to create debate',
    }
  }

  return {
    success: true,
    debateId: result.debateId,
  }
}
