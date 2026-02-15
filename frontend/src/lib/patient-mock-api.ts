/**
 * Mock API for patient data management
 * Simulates backend API using localStorage
 * Follows the pattern established in mock-api.ts
 */

import { Patient } from '@/types/patient'

// Storage key for patient data
const PATIENTS_KEY = 'smart_pulse_patients'

/**
 * Get all patients from localStorage
 */
const getPatients = (): Patient[] => {
  try {
    const data = localStorage.getItem(PATIENTS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to parse patients from localStorage:', error)
    localStorage.removeItem(PATIENTS_KEY)
    return []
  }
}

/**
 * Save patients to localStorage
 */
const savePatients = (patients: Patient[]): void => {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
}

/**
 * Simulate API delay for realistic behavior
 */
const delay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate seed data for patients
 * Creates 5 patients with varying conditions
 * @param nurseKey - The nurse's key to assign patients to
 * @returns Array of patients assigned to the nurse
 */
export function seedPatients(nurseKey: string): Patient[] {
  const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
  const givenNames = [
    '민수',
    '서연',
    '지훈',
    '유진',
    '도윤',
    '서현',
    '예준',
    '지우',
    '하은',
    '우진',
  ]

  const diagnoses = [
    '급성 심근경색',
    '뇌경색',
    '폐렴',
    '패혈증',
    '당뇨병성 케톤산증',
    '급성 신부전',
  ]

  const now = new Date()

  // Generate 5 patients total
  const allPatients: Patient[] = Array.from({ length: 5 }, (_, i) => {
    const surname = surnames[i % surnames.length]
    const givenName = givenNames[i % givenNames.length]
    const name = `${surname}${givenName}`

    const bedFloor = 3 // ICU on 3rd floor
    const bedNumber = `${bedFloor}${String(i + 1).padStart(2, '0')}-${
      i % 2 === 0 ? 'A' : 'B'
    }`

    // All 5 patients assigned to logged-in nurse
    const isAssigned = true

    // Initial status: All 5 patients start as stable (안정 기본값)
    const status: Patient['status'] = 'stable'
    // All patients start stable, simulation will naturally create variety

    const admissionDate = new Date(
      now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
    )

    return {
      id: `patient-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      age: 45 + Math.floor(Math.random() * 35), // 45-80 years old
      bedNumber,
      assignedNurse: isAssigned ? nurseKey : `nurse-other-${Math.random()}`,
      status,
      admissionDate: admissionDate.toISOString(),
      diagnosis: diagnoses[i % diagnoses.length] ?? '미정',
      createdAt: now.toISOString(),
    }
  })

  // Load existing patients and merge with new ones (deduplicate by ID)
  const existingPatients = getPatients()
  const patientMap = new Map<string, Patient>()

  // Add existing patients first (preserve existing data)
  existingPatients.forEach((p) => patientMap.set(p.id, p))

  // Add/update with new patients
  allPatients.forEach((p) => patientMap.set(p.id, p))

  const mergedPatients = Array.from(patientMap.values())

  // Save merged patients to localStorage
  savePatients(mergedPatients)

  // Return only patients assigned to this nurse
  return mergedPatients.filter((p) => p.assignedNurse === nurseKey)
}

/**
 * Initialize patients if not already initialized
 * @param nurseKey - The nurse's key
 */
export function initializePatients(nurseKey: string): void {
  const existing = getPatients()

  // Check if there are already patients assigned to this nurse
  const nursePatients = existing.filter((p) => p.assignedNurse === nurseKey)

  if (nursePatients.length === 0) {
    // No patients exist for this nurse, seed new ones
    seedPatients(nurseKey)
  }
}

/**
 * Mock API: Get all patients
 */
export async function getAllPatients(): Promise<Patient[]> {
  await delay()
  return getPatients()
}

/**
 * Mock API: Get patient by ID
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  await delay()
  const patients = getPatients()
  return patients.find((p) => p.id === id) || null
}

/**
 * Mock API: Get patients assigned to a specific nurse
 */
export async function getPatientsByNurse(nurseKey: string): Promise<Patient[]> {
  await delay()
  const patients = getPatients()
  return patients.filter((p) => p.assignedNurse === nurseKey)
}

/**
 * Mock API: Update patient status
 */
export async function updatePatientStatus(
  id: string,
  status: Patient['status']
): Promise<Patient> {
  await delay()

  const patients = getPatients()
  const index = patients.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error('Patient not found')
  }

  const existingPatient = patients[index]
  if (!existingPatient) {
    throw new Error('Patient not found')
  }

  const updatedPatient: Patient = {
    ...existingPatient,
    status,
  }

  patients[index] = updatedPatient
  savePatients(patients)
  return updatedPatient
}

/**
 * Mock API: Delete patient (for testing)
 */
export async function deletePatient(id: string): Promise<void> {
  await delay()
  const patients = getPatients()
  const filtered = patients.filter((p) => p.id !== id)
  savePatients(filtered)
}

/**
 * Clear all patient data (for testing/reset)
 */
export function clearPatients(): void {
  localStorage.removeItem(PATIENTS_KEY)
}
