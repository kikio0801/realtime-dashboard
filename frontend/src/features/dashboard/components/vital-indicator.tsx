/**
 * Vital Indicator Component
 * Displays a single vital sign with trend indicator
 */

import { VitalSign } from '@/types/patient'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VitalIndicatorProps {
  label: string
  value: number
  unit: string
  signs: VitalSign[]
  icon: React.ReactNode
  colorClass?: string
  precision?: number // Number of decimal places
}

type Trend = 'up' | 'down' | 'stable'

/**
 * Calculate trend from recent readings
 * Uses delta of the last 3 points
 */
function calculateTrend(signs: VitalSign[]): Trend {
  if (signs.length < 2) return 'stable'

  // Take last 3 readings
  const recent = signs.slice(-3)

  const firstReading = recent[0]
  const lastReading = recent[recent.length - 1]

  // Guard against undefined (should not happen but TypeScript requires it)
  if (!firstReading || !lastReading) return 'stable'

  // Simple diff between first and last
  const diff = lastReading.value - firstReading.value

  // Threshold for "stable" (less than 2% change)
  const firstValue = firstReading.value
  const threshold = Math.abs(firstValue * 0.02)

  if (Math.abs(diff) < threshold) return 'stable'
  return diff > 0 ? 'up' : 'down'
}

export function VitalIndicator({
  label,
  value,
  unit,
  signs,
  icon,
  colorClass = 'bg-blue-100',
  precision,
}: VitalIndicatorProps) {
  const trend = calculateTrend(signs)

  // Determine decimal places based on value magnitude or explicit precision
  const decimalPlaces = precision !== undefined ? precision : value < 10 ? 1 : 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn('rounded-lg p-2', colorClass)}>{icon}</div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-lg font-bold">
            {value.toFixed(decimalPlaces)}{' '}
            <span className="text-muted-foreground text-xs font-normal">
              {unit}
            </span>
          </p>
        </div>
      </div>

      {trend !== 'stable' && (
        <div
          className={cn(
            'flex items-center text-xs',
            trend === 'up' ? 'text-red-500' : 'text-blue-500'
          )}
        >
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
      )}
    </div>
  )
}
