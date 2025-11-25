// src/app/(debate)/debate/new/actions.ts
'use server'

import { debateFormSchema, type DebateFormValues } from '@/lib/schemas/debate-schema'

export interface CreateDebateResult {
  success: boolean
  debateId?: string
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
}

export async function createDebate(data: DebateFormValues): Promise<CreateDebateResult> {
  const validated = debateFormSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid form data',
      fieldErrors: validated.error.flatten().fieldErrors,
    }
  }

  return {
    success: true,
    debateId: `debate-${crypto.randomUUID()}`,
  }
}
