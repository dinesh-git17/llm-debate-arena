// src/lib/schemas/debate-schema.ts
import { z } from 'zod'

export const debateFormSchema = z.object({
  topic: z
    .string()
    .min(10, 'Topic must be at least 10 characters')
    .max(500, 'Topic cannot exceed 500 characters')
    .trim(),

  turns: z.number().int().min(2, 'Minimum 2 turns required').max(10, 'Maximum 10 turns allowed'),

  format: z.enum(['standard', 'oxford', 'lincoln-douglas']),

  customRules: z
    .array(
      z
        .string()
        .min(5, 'Rule must be at least 5 characters')
        .max(200, 'Rule cannot exceed 200 characters')
        .trim()
    )
    .max(5, 'Maximum 5 custom rules allowed'),
})

export type DebateFormValues = z.infer<typeof debateFormSchema>

export const defaultValues: DebateFormValues = {
  topic: '',
  turns: 4,
  format: 'standard',
  customRules: [],
}

export const turnOptions = [
  { value: 2, label: '2 turns', description: 'Quick debate — Opening + Closing only' },
  { value: 4, label: '4 turns', description: 'Standard — Opening, Argument, Closing' },
  { value: 6, label: '6 turns', description: 'Extended — Includes rebuttals' },
  { value: 8, label: '8 turns', description: 'Full — Complete debate format' },
  { value: 10, label: '10 turns', description: 'Comprehensive — Deep exploration' },
] as const

export const formatOptions = [
  { value: 'standard', label: 'Standard', description: 'Classic back-and-forth debate' },
  { value: 'oxford', label: 'Oxford', description: 'Formal parliamentary style' },
  { value: 'lincoln-douglas', label: 'Lincoln-Douglas', description: 'Value-focused one-on-one' },
] as const
