// src/app/api/metrics/route.ts
// Metrics endpoint for external collectors (Prometheus-compatible)

import { NextResponse } from 'next/server'

import { metrics, supabaseLogWriter } from '@/lib/logging'

import type { NextRequest } from 'next/server'

const METRICS_AUTH_TOKEN = process.env.METRICS_AUTH_TOKEN

function validateAuth(request: NextRequest): boolean {
  if (!METRICS_AUTH_TOKEN) {
    return process.env.NODE_ENV === 'development'
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false

  const [type, token] = authHeader.split(' ')
  return type === 'Bearer' && token === METRICS_AUTH_TOKEN
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const format = request.nextUrl.searchParams.get('format') ?? 'prometheus'
  const snapshot = request.nextUrl.searchParams.get('snapshot') === 'true'

  // Get aggregated metrics
  const aggregated = metrics.getAggregatedMetrics('5m')

  // Optionally write snapshot to Supabase (call with ?snapshot=true)
  if (snapshot && supabaseLogWriter.isActive()) {
    await supabaseLogWriter.writeMetricsSnapshot(
      aggregated.system,
      {
        started: aggregated.debates.started,
        completed: aggregated.debates.completed,
        errored: aggregated.debates.errored,
      },
      aggregated as unknown as Record<string, unknown>
    )
  }

  if (format === 'json') {
    return NextResponse.json(aggregated)
  }

  const prometheusMetrics = metrics.getPrometheusMetrics()
  return new NextResponse(prometheusMetrics, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
