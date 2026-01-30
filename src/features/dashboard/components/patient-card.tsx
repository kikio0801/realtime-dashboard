/**
 * Patient Card Component
 * Displays patient summary with vital signs and mini chart
 */

import { PatientWithVitals } from '@/types/patient'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { StatusBadge } from './status-badge'
import { VitalChart } from './vital-chart'
import { VitalIndicator } from './vital-indicator'
import { Heart, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STATUS_COLORS, getLatestValue } from '../utils/vital-thresholds'

interface PatientCardProps {
  patient: PatientWithVitals
  onClick: () => void
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const colors = STATUS_COLORS[patient.status]

  const latestVitals = {
    hr: getLatestValue(patient.vitals.heartRate),
    spo2: getLatestValue(patient.vitals.spo2),
  }

  // Status-specific hover shadow colors
  const hoverShadow = {
    critical: 'hover:shadow-red-200/50',
    warning: 'hover:shadow-yellow-200/50',
    stable: 'hover:shadow-green-200/50',
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl',
        'relative overflow-hidden border-2',
        colors.border,
        hoverShadow[patient.status],
        // Critical pulse effect
        patient.status === 'critical' && 'animate-pulse'
      )}
      style={{
        animationDuration: patient.status === 'critical' ? '3s' : undefined,
      }}
      onClick={onClick}
    >
      {/* Status indicator bar at top */}
      <div
        className={cn(
          'absolute top-0 right-0 left-0 h-1',
          patient.status === 'critical' &&
            'bg-linear-to-r from-red-400 to-red-500',
          patient.status === 'warning' &&
            'bg-linear-to-r from-yellow-400 to-yellow-500',
          patient.status === 'stable' &&
            'bg-linear-to-r from-green-400 to-green-500'
        )}
      />

      <CardHeader className="pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{patient.name}</h3>
            <p className="text-muted-foreground text-sm">
              {patient.age}세 · 병상 {patient.bedNumber}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {patient.diagnosis}
            </p>
          </div>
          <StatusBadge status={patient.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mini vital indicators */}
        <div className="grid grid-cols-2 gap-3">
          <VitalIndicator
            label="심박수"
            value={latestVitals.hr}
            unit="BPM"
            signs={patient.vitals.heartRate}
            icon={<Heart className="h-4 w-4 text-red-500" />}
            colorClass="bg-red-50"
            precision={0}
          />
          <VitalIndicator
            label="산소포화도"
            value={latestVitals.spo2}
            unit="%"
            signs={patient.vitals.spo2}
            icon={<Wind className="h-4 w-4 text-blue-500" />}
            colorClass="bg-blue-50"
            precision={1}
          />
        </div>

        {/* Mini sparkline chart for heart rate */}
        {patient.vitals.heartRate.length > 0 && (
          <div className={cn('rounded-lg p-2', colors.bg)}>
            <p className="text-muted-foreground mb-1 text-xs font-semibold">
              심박수 추이
            </p>
            <VitalChart
              data={patient.vitals.heartRate}
              color="#ef4444"
              label="심박수"
              unit="BPM"
              height={50}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
