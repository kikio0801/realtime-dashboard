/**
 * Status Badge Component
 * Displays patient status with color-coded badge
 */

import { PatientStatus } from '@/types/patient'
import { cn } from '@/lib/utils'
import { STATUS_COLORS } from '../utils/vital-thresholds'
import { Activity, AlertTriangle, AlertCircle } from 'lucide-react'

const STATUS_CONFIG = {
  stable: { label: '안정', icon: Activity },
  warning: { label: '주의', icon: AlertTriangle },
  critical: { label: '위급', icon: AlertCircle },
} as const

interface StatusBadgeProps {
  status: PatientStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = STATUS_CONFIG[status].icon
  const colors = STATUS_COLORS[status]

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
        colors.bg,
        colors.border,
        colors.text,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {STATUS_CONFIG[status].label}
    </div>
  )
}
