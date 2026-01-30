/**
 * Patient Monitoring Dashboard
 * Real-time vital signs monitoring for assigned patients
 */

import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@/hooks/use-user'
import { useNursePatients } from '@/hooks/use-patients'
import { useVitalsStore } from '@/stores/vitals-store'
import { PatientCard } from '@/features/dashboard/components/patient-card'
import { PatientDetailDialog } from '@/features/dashboard/components/patient-detail-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Users,
  QrCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { initializePatients } from '@/lib/patient-mock-api'
import { calculatePatientStatus } from '@/features/dashboard/utils/vital-thresholds'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

/**
 * Stats Item Component (horizontal layout for single-line display)
 */
function StatsItem({
  title,
  value,
  icon,
  color = 'text-primary',
  bgColor = 'bg-slate-100',
}: {
  title: string
  value: number
  icon: React.ReactNode
  color?: string
  bgColor?: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-4">
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl shadow-sm',
          bgColor
        )}
      >
        <div className={color}>{icon}</div>
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <p className="text-muted-foreground mt-0.5 text-xs font-medium">
          {title}
        </p>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { user } = useUser()
  // Store patient ID instead of full object to enable real-time updates
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  )
  const [isInitialized, setIsInitialized] = useState(false)

  const { startSimulation, stopSimulation, initializeVitals } = useVitalsStore()

  // Initialize mock patients once
  useEffect(() => {
    if (user && !isInitialized) {
      initializePatients(user.key)
      setIsInitialized(true)
    }
  }, [user, isInitialized])

  // Fetch nurse's patients
  const { data: patients, isLoading } = useNursePatients(user?.key ?? '')

  // Initialize and start vital sign simulation
  // Note: isSimulating is intentionally excluded from deps to prevent cleanup
  // from firing when simulation starts (which would immediately stop it)
  useEffect(() => {
    if (!patients || patients.length === 0) return

    // Check current state directly to avoid stale closure issues
    const currentlySimulating = useVitalsStore.getState().isSimulating
    if (!currentlySimulating) {
      // Initialize vitals for each patient
      patients.forEach((p) => {
        // Determine initial trend based on first patient being critical
        let trend: 'normal' | 'warning' | 'critical' = 'normal'
        if (p.status === 'critical') trend = 'critical'
        else if (p.status === 'warning') trend = 'warning'

        initializeVitals(p.id, trend)
      })

      // Start simulation
      startSimulation(patients.map((p) => p.id))
    }

    return () => {
      // Cleanup: stop simulation when leaving page
      stopSimulation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients])

  // Sort patients: critical first, then warning, then stable
  const sortedPatients = patients
    ? [...patients]
        .map((p) => ({ ...p, status: calculatePatientStatus(p.vitals) }))
        .sort((a, b) => {
          const priority = { critical: 0, warning: 1, stable: 2 }
          return priority[a.status] - priority[b.status]
        })
    : []

  // Show auth required message if not authenticated
  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-slate-100 p-4">
          <QrCode className="h-12 w-12 text-slate-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">인증이 필요합니다</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            QR 코드를 통해 인증해 주세요
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (sortedPatients.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Activity className="text-muted-foreground h-12 w-12" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">담당 환자 없음</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            현재 담당하고 있는 환자가 없습니다.
          </p>
        </div>
      </div>
    )
  }

  const criticalCount = sortedPatients.filter(
    (p) => p.status === 'critical'
  ).length
  const warningCount = sortedPatients.filter(
    (p) => p.status === 'warning'
  ).length
  const stableCount = sortedPatients.length - criticalCount - warningCount

  // Get selected patient from live data (enables real-time updates in dialog)
  const selectedPatient = selectedPatientId
    ? (sortedPatients.find((p) => p.id === selectedPatientId) ?? null)
    : null

  return (
    <div className="space-y-6">
      {/* Header - Enhanced */}
      <div className="animate-fade-in">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-linear-to-b from-blue-500 to-blue-600" />
          <h1 className="bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            환자 모니터링
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 ml-4 border-l-2 border-slate-200 pl-3">
          {user.name} 의료진님의 담당 환자 · 실시간 모니터링
        </p>
      </div>

      {/* Stats Overview - Horizontal Single Line */}
      <Card className="animate-fade-in-delay-1 overflow-hidden">
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-base font-semibold">환자 현황</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <div className="flex items-center justify-around divide-x">
            <StatsItem
              title="총 환자"
              value={sortedPatients.length}
              icon={<Users className="h-5 w-5" />}
              bgColor="bg-slate-100"
            />
            <StatsItem
              title="위급"
              value={criticalCount}
              icon={<AlertCircle className="h-5 w-5" />}
              color="text-red-500"
              bgColor="bg-red-50"
            />
            <StatsItem
              title="주의"
              value={warningCount}
              icon={<AlertTriangle className="h-5 w-5" />}
              color="text-yellow-500"
              bgColor="bg-yellow-50"
            />
            <StatsItem
              title="안정"
              value={stableCount}
              icon={<Activity className="h-5 w-5" />}
              color="text-green-500"
              bgColor="bg-green-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Cards Grid */}
      <div className="animate-fade-in-delay-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onClick={() => setSelectedPatientId(patient.id)}
          />
        ))}
      </div>

      {/* Patient Detail Dialog */}
      <PatientDetailDialog
        patient={selectedPatient}
        open={!!selectedPatient}
        onOpenChange={(open) => !open && setSelectedPatientId(null)}
      />
    </div>
  )
}
