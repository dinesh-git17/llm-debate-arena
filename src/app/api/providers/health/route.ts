// src/app/api/providers/health/route.ts

import { NextResponse } from 'next/server'

import { checkAllProvidersHealth, getConfiguredProviders } from '@/services/llm'

export async function GET() {
  const configured = getConfiguredProviders()
  const health = await checkAllProvidersHealth()

  return NextResponse.json({
    configured,
    health,
    timestamp: new Date().toISOString(),
  })
}
