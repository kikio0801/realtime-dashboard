/**
 * Vital sign generation utilities for realistic simulation
 * Uses statistical methods to generate clinically plausible data
 */

import { VitalSign, VitalType } from '@/types/patient'

/**
 * Normal ranges and statistical parameters for each vital type
 * mean: target value, stdDev: standard deviation for variation
 */
export const VITAL_RANGES = {
  heartRate: { mean: 75, stdDev: 8, min: 45, max: 150 },
  systolic: { mean: 120, stdDev: 10, min: 80, max: 180 },
  diastolic: { mean: 80, stdDev: 8, min: 50, max: 110 },
  spo2: { mean: 98, stdDev: 1.5, min: 85, max: 100 },
  temperature: { mean: 36.8, stdDev: 0.3, min: 35.0, max: 40.0 },
} as const

/**
 * Generate a random number using Box-Muller transform for Gaussian distribution
 * @param mean - Target mean value
 * @param stdDev - Standard deviation
 * @returns Random value following normal distribution
 */
export function gaussianRandom(mean: number, stdDev: number): number {
  // Box-Muller transform
  // Ensure u1 > 0 to avoid Math.log(0) = -Infinity
  let u1 = Math.random()
  while (u1 === 0) {
    u1 = Math.random()
  }
  const u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return z0 * stdDev + mean
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Generate initial baseline value for a vital sign
 * @param vitalType - Type of vital sign
 * @param trend - Initial trend (normal, warning, or critical)
 * @returns Initial value
 */
export function generateBaselineValue(
  vitalType: VitalType,
  trend: 'normal' | 'warning' | 'critical' = 'normal'
): number {
  const range = VITAL_RANGES[vitalType]
  let value: number

  switch (trend) {
    case 'normal':
      value = gaussianRandom(range.mean, range.stdDev)
      break
    case 'warning': {
      // Shift toward edge of normal range
      const warningMean =
        Math.random() > 0.5 ? range.mean * 1.15 : range.mean * 0.9
      value = gaussianRandom(warningMean, range.stdDev * 1.2)
      break
    }
    case 'critical': {
      // Shift to abnormal range
      const criticalMean =
        Math.random() > 0.5 ? range.mean * 1.3 : range.mean * 0.8
      value = gaussianRandom(criticalMean, range.stdDev * 1.5)
      break
    }
  }

  return clamp(value, range.min, range.max)
}

/**
 * Generate next vital sign value based on current value
 * Includes random walk with drift and occasional jumps
 * @param currentValue - Current vital sign value
 * @param vitalType - Type of vital sign
 * @param trendBias - Bias direction for simulation
 * @returns Next value
 */
export function generateVitalUpdate(
  currentValue: number,
  vitalType: VitalType,
  trendBias: 'normal' | 'warning' | 'critical' = 'normal'
): number {
  const range = VITAL_RANGES[vitalType]

  // Base variation (±1.5% of current value - reduced for stability)
  const variation = currentValue * 0.015 * (Math.random() * 2 - 1)

  // Drift toward target based on trend
  let drift = 0
  const driftStrength = 0.08 // 8% drift per update (increased for stronger mean reversion)

  switch (trendBias) {
    case 'normal':
      // Strong drift toward mean (keeps stable patients stable)
      drift = (range.mean - currentValue) * driftStrength * 1.5
      break
    case 'warning':
      // Drift toward warning zone (5% chance to worsen, reduced from 10%)
      if (Math.random() < 0.05) {
        const warningTarget =
          Math.random() > 0.5 ? range.mean * 1.12 : range.mean * 0.92
        drift = (warningTarget - currentValue) * driftStrength
      } else {
        // Higher chance to recover toward normal
        drift = (range.mean - currentValue) * driftStrength * 0.8
      }
      break
    case 'critical':
      // Drift toward critical zone (8% chance to worsen further, reduced from 15%)
      if (Math.random() < 0.08) {
        const criticalTarget =
          Math.random() > 0.5 ? range.max * 0.85 : range.min * 1.15
        drift = (criticalTarget - currentValue) * driftStrength * 1.5
      } else {
        // Moderate recovery toward mean
        drift = (range.mean - currentValue) * driftStrength * 0.5
      }
      break
  }

  const nextValue = currentValue + variation + drift

  return clamp(nextValue, range.min, range.max)
}

/**
 * Generate a history of vital signs (for initialization)
 * @param vitalType - Type of vital sign
 * @param count - Number of historical points to generate
 * @param intervalMs - Time interval between points in milliseconds
 * @param trend - Initial trend
 * @returns Array of vital signs
 */
export function generateVitalHistory(
  vitalType: VitalType,
  count: number = 10,
  intervalMs: number = 30000, // 30 seconds
  trend: 'normal' | 'warning' | 'critical' = 'normal'
): VitalSign[] {
  const history: VitalSign[] = []
  const now = Date.now()

  let currentValue = generateBaselineValue(vitalType, trend)

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i - 1) * intervalMs
    history.push({ timestamp, value: currentValue })

    // Generate next value for continuity
    if (i < count - 1) {
      currentValue = generateVitalUpdate(currentValue, vitalType, trend)
    }
  }

  return history
}

/**
 * Initialize all vitals for a patient
 * @param patientTrend - Overall patient condition
 * @returns Object with all vital signs initialized
 */
export function initializeAllVitals(
  patientTrend: 'normal' | 'warning' | 'critical' = 'normal'
) {
  return {
    heartRate: generateVitalHistory('heartRate', 10, 30000, patientTrend),
    systolic: generateVitalHistory('systolic', 10, 30000, patientTrend),
    diastolic: generateVitalHistory('diastolic', 10, 30000, patientTrend),
    spo2: generateVitalHistory('spo2', 10, 30000, patientTrend),
    temperature: generateVitalHistory('temperature', 10, 30000, patientTrend),
  }
}
