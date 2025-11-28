// src/components/layouts/footer.tsx
'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Soft panel background - dark blue-black gradient */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.3) 0%,
              rgba(10,12,20,0.95) 100%
            )
          `,
        }}
      />

      {/* Frosted top edge separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent 5%, rgba(255,255,255,0.05) 50%, transparent 95%)',
        }}
      />

      {/*
        Apple Vision Pro ambient lighting:
        NO discrete radials - they always form visible circles.
        Instead: layered linear gradients that create brightness zones
        through color temperature shifts, not opacity blobs.
      */}

      {/* Layer 1: Horizontal brightness band - creates the "lit" feeling without circles */}
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none"
        style={{
          background: `
            linear-gradient(
              180deg,
              transparent 0%,
              rgba(140,150,200,0.012) 25%,
              rgba(150,160,210,0.015) 40%,
              rgba(140,150,200,0.01) 55%,
              transparent 75%,
              rgba(0,0,0,0.08) 100%
            )
          `,
        }}
      />

      {/* Layer 2: Asymmetric diagonal warmth - breaks up uniformity */}
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              transparent 0%,
              transparent 30%,
              rgba(160,170,220,0.008) 50%,
              rgba(150,160,210,0.006) 65%,
              transparent 80%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Layer 3: Counter-diagonal cool shift - adds depth */}
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none"
        style={{
          background: `
            linear-gradient(
              225deg,
              transparent 0%,
              transparent 40%,
              rgba(170,180,230,0.006) 55%,
              rgba(160,170,220,0.004) 70%,
              transparent 85%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Layer 4: Soft top-to-bottom panel gradient - grounds the section */}
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(180,190,240,0.006) 0%,
              transparent 15%,
              transparent 85%,
              rgba(0,0,0,0.12) 100%
            )
          `,
        }}
      />

      {/* Layer 5: Very subtle edge darkening - no circular vignette */}
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.06) 100%),
            linear-gradient(to bottom, transparent 0%, transparent 90%, rgba(0,0,0,0.1) 100%)
          `,
        }}
      />

      {/* Noise texture - 1.5% opacity, hides any banding */}
      <div
        className="absolute inset-0 dark:block hidden pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Content */}
      <Container className="relative z-10">
        <div className="py-12 md:py-16">
          {/* CTA Section */}
          <div className="text-center mb-10 md:mb-12">
            <p className="text-muted-foreground/60 text-sm mb-4">Experience AI-powered discourse</p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(
                'group/cta h-11 md:h-12 rounded-full px-7 md:px-8',
                // Ghost button styling - matching nav/hero
                'border-border/50 dark:border-white/[0.08]',
                'bg-transparent',
                'text-foreground/70 dark:text-white/70',
                // Hover effects
                'transition-all duration-500 ease-out',
                'hover:-translate-y-[1px]',
                'hover:border-border dark:hover:border-white/[0.15]',
                'hover:bg-muted/20 dark:hover:bg-white/[0.03]',
                'hover:text-foreground dark:hover:text-white/90',
                'hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_2px_16px_rgba(255,255,255,0.03)]',
                'active:translate-y-0 active:duration-150'
              )}
            >
              <Link href="/debate/new" className="flex items-center gap-2">
                Start a Debate
                <span
                  className={cn(
                    'inline-block transition-transform duration-500 ease-out',
                    'group-hover/cta:translate-x-0.5'
                  )}
                >
                  →
                </span>
              </Link>
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm text-muted-foreground/50',
                  'transition-colors duration-300',
                  'hover:text-muted-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs font-light text-muted-foreground/40 tracking-wide">
              &copy; {currentYear} Debate Lab. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
