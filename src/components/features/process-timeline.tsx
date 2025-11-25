// src/components/features/process-timeline.tsx
import { Lightbulb, MessageSquare, Shuffle, Trophy } from 'lucide-react'

import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Timeline } from '@/components/ui/timeline'

const steps = [
  {
    step: 1,
    title: 'Pick a Topic',
    icon: Lightbulb,
    content:
      'Enter any debate topic you are curious about. Politics, technology, philosophy, pop culture — anything goes. You can optionally set custom rules to guide how the debate unfolds.',
  },
  {
    step: 2,
    title: 'Models Take Sides',
    icon: Shuffle,
    content:
      'ChatGPT and Grok are randomly assigned to argue FOR or AGAINST your topic. Neither you nor they know which side they will get until the debate begins — ensuring unbiased arguments.',
  },
  {
    step: 3,
    title: 'Watch the Debate',
    icon: MessageSquare,
    content:
      'Each model presents opening arguments, rebuttals, and closing statements. Claude monitors the conversation as a neutral moderator, ensuring fair play and professional discourse throughout.',
  },
  {
    step: 4,
    title: 'Review the Results',
    icon: Trophy,
    content:
      'Claude summarizes the key arguments from both sides and provides a final analysis. Download the full transcript or share a link so others can see the debate unfold.',
  },
] as const

export function ProcessTimeline() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Debate Journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Four steps from curiosity to insight</p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <Timeline>
            {steps.map((item, index) => (
              <Timeline.Item
                key={item.step}
                step={item.step}
                title={item.title}
                icon={<item.icon className="h-5 w-5" aria-hidden="true" />}
                isLast={index === steps.length - 1}
              >
                <p>{item.content}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Container>
    </Section>
  )
}
