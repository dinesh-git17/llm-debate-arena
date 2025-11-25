// src/app/(marketing)/page.tsx
import { CtaBanner } from '@/components/features/cta-banner'
import { FeaturesGrid } from '@/components/features/features-grid'
import { HeroSection } from '@/components/features/hero-section'
import { HowItWorksPreview } from '@/components/features/how-it-works-preview'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksPreview />
      <FeaturesGrid />
      <CtaBanner />
    </>
  )
}
