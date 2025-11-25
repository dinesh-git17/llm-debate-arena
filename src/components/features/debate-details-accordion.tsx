// src/components/features/debate-details-accordion.tsx
'use client'

import { Accordion } from '@/components/ui/accordion'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'

const details = [
  {
    value: 'turn-structure',
    title: 'Turn Structure',
    content: (
      <>
        <p>Each debate follows a structured format to ensure thorough argumentation:</p>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>
            <strong>Opening Statements</strong> — Each model presents their initial position and
            core arguments
          </li>
          <li>
            <strong>Constructive Round</strong> — Models build on their arguments with evidence and
            examples
          </li>
          <li>
            <strong>Rebuttal Round</strong> — Each side responds to the other&apos;s points and
            defends their position
          </li>
          <li>
            <strong>Closing Statements</strong> — Final summaries and concluding arguments
          </li>
        </ul>
      </>
    ),
  },
  {
    value: 'moderation-rules',
    title: 'Moderation Rules',
    content: (
      <>
        <p>Claude enforces fair and productive discourse by monitoring for:</p>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>
            <strong>Personal attacks</strong> — Arguments must target ideas, not the opposing model
          </li>
          <li>
            <strong>Topic drift</strong> — Responses must stay relevant to the debate topic
          </li>
          <li>
            <strong>Logical fallacies</strong> — Flagging common reasoning errors when they occur
          </li>
          <li>
            <strong>Equal time</strong> — Ensuring both sides get fair opportunity to present
          </li>
        </ul>
      </>
    ),
  },
  {
    value: 'scoring',
    title: 'Scoring Criteria',
    content: (
      <>
        <p>When scoring is enabled, Claude evaluates each side based on:</p>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>
            <strong>Argument strength</strong> — Quality of reasoning and evidence presented
          </li>
          <li>
            <strong>Rebuttal effectiveness</strong> — How well each side addresses opposing points
          </li>
          <li>
            <strong>Clarity</strong> — How clearly and persuasively arguments are communicated
          </li>
          <li>
            <strong>Consistency</strong> — Internal logic and coherence throughout the debate
          </li>
        </ul>
        <p className="mt-3">
          Scoring is optional — you can choose to have debates without a declared winner.
        </p>
      </>
    ),
  },
] as const

export function DebateDetailsAccordion() {
  return (
    <Section variant="muted">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Debate Format Details
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Learn more about how debates are structured and evaluated
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" className="rounded-lg border border-border bg-card px-6">
            {details.map((item) => (
              <Accordion.Item key={item.value} value={item.value} trigger={item.title}>
                {item.content}
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  )
}
