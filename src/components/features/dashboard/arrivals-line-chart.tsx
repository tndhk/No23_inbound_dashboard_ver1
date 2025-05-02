'use client'

import { YearlyArrivals } from '@prisma/client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ArrivalsLineChartProps {
  data: YearlyArrivals[]
}

// Helper function to format large numbers
const formatYAxisTick = (tick: number) => {
  if (tick >= 1000000) {
    return `${(tick / 1000000).toFixed(1)}M`
  }
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}K`
  }
  return tick.toString()
}

export function ArrivalsLineChart({ data }: ArrivalsLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>年別総入国者数推移</CardTitle>
        <CardDescription>過去の年別総入国者数の推移グラフ</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatYAxisTick} />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} 人`, // Format tooltip value
                '総入国者数', // Tooltip label
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="総入国者数"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 