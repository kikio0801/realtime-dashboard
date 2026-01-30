/**
 * Patient Detail Dialog Component
 * Displays full patient details with all vital signs charts
 */

import { PatientWithVitals, VitalSign } from '@/types/patient'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusBadge } from './status-badge'
import { VitalChart } from './vital-chart'
import { getLatestValue } from '../utils/vital-thresholds'
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  Calendar,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientDetailDialogProps {
  patient: PatientWithVitals | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Vital stat card with enhanced styling
 */
function VitalStatCard({
  label,
  value,
  icon,
  colorClass = 'bg-slate-100',
}: {
  label: string
  value: string
  icon?: React.ReactNode
  colorClass?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 text-center transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-md',
        colorClass
      )}
    >
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      <p className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

/**
 * Vital chart section with card styling
 */
function VitalChartSection({
  title,
  data,
  color,
  unit,
}: {
  title: string
  data: VitalSign[]
  color: string
  unit: string
}) {
  return (
    <div className="bg-card rounded-xl border p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <VitalChart
        data={data}
        color={color}
        label={title}
        unit={unit}
        height={150}
        showXAxis={true}
      />
    </div>
  )
}

export function PatientDetailDialog({
  patient,
  open,
  onOpenChange,
}: PatientDetailDialogProps) {
  const latestVitals = patient
    ? {
        hr: getLatestValue(patient.vitals.heartRate),
        systolic: getLatestValue(patient.vitals.systolic),
        diastolic: getLatestValue(patient.vitals.diastolic),
        spo2: getLatestValue(patient.vitals.spo2),
        temp: getLatestValue(patient.vitals.temperature),
      }
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
        {patient && latestVitals && (
          <>
            {/* Status indicator bar at top */}
            <div
              className={cn(
                'absolute top-0 right-0 left-0 h-1.5',
                patient.status === 'critical' &&
                  'bg-linear-to-r from-red-400 to-red-500',
                patient.status === 'warning' &&
                  'bg-linear-to-r from-yellow-400 to-yellow-500',
                patient.status === 'stable' &&
                  'bg-linear-to-r from-green-400 to-green-500'
              )}
            />

            <DialogHeader className="pt-2">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {patient.name}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {patient.age}세 · 병상 {patient.bedNumber}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-600">
                    {patient.diagnosis}
                  </p>
                </div>
                <StatusBadge status={patient.status} />
              </div>
            </DialogHeader>

            <ScrollArea className="h-[calc(90vh-150px)]">
              <div className="space-y-6 pr-4">
                {/* Current Vitals Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <VitalStatCard
                    label="심박수"
                    value={`${latestVitals.hr.toFixed(0)} BPM`}
                    icon={<Heart className="h-5 w-5 text-red-500" />}
                    colorClass="bg-red-50"
                  />
                  <VitalStatCard
                    label="혈압"
                    value={`${latestVitals.systolic.toFixed(0)}/${latestVitals.diastolic.toFixed(0)}`}
                    icon={<Activity className="h-5 w-5 text-orange-500" />}
                    colorClass="bg-orange-50"
                  />
                  <VitalStatCard
                    label="산소포화도"
                    value={`${latestVitals.spo2.toFixed(1)}%`}
                    icon={<Wind className="h-5 w-5 text-blue-500" />}
                    colorClass="bg-blue-50"
                  />
                  <VitalStatCard
                    label="체온"
                    value={`${latestVitals.temp.toFixed(1)}°C`}
                    icon={<Thermometer className="h-5 w-5 text-purple-500" />}
                    colorClass="bg-purple-50"
                  />
                  <VitalStatCard
                    label="입원일"
                    value={new Date(patient.admissionDate).toLocaleDateString(
                      'ko-KR',
                      {
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                    icon={<Calendar className="h-5 w-5 text-slate-500" />}
                    colorClass="bg-slate-100"
                  />
                  <VitalStatCard
                    label="상태"
                    value={
                      patient.status === 'stable'
                        ? '안정'
                        : patient.status === 'warning'
                          ? '주의'
                          : '위급'
                    }
                    icon={<Shield className="h-5 w-5 text-green-500" />}
                    colorClass={
                      patient.status === 'stable'
                        ? 'bg-green-50'
                        : patient.status === 'warning'
                          ? 'bg-yellow-50'
                          : 'bg-red-50'
                    }
                  />
                </div>

                {/* Full Charts */}
                <div className="space-y-6">
                  <VitalChartSection
                    title="심박수 (Heart Rate)"
                    data={patient.vitals.heartRate}
                    color="#ef4444"
                    unit="BPM"
                  />

                  <VitalChartSection
                    title="수축기 혈압 (Systolic BP)"
                    data={patient.vitals.systolic}
                    color="#f97316"
                    unit="mmHg"
                  />

                  <VitalChartSection
                    title="이완기 혈압 (Diastolic BP)"
                    data={patient.vitals.diastolic}
                    color="#fb923c"
                    unit="mmHg"
                  />

                  <VitalChartSection
                    title="산소포화도 (SpO2)"
                    data={patient.vitals.spo2}
                    color="#3b82f6"
                    unit="%"
                  />

                  <VitalChartSection
                    title="체온 (Temperature)"
                    data={patient.vitals.temperature}
                    color="#8b5cf6"
                    unit="°C"
                  />
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
