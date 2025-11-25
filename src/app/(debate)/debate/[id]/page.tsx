// src/app/(debate)/debate/[id]/page.tsx
import { notFound } from 'next/navigation'

import { Container } from '@/components/ui/container'
import { isValidDebateId } from '@/lib/id-generator'
import { getDebateSession } from '@/services/debate-service'

import type { Metadata } from 'next'

interface DebatePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DebatePageProps): Promise<Metadata> {
  const { id } = await params
  const session = await getDebateSession(id)

  if (!session) {
    return { title: 'Debate Not Found' }
  }

  const truncatedTopic =
    session.topic.length > 50 ? `${session.topic.slice(0, 50)}...` : session.topic

  return {
    title: `Debate: ${truncatedTopic}`,
    description: `AI debate on: ${session.topic}`,
  }
}

export default async function DebatePage({ params }: DebatePageProps) {
  const { id } = await params

  if (!isValidDebateId(id)) {
    notFound()
  }

  const session = await getDebateSession(id)

  if (!session) {
    notFound()
  }

  const formatLabels: Record<string, string> = {
    standard: 'Standard',
    oxford: 'Oxford',
    'lincoln-douglas': 'Lincoln-Douglas',
  }

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold">Debate Arena</h1>

      <div className="mb-6 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">Topic</h2>
        <p className="text-muted-foreground">{session.topic}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-blue-500">FOR</h3>
          <p className="text-sm text-muted-foreground">Debater A</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-red-500">AGAINST</h3>
          <p className="text-sm text-muted-foreground">Debater B</p>
        </div>
      </div>

      <div className="text-center text-muted-foreground">
        <p>Debate engine coming in Phase 4...</p>
        <p className="mt-2 text-sm">
          Format: {formatLabels[session.format]} | Turns: {session.turns}
        </p>
        {session.customRules.length > 0 && (
          <p className="mt-1 text-sm">Custom rules: {session.customRules.length}</p>
        )}
      </div>
    </Container>
  )
}
