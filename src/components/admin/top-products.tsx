import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Product {
  id: string
  name: string
  sales: number
  revenue: number
}

interface TopProductsProps {
  products?: Product[]
}

export function TopProducts({ products = [] }: TopProductsProps) {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      sales: 156,
      revenue: 156000
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      sales: 142,
      revenue: 127800
    },
    {
      id: '3',
      name: 'Google Pixel 8',
      sales: 98,
      revenue: 78400
    },
    {
      id: '4',
      name: 'OnePlus 12',
      sales: 87,
      revenue: 69600
    }
  ]

  const displayProducts = products.length > 0 ? products : mockProducts

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sold</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${product.revenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}