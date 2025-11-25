// src/app/(debate)/debate/new/page.tsx
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start a Debate',
  description: 'Start a new AI debate on any topic.',
}

export default function NewDebatePage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Start a Debate
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Debate creation form coming in Phase 3
          </p>
        </div>
      </Container>
    </Section>
  )
}
