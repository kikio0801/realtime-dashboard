/**
 * React Query hooks for patient data management
 * Merges static patient data (localStorage) with live vitals (Zustand)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPatientsByNurse,
  getPatientById,
  getAllPatients,
  updatePatientStatus,
} from '@/lib/patient-mock-api'
import { useVitalsStore } from '@/stores/vitals-store'
import { Patient, PatientWithVitals, VitalSigns } from '@/types/patient'

/**
 * Query keys factory for type-safe cache management
 * Follows the pattern established in use-users.ts
 */
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  byNurse: (nurseKey: string) => [...patientKeys.lists(), nurseKey] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
}

/**
 * Create empty vitals structure
 */
function createEmptyVitals(): VitalSigns {
  return {
    heartRate: [],
    systolic: [],
    diastolic: [],
    spo2: [],
    temperature: [],
  }
}

/**
 * Hook to fetch all patients assigned to a specific nurse
 * Merges patient base data with live vitals from Zustand store
 *
 * @param nurseKey - The nurse's key from QR authentication
 * @returns Query result with patients including vitals
 */
export function useNursePatients(nurseKey: string) {
  return useQuery({
    queryKey: patientKeys.byNurse(nurseKey),
    queryFn: async (): Promise<PatientWithVitals[]> => {
      const patients = await getPatientsByNurse(nurseKey)

      // Read vitals inside queryFn to get fresh state on each refetch
      const patientVitals = useVitalsStore.getState().patientVitals

      // Merge with live vitals from Zustand store
      return patients.map((patient) => ({
        ...patient,
        vitals: patientVitals.get(patient.id) || createEmptyVitals(),
        lastUpdated: Date.now(),
      }))
    },
    enabled: !!nurseKey, // Only run if nurseKey exists
    staleTime: Infinity, // Patient base data doesn't change
    refetchInterval: 2600, // Slightly longer than simulation interval (2.5s)
    // This ensures UI updates with new vitals
  })
}

/**
 * Hook to fetch a single patient by ID
 * Includes live vitals from Zustand store
 *
 * @param id - Patient ID
 * @returns Query result with patient including vitals
 */
export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async (): Promise<PatientWithVitals> => {
      const patient = await getPatientById(id)

      if (!patient) {
        throw new Error('Patient not found')
      }

      // Read vitals inside queryFn to get fresh state on each refetch
      const patientVitals = useVitalsStore.getState().patientVitals

      return {
        ...patient,
        vitals: patientVitals.get(id) || createEmptyVitals(),
        lastUpdated: Date.now(),
      }
    },
    enabled: !!id,
    staleTime: Infinity,
    refetchInterval: 2600,
  })
}

/**
 * Hook to fetch all patients (for admin views)
 * Includes live vitals from Zustand store
 *
 * @returns Query result with all patients including vitals
 */
export function useAllPatients() {
  return useQuery({
    queryKey: patientKeys.lists(),
    queryFn: async (): Promise<PatientWithVitals[]> => {
      const patients = await getAllPatients()

      // Read vitals inside queryFn to get fresh state on each refetch
      const patientVitals = useVitalsStore.getState().patientVitals

      return patients.map((patient) => ({
        ...patient,
        vitals: patientVitals.get(patient.id) || createEmptyVitals(),
        lastUpdated: Date.now(),
      }))
    },
    staleTime: Infinity,
    refetchInterval: 2600,
  })
}

/**
 * Mutation hook to update patient status
 * Invalidates related queries to trigger refetch
 *
 * @returns Mutation object
 */
export function useUpdatePatientStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Patient['status'] }) =>
      updatePatientStatus(id, status),
    onSuccess: (_, { id }) => {
      // Invalidate patient detail query
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) })
      // Invalidate all list queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}
