// vitest.setup.ts
import { beforeEach, vi } from 'vitest'

// Mock environment variables for testing
beforeEach(() => {
  vi.stubEnv('SESSION_SECRET', 'test-secret-key-for-vitest-testing-32chars')
  vi.stubEnv('NODE_ENV', 'test')
})
