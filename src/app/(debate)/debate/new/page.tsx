// src/app/(debate)/debate/new/page.tsx
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'

import { NewDebateForm } from './new-debate-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Debate',
  description: 'Configure and start a new AI debate',
}

export default function NewDebatePage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Start a New Debate
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Configure your debate topic, format, and rules. Two AI models will argue opposing
              sides.
            </p>
          </div>
          <NewDebateForm />
        </div>
      </Container>
    </Section>
  )
}
