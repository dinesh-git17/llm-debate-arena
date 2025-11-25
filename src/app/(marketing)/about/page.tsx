// src/app/(marketing)/about/page.tsx
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about LLM Debate Arena and the team behind it.',
}

export default function AboutPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">About</h1>
          <p className="mt-6 text-lg text-muted-foreground">About page coming in Phase 2.3</p>
        </div>
      </Container>
    </Section>
  )
}
