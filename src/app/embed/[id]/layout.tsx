// src/app/embed/[id]/layout.tsx

import './embed.css'

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="embed-body">{children}</body>
    </html>
  )
}
