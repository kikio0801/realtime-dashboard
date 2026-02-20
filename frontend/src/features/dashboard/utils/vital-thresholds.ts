/**
 * Vital sign thresholds and status calculation utilities
 * Defines medical thresholds for determining patient status
 */

import {
  VitalSigns,
  VitalSign,
  PatientStatus,
  VitalType,
  VitalThreshold,
} from '@/types/patient'

/**
 * Medical thresholds for each vital sign
 * Based on standard clinical guidelines
 */
export const THRESHOLDS: Record<VitalType, VitalThreshold> = {
  heartRate: {
    normal: [60, 100], // 60-100 BPM
    warning: [50, 120], // 50-60 or 100-120 BPM
    critical: [0, 200], // <50 or >120 BPM
  },
  systolic: {
    normal: [90, 140], // 90-140 mmHg
    warning: [80, 160], // 80-90 or 140-160 mmHg
    critical: [0, 300], // <80 or >160 mmHg
  },
  diastolic: {
    normal: [60, 90], // 60-90 mmHg
    warning: [50, 100], // 50-60 or 90-100 mmHg
    critical: [0, 200], // <50 or >100 mmHg
  },
  spo2: {
    normal: [95, 100], // 95-100%
    warning: [90, 95], // 90-95%
    critical: [0, 90], // <90%
  },
  temperature: {
    normal: [36.0, 37.5], // 36.0-37.5°C
    warning: [35.5, 38.5], // 35.5-36.0 or 37.5-38.5°C
    critical: [0, 50], // <35.5 or >38.5°C
  },
}

/**
 * Determine status for a single vital sign value
 * @param value - Current vital sign value
 * @param vitalType - Type of vital sign
 * @returns Patient status based on the value
 */
export function getVitalStatus(
  value: number,
  vitalType: VitalType
): PatientStatus {
  const threshold = THRESHOLDS[vitalType]

  // Check if value is in normal range
  if (value >= threshold.normal[0] && value <= threshold.normal[1]) {
    return 'stable'
  }

  // Check if value is in warning range
  if (value >= threshold.warning[0] && value <= threshold.warning[1]) {
    return 'warning'
  }

  // Otherwise it's critical
  return 'critical'
}

/**
 * Calculate overall patient status from all vital signs
 * Returns the worst status among all vitals (critical > warning > stable)
 * @param vitals - All vital signs for a patient
 * @returns Overall patient status
 */
export function calculatePatientStatus(vitals: VitalSigns): PatientStatus {
  // Helper to get current value, returns null if no data
  const getCurrentValue = (signs: VitalSign[]): number | null => {
    if (signs.length === 0) return null
    const lastSign = signs[signs.length - 1]
    return lastSign ? lastSign.value : null
  }

  // Get all current values
  const values = {
    heartRate: getCurrentValue(vitals.heartRate),
    systolic: getCurrentValue(vitals.systolic),
    diastolic: getCurrentValue(vitals.diastolic),
    spo2: getCurrentValue(vitals.spo2),
    temperature: getCurrentValue(vitals.temperature),
  }

  // If no vital data exists yet, return stable (default)
  const hasAnyData = Object.values(values).some((v) => v !== null)
  if (!hasAnyData) return 'stable'

  // Calculate status for each vital that has data
  const statuses: PatientStatus[] = []
  if (values.heartRate !== null)
    statuses.push(getVitalStatus(values.heartRate, 'heartRate'))
  if (values.systolic !== null)
    statuses.push(getVitalStatus(values.systolic, 'systolic'))
  if (values.diastolic !== null)
    statuses.push(getVitalStatus(values.diastolic, 'diastolic'))
  if (values.spo2 !== null) statuses.push(getVitalStatus(values.spo2, 'spo2'))
  if (values.temperature !== null)
    statuses.push(getVitalStatus(values.temperature, 'temperature'))

  // Return worst status (priority: critical > warning > stable)
  if (statuses.includes('critical')) return 'critical'
  if (statuses.includes('warning')) return 'warning'
  return 'stable'
}

/**
 * UI color classes for each status
 * Used for styling patient cards and badges
 */
export const STATUS_COLORS = {
  stable: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    ring: 'ring-green-200',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    ring: 'ring-yellow-200',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    ring: 'ring-red-200',
  },
} as const

/**
 * Get the latest vital sign value
 * @param signs - Array of vital signs
 * @returns Latest value or 0 if empty
 */
export function getLatestValue(signs: VitalSign[]): number {
  if (signs.length === 0) return 0
  const lastSign = signs[signs.length - 1]
  return lastSign ? lastSign.value : 0
}

/**
 * Get formatted label for vital type
 * @param vitalType - Type of vital sign
 * @returns Korean label
 */
export function getVitalLabel(vitalType: VitalType): string {
  const labels: Record<VitalType, string> = {
    heartRate: '심박수',
    systolic: '수축기 혈압',
    diastolic: '이완기 혈압',
    spo2: '산소포화도',
    temperature: '체온',
  }
  return labels[vitalType]
}

/**
 * Get unit for vital type
 * @param vitalType - Type of vital sign
 * @returns Unit string
 */
export function getVitalUnit(vitalType: VitalType): string {
  const units: Record<VitalType, string> = {
    heartRate: 'BPM',
    systolic: 'mmHg',
    diastolic: 'mmHg',
    spo2: '%',
    temperature: '°C',
  }
  return units[vitalType]
}
