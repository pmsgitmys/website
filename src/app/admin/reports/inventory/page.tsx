'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileBarChart, Download, Package, AlertTriangle, TrendingDown } from 'lucide-react'
import { generateProducts } from '@/lib/admin-data'
import { useMemo } from 'react'

export default function InventoryReportsPage() {
  const products = useMemo(() => generateProducts(), [])

  const inventoryMetrics = useMemo(() => {
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0)
    const lowStock = products.filter(p => p.stock < 50).length
    const outOfStock = products.filter(p => p.stock === 0).length
    const overStock = products.filter(p => p.stock > 200).length

    return { totalItems, lowStock, outOfStock, overStock }
  }, [products])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Reports</h1>
          <p className="text-gray-500 mt-2">Stock levels, movements, and alerts</p>
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
              <Package className="h-4 w-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryMetrics.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">In stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryMetrics.lowStock}</div>
            <p className="text-xs text-gray-500 mt-1">Below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryMetrics.outOfStock}</div>
            <p className="text-xs text-gray-500 mt-1">Needs reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Overstock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inventoryMetrics.overStock}</div>
            <p className="text-xs text-gray-500 mt-1">Excess inventory</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Level Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.slice(0, 8).map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{product.stock} units</div>
                    <div className={`text-xs ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 50 ? 'text-yellow-600' :
                      product.stock > 200 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {product.stock === 0 ? 'Out of stock' :
                       product.stock < 50 ? 'Low stock' :
                       product.stock > 200 ? 'Overstock' : 'Normal'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Movement Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Stock In/Out Summary', period: 'Last 7 days' },
                { name: 'Dead Stock Analysis', period: 'Last 90 days' },
                { name: 'Reorder Point Report', period: 'Current' },
                { name: 'ABC Analysis Report', period: 'Last quarter' }
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.period}</div>
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
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700 font-medium mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Out of Stock Items
                </div>
                <div className="text-sm text-red-600">{inventoryMetrics.outOfStock} products need immediate reorder</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700 font-medium mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Low Stock Warning
                </div>
                <div className="text-sm text-yellow-600">{inventoryMetrics.lowStock} products below threshold</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                  <Package className="h-4 w-4" />
                  Overstock Notice
                </div>
                <div className="text-sm text-blue-600">{inventoryMetrics.overStock} products have excess inventory</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
