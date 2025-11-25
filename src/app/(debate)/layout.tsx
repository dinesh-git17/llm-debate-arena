// src/app/(debate)/layout.tsx
import { MainLayout } from '@/components/layouts/main-layout'

interface DebateLayoutProps {
  children: React.ReactNode
}

export default function DebateLayout({ children }: DebateLayoutProps) {
  return <MainLayout>{children}</MainLayout>
}
