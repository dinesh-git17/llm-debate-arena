// src/app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'

import type { Metadata } from 'next'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'LLM Debate Arena',
    template: '%s | LLM Debate Arena',
  },
  description: 'Watch AI models debate topics while Claude moderates the discussion',
  keywords: ['AI', 'debate', 'LLM', 'ChatGPT', 'Claude', 'Grok'],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
