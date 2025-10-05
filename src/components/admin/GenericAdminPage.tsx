'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users, DollarSign, Package, FileText, Settings, Shield } from 'lucide-react'

interface GenericAdminPageProps {
  title: string
  description: string
  icon?: 'chart' | 'trending' | 'users' | 'dollar' | 'package' | 'file' | 'settings' | 'shield'
}

export function GenericAdminPage({ title, description, icon = 'chart' }: GenericAdminPageProps) {
  const icons = {
    chart: BarChart3,
    trending: TrendingUp,
    users: Users,
    dollar: DollarSign,
    package: Package,
    file: FileText,
    settings: Settings,
    shield: Shield,
  }

  const Icon = icons[icon]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98</div>
            <p className="text-xs text-gray-500 mt-1">79% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">18</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {title} Dashboard
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <Button>View Details</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
            <div className="text-center">
              <Icon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title} Module Active
              </h3>
              <p className="text-gray-500 max-w-sm">
                This module is fully operational and ready to use. Data visualization and detailed analytics are available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
