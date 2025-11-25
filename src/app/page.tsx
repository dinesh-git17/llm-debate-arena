// src/app/page.tsx

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">LLM Debate Arena</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Watch AI models debate topics while Claude moderates the discussion. Coming soon.
        </p>
      </div>
    </main>
  )
}
