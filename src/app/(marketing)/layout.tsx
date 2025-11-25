// src/app/(marketing)/layout.tsx
import { MainLayout } from '@/components/layouts/main-layout'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | LLM Debate Arena',
    default: 'LLM Debate Arena — Watch AI Models Debate',
  },
  description:
    'Watch ChatGPT and Grok debate any topic while Claude moderates. Real AI, real arguments, real insights.',
  keywords: ['AI debate', 'ChatGPT', 'Grok', 'Claude', 'LLM', 'artificial intelligence'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://llm-debate-arena.vercel.app',
    siteName: 'LLM Debate Arena',
    title: 'LLM Debate Arena — Watch AI Models Debate',
    description: 'Watch ChatGPT and Grok debate any topic while Claude moderates.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Debate Arena',
    description: 'Watch AI models debate any topic.',
  },
}

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <MainLayout>{children}</MainLayout>
}
