import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: string
  customer: string
  status: string
  total: number
  date: string
}

interface RecentOrdersProps {
  orders?: Order[]
}

export function RecentOrders({ orders = [] }: RecentOrdersProps) {
  const mockOrders: Order[] = [
    {
      id: '1',
      customer: 'John Doe',
      status: 'completed',
      total: 299.99,
      date: '2024-01-15'
    },
    {
      id: '2',
      customer: 'Jane Smith',
      status: 'pending',
      total: 199.99,
      date: '2024-01-14'
    },
    {
      id: '3',
      customer: 'Bob Johnson',
      status: 'shipped',
      total: 399.99,
      date: '2024-01-13'
    }
  ]

  const displayOrders = orders.length > 0 ? orders : mockOrders

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{order.customer}</p>
                <p className="text-sm text-muted-foreground">Order #{order.id}</p>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <p className="text-sm font-medium">${order.total}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}