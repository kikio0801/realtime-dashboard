/**
 * Patient monitoring system type definitions
 * Defines interfaces for patient data and vital signs
 */

export type PatientStatus = 'stable' | 'warning' | 'critical'

/**
 * Single vital sign reading with timestamp
 */
export interface VitalSign {
  timestamp: number // Unix timestamp in milliseconds
  value: number // Measured value
}

/**
 * Collection of all vital signs for a patient
 * Each vital maintains a sliding window of recent readings (max 10)
 */
export interface VitalSigns {
  heartRate: VitalSign[] // 심박수 (BPM)
  systolic: VitalSign[] // 수축기 혈압 (mmHg)
  diastolic: VitalSign[] // 이완기 혈압 (mmHg)
  spo2: VitalSign[] // 산소포화도 (%)
  temperature: VitalSign[] // 체온 (°C)
}

/**
 * Patient base information stored in localStorage
 */
export interface Patient {
  id: string // UUID
  name: string // 환자명
  age: number // 나이
  bedNumber: string // 병상 번호 (e.g., "301-A")
  assignedNurse: string // 담당 간호사 (matches user.key from QR auth)
  status: PatientStatus // 현재 상태 (calculated dynamically from vitals)
  admissionDate: string // 입원일 (ISO string)
  diagnosis: string // 진단명
  createdAt: string // 생성일시 (ISO string)
}

/**
 * Patient with real-time vital signs
 * Combines base patient data with live vitals from Zustand store
 */
export interface PatientWithVitals extends Patient {
  vitals: VitalSigns // 실시간 바이탈 사인
  lastUpdated: number // 마지막 업데이트 시간 (Unix timestamp)
}

/**
 * Vital sign type keys for type-safe operations
 */
export type VitalType = keyof VitalSigns

/**
 * Helper type for vital sign thresholds
 */
export interface VitalThreshold {
  normal: [number, number] // [min, max] for normal range
  warning: [number, number] // [min, max] for warning range
  critical: [number, number] // [min, max] for critical range
}
