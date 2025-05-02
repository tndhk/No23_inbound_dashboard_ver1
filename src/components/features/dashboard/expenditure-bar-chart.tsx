'use client'

import { CountryExpenditure } from '@prisma/client'
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

interface ExpenditureBarChartProps {
  data: CountryExpenditure[]
}

// Helper function to format currency
const formatCurrency = (value: number) => {
  return `¥${value.toLocaleString()}`
}

// Helper function to format Y-axis currency ticks
const formatYAxisTick = (tick: number) => {
  if (tick >= 10000) {
    return `¥${(tick / 10000).toFixed(0)}万` // Display in 万円 for larger values
  }
  return `¥${tick.toLocaleString()}`
}

export function ExpenditureBarChart({ data }: ExpenditureBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>国別 1人あたり平均消費額</CardTitle>
        <CardDescription>国別の1人あたり平均消費額（円）</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
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
              // tick={{ fontSize: 10 }} // Removed for now to check lint error
              height={60} // Allocate height for tilted labels
            />
            <YAxis tickFormatter={formatYAxisTick} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), '平均消費額']} />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
            <Bar dataKey="averageExpenditure" fill="#82ca9d" name="平均消費額(円)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 