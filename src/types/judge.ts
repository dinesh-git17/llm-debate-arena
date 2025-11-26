// src/types/judge.ts

import type { TurnSpeaker } from './turn'

/**
 * Scoring rubric categories for debate evaluation
 */
export type ScoringCategory =
  | 'argument_quality'
  | 'evidence_support'
  | 'rebuttal_effectiveness'
  | 'clarity_presentation'
  | 'rule_adherence'

/**
 * Score for a single evaluation category
 */
export interface CategoryScore {
  category: ScoringCategory
  label: string
  score: number
  maxScore: number
  percentage: number
  feedback: string
}

/**
 * Complete scores and analysis for one debate participant
 */
export interface ParticipantScores {
  speaker: TurnSpeaker
  label: string
  model?: string
  totalScore: number
  maxPossibleScore: number
  percentage: number
  categoryScores: CategoryScore[]
  strengths: string[]
  weaknesses: string[]
  standoutMoments: string[]
}

/**
 * A key point of clash where debaters directly engaged
 */
export interface ClashPoint {
  topic: string
  description: string
  forArgument: string
  againstArgument: string
  analysis: string
  advantageNote?: string
}

/**
 * Overall debate quality rating
 */
export type DebateQualityRating = 'excellent' | 'good' | 'fair' | 'developing'

/**
 * Complete judge analysis for a debate
 */
export interface JudgeAnalysis {
  debateId: string
  generatedAt: Date

  overviewSummary: string
  debateQuality: DebateQualityRating
  debateQualityExplanation: string

  forAnalysis: ParticipantScores
  againstAnalysis: ParticipantScores

  keyClashPoints: ClashPoint[]
  turningMoments: string[]
  missedOpportunities: string[]

  whatWorkedWell: string[]
  areasForImprovement: string[]
  lessonsForDebaters: string[]

  judgeNotes: string
  disclaimer: string
}

/**
 * Scoring rubric configuration for a category
 */
export interface ScoringRubric {
  category: ScoringCategory
  label: string
  maxScore: number
  weight: number
  criteria: string[]
}

/**
 * Request parameters for judge analysis
 */
export interface JudgeAnalysisRequest {
  debateId: string
  includeScoring: boolean
  includeClashAnalysis: boolean
  includeEducationalInsights: boolean
}

/**
 * Response from judge analysis API
 */
export interface JudgeAnalysisResponse {
  success: boolean
  analysis?: JudgeAnalysis
  error?: string
  cached: boolean
  generationTimeMs?: number
}

/**
 * Serialized judge analysis for storage (dates as ISO strings)
 */
export interface SerializedJudgeAnalysis {
  debateId: string
  generatedAt: string

  overviewSummary: string
  debateQuality: DebateQualityRating
  debateQualityExplanation: string

  forAnalysis: ParticipantScores
  againstAnalysis: ParticipantScores

  keyClashPoints: ClashPoint[]
  turningMoments: string[]
  missedOpportunities: string[]

  whatWorkedWell: string[]
  areasForImprovement: string[]
  lessonsForDebaters: string[]

  judgeNotes: string
  disclaimer: string
}

/**
 * Raw parsed response from Claude judge
 */
export interface ParsedJudgeResponse {
  overviewSummary: string
  debateQuality: string
  debateQualityExplanation: string

  forAnalysis: {
    totalScore: number
    categoryScores: {
      category: string
      score: number
      feedback: string
    }[]
    strengths: string[]
    weaknesses: string[]
    standoutMoments: string[]
  }

  againstAnalysis: {
    totalScore: number
    categoryScores: {
      category: string
      score: number
      feedback: string
    }[]
    strengths: string[]
    weaknesses: string[]
    standoutMoments: string[]
  }

  keyClashPoints: {
    topic: string
    description: string
    forArgument: string
    againstArgument: string
    analysis: string
    advantageNote?: string
  }[]

  turningMoments: string[]
  missedOpportunities: string[]

  whatWorkedWell: string[]
  areasForImprovement: string[]
  lessonsForDebaters: string[]

  judgeNotes: string
}
