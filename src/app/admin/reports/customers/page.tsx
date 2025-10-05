'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileUser, Download, Users, Star, TrendingUp, ShoppingBag } from 'lucide-react'
import { generateCustomers } from '@/lib/admin-data'
import { useMemo } from 'react'

export default function CustomerReportsPage() {
  const customers = useMemo(() => generateCustomers(), [])

  const customerMetrics = useMemo(() => {
    const totalSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const avgSpend = totalSpend / customers.length
    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)

    return { totalSpend, avgSpend, topCustomers }
  }, [customers])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Reports</h1>
          <p className="text-gray-500 mt-2">Customer behavior and purchase analytics</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-green-600 mt-1">+15% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(customerMetrics.avgSpend / 1000).toFixed(1)}K</div>
            <p className="text-xs text-gray-500 mt-1">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(customerMetrics.totalSpend / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Star className="h-4 w-4" />
              VIP Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {customers.filter(c => c.totalSpent > 100000).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Spend &gt;₹1L</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customerMetrics.topCustomers.map((customer, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{(customer.totalSpent / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-gray-500">{customer.orderCount} orders</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'High-Value Customers', description: 'Spend >₹1L lifetime' },
                { name: 'Frequent Buyers', description: '10+ orders placed' },
                { name: 'New Customers', description: 'Registered last 30 days' },
                { name: 'Inactive Customers', description: 'No purchase in 90 days' }
              ].map((segment, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileUser className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-sm text-gray-500">{segment.description}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Activity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Active Customers (30 days)</span>
                  <span className="text-gray-600">{customers.filter(c => c.status === 'active').length} ({((customers.filter(c => c.status === 'active').length / customers.length) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(customers.filter(c => c.status === 'active').length / customers.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Repeat Customers</span>
                  <span className="text-gray-600">{customers.filter(c => c.orderCount > 1).length} ({((customers.filter(c => c.orderCount > 1).length / customers.length) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(customers.filter(c => c.orderCount > 1).length / customers.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">VIP Members (₹1L+)</span>
                  <span className="text-gray-600">{customers.filter(c => c.totalSpent > 100000).length} ({((customers.filter(c => c.totalSpent > 100000).length / customers.length) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(customers.filter(c => c.totalSpent > 100000).length / customers.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
