import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.clearAllMocks()
})

// Mock console methods to reduce test noise
globalThis.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
} as Console
