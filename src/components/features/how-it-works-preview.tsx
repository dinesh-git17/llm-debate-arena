// src/components/features/how-it-works-preview.tsx
import { Lightbulb, MessageSquare, Scale, Sparkles } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'

const steps = [
  {
    number: 1,
    icon: Lightbulb,
    title: 'Choose a Topic',
    description: 'Pick any debate topic you are curious about',
  },
  {
    number: 2,
    icon: MessageSquare,
    title: 'AI Models Debate',
    description: 'ChatGPT and Grok argue for and against',
  },
  {
    number: 3,
    icon: Scale,
    title: 'Claude Moderates',
    description: 'Fair, neutral moderation ensures quality',
  },
  {
    number: 4,
    icon: Sparkles,
    title: 'Get Insights',
    description: 'Summary and verdict from the debate',
  },
] as const

export function HowItWorksPreview() {
  return (
    <Section variant="muted">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From topic to insights in four simple steps
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.number} hover className="relative">
              <Card.Header>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Step {step.number}
                </span>
                <Card.Title className="text-lg">{step.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>{step.description}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
