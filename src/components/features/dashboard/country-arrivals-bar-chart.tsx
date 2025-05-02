'use client'

import { CountryArrivals } from '@prisma/client' // Assuming prisma generate updated this
import {
  BarChart,
  Bar,
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

interface CountryArrivalsBarChartProps {
  data: CountryArrivals[]
  year: number
}

// Helper function to format large numbers for Y-axis
const formatYAxisTick = (tick: number) => {
  if (tick >= 1000000) {
    return `${(tick / 1000000).toFixed(1)}M`
  }
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}K`
  }
  return tick.toString()
}

export function CountryArrivalsBarChart({ data, year }: CountryArrivalsBarChartProps) {
  // Optionally limit the number of countries shown for readability
  const topN = 15 // Show top 15 countries
  const chartData = data.slice(0, topN)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{year}年 国別入国者数 (Top {topN})</CardTitle>
        <CardDescription>{year}年の国別入国者数（上位{topN}カ国）</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 70,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10 }}
              height={60}
            />
            <YAxis tickFormatter={formatYAxisTick} />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} 人`,
                '入国者数',
              ]}
            />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
            <Bar dataKey="count" fill="#8884d8" name="入国者数" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 