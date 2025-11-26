// src/app/(debate)/debate/[id]/summary/page.tsx

import { notFound, redirect } from 'next/navigation'

import { getEngineState } from '@/lib/engine-store'
import { isValidDebateId } from '@/lib/id-generator'
import { getProviderDisplayName } from '@/lib/provider-pricing'
import { getSession } from '@/lib/session-store'
import { getBudgetStatus } from '@/services/budget-manager'
import { revealAssignment } from '@/services/debate-service'

import { SummaryPageClient } from './client'

import type { DebateStatistics, SummaryResponse, TurnSummary } from '@/types/summary'
import type { Metadata } from 'next'

interface SummaryPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: SummaryPageProps): Promise<Metadata> {
  const { id } = await params
  const session = await getSession(id)

  if (!session) {
    return { title: 'Summary Not Found' }
  }

  const truncatedTopic =
    session.topic.length > 50 ? `${session.topic.slice(0, 50)}...` : session.topic

  return {
    title: `Summary: ${truncatedTopic}`,
    description: `AI debate summary and reveal for: ${session.topic}`,
    openGraph: {
      title: `AI Debate Summary: ${truncatedTopic}`,
      description: `See which AI models argued for and against in this debate on: ${session.topic}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Debate Summary: ${truncatedTopic}`,
      description: `See which AI models argued for and against in this debate on: ${session.topic}`,
    },
  }
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = await params

  if (!isValidDebateId(id)) {
    notFound()
  }

  const session = await getSession(id)

  if (!session) {
    notFound()
  }

  // Redirect to debate page if not completed
  if (session.status !== 'completed') {
    redirect(`/debate/${id}`)
  }

  // Build summary response
  const engineState = await getEngineState(id)
  const budgetStatus = getBudgetStatus(id)

  const turns: TurnSummary[] = (engineState?.completedTurns ?? []).map((turn) => ({
    id: turn.id,
    turnNumber: turn.config.order,
    speaker: turn.speaker,
    speakerLabel: turn.config.label,
    turnType: turn.config.type,
    content: turn.content,
    tokenCount: turn.tokenCount,
    timestamp: turn.completedAt.toISOString(),
  }))

  const tokensByParticipant = { for: 0, against: 0, moderator: 0 }
  for (const turn of engineState?.completedTurns ?? []) {
    tokensByParticipant[turn.speaker] += turn.tokenCount
  }

  const totalDurationMs =
    engineState?.startedAt && engineState?.completedAt
      ? engineState.completedAt.getTime() - engineState.startedAt.getTime()
      : 0

  const statistics: DebateStatistics = {
    totalTurns: turns.length,
    totalTokens: budgetStatus.usage?.totalTokens ?? 0,
    totalCost: budgetStatus.usage?.totalCostUsd ?? 0,
    durationMs: totalDurationMs,
    avgTokensPerTurn:
      turns.length > 0 ? Math.round((budgetStatus.usage?.totalTokens ?? 0) / turns.length) : 0,
    avgResponseTimeMs: turns.length > 0 ? Math.round(totalDurationMs / turns.length) : 0,
    tokensByParticipant,
    costByProvider: budgetStatus.breakdown.map((b) => ({
      provider: getProviderDisplayName(b.provider),
      cost: b.totalCostUsd,
    })),
  }

  const assignment = session.status === 'completed' ? await revealAssignment(id) : null

  const summaryData: SummaryResponse = {
    debateId: id,
    topic: session.topic,
    format: session.format,
    status: 'completed',
    completedAt: session.updatedAt.toISOString(),
    turns,
    statistics,
    assignment,
  }

  return <SummaryPageClient initialData={summaryData} />
}
