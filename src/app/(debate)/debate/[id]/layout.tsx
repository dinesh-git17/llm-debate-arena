// src/app/(debate)/debate/[id]/layout.tsx

interface DebateViewLayoutProps {
  children: React.ReactNode
}

/**
 * Minimal layout for active debate view.
 * Bypasses MainLayout to provide fullscreen, distraction-free experience.
 */
export default function DebateViewLayout({ children }: DebateViewLayoutProps) {
  return <>{children}</>
}
