// src/components/features/cta-banner.tsx
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'

export function CtaBanner() {
  return (
    <Section variant="muted" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-tl from-accent/20 to-transparent blur-3xl" />
      </div>

      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to see AI debate?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick a topic and watch the arguments unfold in real-time.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/debate/new">Start Your First Debate</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
