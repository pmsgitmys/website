'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, DollarSign, PieChart, Calendar, Download } from 'lucide-react'
import { generateOrders, generateProducts } from '@/lib/admin-data'
import { useMemo } from 'react'

export default function RevenuePage() {
  const orders = useMemo(() => generateOrders(), [])
  const products = useMemo(() => generateProducts(), [])

  const revenueMetrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const totalTax = orders.reduce((sum, o) => sum + o.tax, 0)
    const totalShipping = orders.reduce((sum, o) => sum + o.shipping, 0)
    const netRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0)

    const thisMonth = new Date().getMonth()
    const thisMonthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === thisMonth)
    const lastMonthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === thisMonth - 1)

    const monthlyRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0)
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0)
    const growthRate = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    return { totalRevenue, totalTax, totalShipping, netRevenue, monthlyRevenue, growthRate }
  }, [orders])

  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [products])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
          <p className="text-gray-500 mt-2">Financial performance and revenue insights</p>
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
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(revenueMetrics.totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-green-600 mt-1">+{revenueMetrics.growthRate.toFixed(1)}% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(revenueMetrics.netRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">After deductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Tax Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(revenueMetrics.totalTax / 1000).toFixed(1)}K</div>
            <p className="text-xs text-gray-500 mt-1">GST revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(revenueMetrics.monthlyRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">Current period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Revenue Generating Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sold} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{(product.revenue / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-gray-500">{((product.revenue / revenueMetrics.totalRevenue) * 100).toFixed(0)}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Product Sales</span>
                  <span className="text-gray-600">₹{(revenueMetrics.netRevenue / 100000).toFixed(1)}L ({((revenueMetrics.netRevenue / revenueMetrics.totalRevenue) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(revenueMetrics.netRevenue / revenueMetrics.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Shipping Charges</span>
                  <span className="text-gray-600">₹{(revenueMetrics.totalShipping / 1000).toFixed(1)}K ({((revenueMetrics.totalShipping / revenueMetrics.totalRevenue) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(revenueMetrics.totalShipping / revenueMetrics.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Taxes (GST)</span>
                  <span className="text-gray-600">₹{(revenueMetrics.totalTax / 1000).toFixed(1)}K ({((revenueMetrics.totalTax / revenueMetrics.totalRevenue) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(revenueMetrics.totalTax / revenueMetrics.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Month-over-Month Growth</span>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-700">{revenueMetrics.growthRate.toFixed(1)}%</div>
                <p className="text-xs text-green-600 mt-1">Strong upward trend</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Average Order Value</span>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-700">₹{(revenueMetrics.totalRevenue / orders.length / 1000).toFixed(1)}K</div>
                <p className="text-xs text-blue-600 mt-1">Per transaction</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Revenue Per Product</span>
                  <PieChart className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-700">₹{(revenueMetrics.totalRevenue / products.length / 1000).toFixed(1)}K</div>
                <p className="text-xs text-purple-600 mt-1">Average contribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
