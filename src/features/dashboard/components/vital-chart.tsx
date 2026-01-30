/**
 * Vital Chart Component
 * Renders a line chart for vital sign data using recharts
 */

import { VitalSign } from '@/types/patient'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface VitalChartProps {
  data: VitalSign[]
  color: string
  label: string
  unit: string
  height?: number
  showXAxis?: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  unit: string
  chartLabel: string
}

/**
 * Custom tooltip component with enhanced styling
 */
function CustomTooltip({
  active,
  payload,
  label,
  unit,
  chartLabel,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const firstPayload = payload[0]
  if (!firstPayload) return null

  const value = firstPayload.value

  return (
    <div className="bg-card/95 min-w-[120px] rounded-xl border p-3 shadow-xl backdrop-blur-sm">
      <p className="text-muted-foreground mb-1 text-[10px] tracking-wide uppercase">
        {label}
      </p>
      <p className="flex items-baseline gap-1 text-sm font-bold">
        <span className="text-lg">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-muted-foreground text-xs font-normal">
          {unit}
        </span>
      </p>
      <p className="text-muted-foreground mt-1 text-[10px]">{chartLabel}</p>
    </div>
  )
}

export function VitalChart({
  data,
  color,
  label,
  unit,
  height = 60,
  showXAxis = false,
}: VitalChartProps) {
  // Format data for recharts
  const chartData = data.map((d) => {
    const date = new Date(d.timestamp)
    const time = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    return {
      time,
      value: d.value,
    }
  })

  if (chartData.length === 0) {
    return (
      <div
        className="text-muted-foreground flex items-center justify-center text-sm"
        style={{ height }}
      >
        데이터 없음
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      >
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          hide={!showXAxis}
        />
        <YAxis
          hide
          domain={[
            (dataMin: number) => Math.floor(dataMin * 0.95),
            (dataMax: number) => Math.ceil(dataMax * 1.05),
          ]}
        />
        <Tooltip
          content={(props) => (
            <CustomTooltip
              active={props.active}
              payload={props.payload as Array<{ value: number }> | undefined}
              label={props.label as string | undefined}
              unit={unit}
              chartLabel={label}
            />
          )}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          animationDuration={300}
          isAnimationActive={true}
          style={{
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
