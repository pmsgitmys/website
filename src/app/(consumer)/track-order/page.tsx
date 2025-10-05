'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Search,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react'

interface TrackingStatus {
  status: string
  location: string
  date: string
  time: string
  description: string
}

interface OrderTracking {
  orderId: string
  orderDate: string
  estimatedDelivery: string
  currentStatus: 'ordered' | 'confirmed' | 'shipped' | 'out-for-delivery' | 'delivered'
  trackingNumber: string
  courier: string
  deliveryAddress: string
  history: TrackingStatus[]
  items: {
    name: string
    quantity: number
    image: string
  }[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [tracking, setTracking] = useState<OrderTracking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setTracking(null)

    // Simulate API call
    setTimeout(() => {
      // Mock data - replace with actual API call
      if (orderNumber.toLowerCase().includes('pm') || orderNumber === '12345') {
        setTracking({
          orderId: orderNumber || 'PM-2024-001234',
          orderDate: '2024-10-01',
          estimatedDelivery: '2024-10-06',
          currentStatus: 'shipped',
          trackingNumber: 'DTDC1234567890',
          courier: 'DTDC Express',
          deliveryAddress: '123 MG Road, Mysore, Karnataka 570001',
          history: [
            {
              status: 'Order Placed',
              location: 'Mysore',
              date: '2024-10-01',
              time: '10:30 AM',
              description: 'Your order has been placed successfully'
            },
            {
              status: 'Order Confirmed',
              location: 'Mysore',
              date: '2024-10-01',
              time: '11:45 AM',
              description: 'Payment confirmed and order is being processed'
            },
            {
              status: 'Shipped',
              location: 'Mysore Warehouse',
              date: '2024-10-02',
              time: '02:30 PM',
              description: 'Your order has been shipped'
            },
            {
              status: 'In Transit',
              location: 'Bangalore Hub',
              date: '2024-10-03',
              time: '09:15 AM',
              description: 'Package is in transit to your location'
            },
            {
              status: 'Out for Delivery',
              location: 'Mysore Delivery Center',
              date: '2024-10-05',
              time: '08:00 AM',
              description: 'Package is out for delivery'
            }
          ],
          items: [
            {
              name: 'iPhone 15 Pro Max 256GB',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200'
            }
          ]
        })
      } else {
        setError('Order not found. Please check your order number and email address.')
      }
      setIsLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('delivered')) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    } else if (statusLower.includes('out for delivery')) {
      return <Truck className="h-6 w-6 text-blue-500" />
    } else if (statusLower.includes('shipped') || statusLower.includes('transit')) {
      return <Package className="h-6 w-6 text-blue-500" />
    } else {
      return <Clock className="h-6 w-6 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Enter your order details to track your package in real-time
          </p>
        </div>

        {/* Track Order Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Enter Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber">Order Number *</Label>
                  <Input
                    id="orderNumber"
                    placeholder="e.g., PM-2024-001234"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can find your order number in the confirmation email
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Demo:</strong> Try order number "PM-2024-001234" or "12345" with any email to see tracking details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Results */}
        {tracking && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="font-semibold">{tracking.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                    <p className="font-semibold">
                      {new Date(tracking.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-green-600">
                      {new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                    <p className="font-semibold">{tracking.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Courier</p>
                    <p className="font-semibold">{tracking.courier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                    <p className="font-semibold text-sm">{tracking.deliveryAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Items in this order</h4>
                  <div className="space-y-3">
                    {tracking.items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Tracking Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tracking.history.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(event.status)}
                        </div>
                        {index !== tracking.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold">{event.status}</h4>
                          <span className="text-sm text-gray-600">
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your order or delivery, our customer support team is here to help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="tel:+918212345678">
                      <Phone className="h-4 w-4" />
                      Call: +91-821-2345678
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="mailto:contact@phonemax.in">
                      <Mail className="h-4 w-4" />
                      Email Support
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
