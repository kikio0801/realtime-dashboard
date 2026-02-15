/**
 * Real API for patient data management
 * Replaces mock-api logic with actual FastAPI backend calls
 */

import { Patient } from '@/types/patient'
import { apiGet, apiPatch, ApiError } from './api-client'

/**
 * Simulate API delay for realistic behavior (kept for consistency)
 */
const delay = (ms: number = 100): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get all patients from backend
 */
export async function getAllPatients(): Promise<Patient[]> {
  await delay()
  const patients = await apiGet<Patient[]>('/patients')
  return patients || []
}

/**
 * Get patient by ID from backend
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  await delay()
  try {
    return await apiGet<Patient>(`/patients/${id}`)
  } catch (error) {
    console.error('Failed to fetch patient:', error)
    // Return null for 404 (patient not found), rethrow other errors
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Get patients assigned to a specific nurse from backend
 */
export async function getPatientsByNurse(nurseKey: string): Promise<Patient[]> {
  await delay()
  const patients = await apiGet<Patient[]>(`/nurses/${nurseKey}/patients`)
  return patients || []
}

/**
 * Update patient status on backend
 */
export async function updatePatientStatus(
  id: string,
  status: Patient['status']
): Promise<Patient> {
  await delay()
  const updated = await apiPatch<Patient>(`/patients/${id}/status`, { status })
  if (!updated) {
    throw new Error('Failed to update patient: No data returned')
  }
  return updated
}
