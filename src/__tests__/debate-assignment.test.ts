// src/__tests__/debate-assignment.test.ts
import { describe, expect, it } from 'vitest'

import {
  generateDebateAssignment,
  getPositionForProvider,
  getProviderForPosition,
} from '@/lib/debate-assignment'

import type { DebateAssignment } from '@/types/debate'

describe('debate-assignment', () => {
  describe('generateDebateAssignment', () => {
    it('should return valid assignment with both positions filled', () => {
      const assignment = generateDebateAssignment()
      expect(assignment.forPosition).toBeDefined()
      expect(assignment.againstPosition).toBeDefined()
    })

    it('should only assign chatgpt or grok', () => {
      for (let i = 0; i < 100; i++) {
        const assignment = generateDebateAssignment()
        expect(['chatgpt', 'grok']).toContain(assignment.forPosition)
        expect(['chatgpt', 'grok']).toContain(assignment.againstPosition)
      }
    })

    it('should assign different providers to each position', () => {
      for (let i = 0; i < 100; i++) {
        const assignment = generateDebateAssignment()
        expect(assignment.forPosition).not.toBe(assignment.againstPosition)
      }
    })

    it('should produce roughly 50/50 distribution over many trials', () => {
      let chatgptForCount = 0
      const trials = 1000

      for (let i = 0; i < trials; i++) {
        const assignment = generateDebateAssignment()
        if (assignment.forPosition === 'chatgpt') {
          chatgptForCount++
        }
      }

      const ratio = chatgptForCount / trials
      // Allow 10% variance from 50%
      expect(ratio).toBeGreaterThan(0.4)
      expect(ratio).toBeLessThan(0.6)
    })
  })

  describe('getProviderForPosition', () => {
    it('should return correct provider for FOR position', () => {
      const assignment: DebateAssignment = {
        forPosition: 'chatgpt',
        againstPosition: 'grok',
      }
      expect(getProviderForPosition(assignment, 'for')).toBe('chatgpt')
    })

    it('should return correct provider for AGAINST position', () => {
      const assignment: DebateAssignment = {
        forPosition: 'chatgpt',
        againstPosition: 'grok',
      }
      expect(getProviderForPosition(assignment, 'against')).toBe('grok')
    })

    it('should work with reversed assignment', () => {
      const assignment: DebateAssignment = {
        forPosition: 'grok',
        againstPosition: 'chatgpt',
      }
      expect(getProviderForPosition(assignment, 'for')).toBe('grok')
      expect(getProviderForPosition(assignment, 'against')).toBe('chatgpt')
    })
  })

  describe('getPositionForProvider', () => {
    it('should return FOR when provider is in forPosition', () => {
      const assignment: DebateAssignment = {
        forPosition: 'chatgpt',
        againstPosition: 'grok',
      }
      expect(getPositionForProvider(assignment, 'chatgpt')).toBe('for')
    })

    it('should return AGAINST when provider is in againstPosition', () => {
      const assignment: DebateAssignment = {
        forPosition: 'chatgpt',
        againstPosition: 'grok',
      }
      expect(getPositionForProvider(assignment, 'grok')).toBe('against')
    })

    it('should work with reversed assignment', () => {
      const assignment: DebateAssignment = {
        forPosition: 'grok',
        againstPosition: 'chatgpt',
      }
      expect(getPositionForProvider(assignment, 'grok')).toBe('for')
      expect(getPositionForProvider(assignment, 'chatgpt')).toBe('against')
    })
  })
})
