// src/app/api/debate/route.ts
import { NextResponse } from 'next/server'

import { debateFormSchema } from '@/lib/schemas/debate-schema'
import { createDebateSession } from '@/services/debate-service'

import type { NextRequest } from 'next/server'

/**
 * POST /api/debate
 * Create a new debate session
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()

    const validated = debateFormSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Invalid form data',
          fieldErrors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const result = await createDebateSession(validated.data)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to create debate' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      debateId: result.debateId,
      session: result.session,
    })
  } catch (error) {
    console.error('[API] Debate creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
