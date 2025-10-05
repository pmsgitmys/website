'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  newUsers: number
  revenueGrowth: number
  ordersGrowth: number
}

interface AnalyticsCardsProps {
  summary: AnalyticsSummary
  loading?: boolean
}

export function AnalyticsCards({ summary, loading }: AnalyticsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${summary.totalRevenue.toLocaleString()}`,
      change: summary.revenueGrowth,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: summary.totalOrders.toLocaleString(),
      change: summary.ordersGrowth,
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'New Users',
      value: summary.newUsers.toLocaleString(),
      change: null,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Order Value',
      value: `₹${summary.totalOrders > 0 ? Math.round(summary.totalRevenue / summary.totalOrders).toLocaleString() : 0}`,
      change: null,
      icon: Package,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            {card.change !== null && (
              <div className="flex items-center text-xs">
                {card.change >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600">+{card.change}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-600">{card.change}%</span>
                  </>
                )}
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}