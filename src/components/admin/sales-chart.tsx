'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface DailySale {
  date: string
  orders: number
  revenue: number
}

interface SalesChartProps {
  data: DailySale[]
  loading?: boolean
}

export function SalesChart({ data, loading }: SalesChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    }),
    orders: Number(item.orders),
    revenue: Number(item.revenue) / 1000, // Convert to thousands for better display
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="date"
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: any, name: string) => [
                  name === 'revenue' ? `₹${(value * 1000).toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}