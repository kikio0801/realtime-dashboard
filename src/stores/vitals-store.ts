/**
 * Zustand store for real-time vital signs simulation
 * Manages live vital sign data with setInterval-based updates
 */

import { create } from 'zustand'
import { VitalSigns, VitalType, VitalSign } from '@/types/patient'
import {
  initializeAllVitals,
  generateVitalUpdate,
} from '@/features/dashboard/utils/vital-generation'
import { calculatePatientStatus } from '@/features/dashboard/utils/vital-thresholds'

interface VitalsState {
  // State
  patientVitals: Map<string, VitalSigns>
  isSimulating: boolean
  simulationInterval: number | null

  // Actions
  initializeVitals: (
    patientId: string,
    initialTrend?: 'normal' | 'warning' | 'critical'
  ) => void
  updateVitals: (patientId: string) => void
  startSimulation: (patientIds: string[]) => void
  stopSimulation: () => void
  clearVitals: () => void
  getPatientVitals: (patientId: string) => VitalSigns | undefined
}

/**
 * Maximum number of data points to keep in history (sliding window)
 */
const MAX_HISTORY_POINTS = 10

/**
 * Simulation update interval in milliseconds
 * 2500ms = 2.5 seconds
 */
const SIMULATION_INTERVAL = 2500

export const useVitalsStore = create<VitalsState>((set, get) => ({
  // Initial state
  patientVitals: new Map(),
  isSimulating: false,
  simulationInterval: null,

  /**
   * Initialize vital signs for a patient with historical data
   * Creates 10 data points spanning 5 minutes
   */
  initializeVitals: (patientId, initialTrend = 'normal') => {
    set((state) => {
      const newVitals = new Map(state.patientVitals)
      const vitals = initializeAllVitals(initialTrend)
      newVitals.set(patientId, vitals)
      return { patientVitals: newVitals }
    })
  },

  /**
   * Update vital signs for a single patient
   * Generates new values based on current trend and adds to history
   */
  updateVitals: (patientId) => {
    set((state) => {
      const newVitals = new Map(state.patientVitals)
      const currentVitals = newVitals.get(patientId)

      if (!currentVitals) {
        console.warn(`No vitals found for patient ${patientId}`)
        return state
      }

      // Calculate current patient status to determine trend
      // Map 'stable' to 'normal' for trend generation
      const currentStatus = calculatePatientStatus(currentVitals)
      const trendBias: 'normal' | 'warning' | 'critical' =
        currentStatus === 'stable' ? 'normal' : currentStatus

      // Update each vital type
      const vitalTypes: VitalType[] = [
        'heartRate',
        'systolic',
        'diastolic',
        'spo2',
        'temperature',
      ]

      const updatedVitals: VitalSigns = { ...currentVitals }

      vitalTypes.forEach((vitalType) => {
        const currentSigns = currentVitals[vitalType]
        const lastSign = currentSigns[currentSigns.length - 1]
        const lastValue = lastSign ? lastSign.value : 0

        // Generate new value
        const newValue = generateVitalUpdate(lastValue, vitalType, trendBias)

        // Create new sign
        const newSign: VitalSign = {
          timestamp: Date.now(),
          value: newValue,
        }

        // Add to history and trim to max length
        const updatedSigns = [...currentSigns, newSign]
        if (updatedSigns.length > MAX_HISTORY_POINTS) {
          updatedSigns.shift() // Remove oldest
        }

        updatedVitals[vitalType] = updatedSigns
      })

      newVitals.set(patientId, updatedVitals)
      return { patientVitals: newVitals }
    })
  },

  /**
   * Start real-time simulation for multiple patients
   * Updates all patients every SIMULATION_INTERVAL milliseconds
   */
  startSimulation: (patientIds) => {
    const { simulationInterval, stopSimulation } = get()

    // Stop existing simulation if any
    if (simulationInterval !== null) {
      stopSimulation()
    }

    // Initialize vitals for any patients that don't have them
    patientIds.forEach((patientId) => {
      const vitals = get().patientVitals.get(patientId)
      if (!vitals) {
        // All patients start with normal vitals (stable)
        get().initializeVitals(patientId, 'normal')
      }
    })

    // Start interval
    const interval = setInterval(() => {
      patientIds.forEach((patientId) => {
        get().updateVitals(patientId)
      })
    }, SIMULATION_INTERVAL)

    set({
      simulationInterval: interval as unknown as number,
      isSimulating: true,
    })
  },

  /**
   * Stop the simulation interval
   */
  stopSimulation: () => {
    const { simulationInterval } = get()

    if (simulationInterval !== null) {
      clearInterval(simulationInterval)
    }

    set({
      simulationInterval: null,
      isSimulating: false,
    })
  },

  /**
   * Clear all vital signs data (for reset/testing)
   */
  clearVitals: () => {
    set({
      patientVitals: new Map(),
    })
  },

  /**
   * Get vital signs for a specific patient
   */
  getPatientVitals: (patientId) => {
    return get().patientVitals.get(patientId)
  },
}))
