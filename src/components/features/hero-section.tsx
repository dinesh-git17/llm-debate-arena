// src/components/features/hero-section.tsx
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-secondary/30 via-muted/20 to-transparent blur-3xl" />
      </div>

      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Watch AI Models
            <span className="block text-muted-foreground">Debate</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Pick any topic. ChatGPT and Grok argue the sides. Claude moderates. You get real
            insights from real AI reasoning.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/debate/new">Start a Debate</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
