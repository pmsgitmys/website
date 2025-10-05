'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Package, RefreshCw } from 'lucide-react'

export default function ReturnsPage() {
  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and select the item you want to return',
      timeframe: 'Within 30 days'
    },
    {
      step: 2,
      title: 'Package the Item',
      description: 'Pack the item in original packaging with all accessories',
      timeframe: '1-2 days'
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'Our delivery partner will collect the package from your address',
      timeframe: '1-3 days'
    },
    {
      step: 4,
      title: 'Quality Check',
      description: 'We inspect the returned item for damage and completeness',
      timeframe: '2-3 days'
    },
    {
      step: 5,
      title: 'Refund Processing',
      description: 'Refund is processed to your original payment method',
      timeframe: '3-7 days'
    }
  ]

  const returnableItems = [
    {
      category: 'Smartphones & Tablets',
      period: '30 days',
      conditions: ['Original packaging', 'No physical damage', 'All accessories included'],
      status: 'eligible'
    },
    {
      category: 'Laptops & Computers',
      period: '30 days',
      conditions: ['Original packaging', 'No software installed', 'All components included'],
      status: 'eligible'
    },
    {
      category: 'Audio & Headphones',
      period: '30 days',
      conditions: ['Hygienic condition', 'Original packaging', 'No wear signs'],
      status: 'eligible'
    },
    {
      category: 'Accessories',
      period: '15 days',
      conditions: ['Unopened packaging', 'No usage signs'],
      status: 'limited'
    },
    {
      category: 'Gaming Consoles',
      period: '30 days',
      conditions: ['Original packaging', 'No modifications', 'All accessories'],
      status: 'eligible'
    },
    {
      category: 'Personalized Items',
      period: 'No returns',
      conditions: ['Custom engraving', 'Special orders'],
      status: 'not-eligible'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'eligible':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'limited':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'not-eligible':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'bg-green-100 text-green-800'
      case 'limited':
        return 'bg-yellow-100 text-yellow-800'
      case 'not-eligible':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Easy returns and quick refunds. We want you to be completely satisfied with your purchase.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="mb-12">
        <Alert className="mb-6">
          <RotateCcw className="h-4 w-4" />
          <AlertDescription>
            We offer hassle-free returns within 30 days of purchase for most items.
            Items must be in original condition with all accessories and packaging.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-medium mb-2">30-Day Returns</h3>
              <p className="text-sm text-gray-600">
                Return most items within 30 days of delivery for a full refund
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-medium mb-2">Free Pickup</h3>
              <p className="text-sm text-gray-600">
                We'll collect the item from your doorstep at no extra cost
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-medium mb-2">Quick Refunds</h3>
              <p className="text-sm text-gray-600">
                Refunds processed within 3-7 business days after inspection
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Process */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
        <div className="space-y-6">
          {returnProcess.map((step, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg">{step.title}</h3>
                      <Badge variant="outline">{step.timeframe}</Badge>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Returnable Items */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Return Eligibility by Category</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {returnableItems.map((item, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <h3 className="font-medium text-lg">{item.category}</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'eligible' ? 'Returnable' :
                         item.status === 'limited' ? 'Limited Returns' : 'No Returns'}
                      </Badge>
                      <Badge variant="outline">{item.period}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Conditions: </span>
                    {item.conditions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund Information */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Refund Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Refund Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Credit/Debit Cards</span>
                <span className="text-sm text-gray-600">3-5 business days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Net Banking</span>
                <span className="text-sm text-gray-600">3-5 business days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">UPI/Wallets</span>
                <span className="text-sm text-gray-600">1-3 business days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Cash on Delivery</span>
                <span className="text-sm text-gray-600">7-10 business days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Original Payment Method</div>
                    <div className="text-sm text-gray-600">Refund to the same card/account used for payment</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Store Credit</div>
                    <div className="text-sm text-gray-600">Get credit for future purchases (bonus 5% extra)</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Exchange</div>
                    <div className="text-sm text-gray-600">Exchange for another item of same or higher value</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Non-Returnable Items */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Items That Cannot Be Returned</h2>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-red-900">Physical Condition</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Items with physical damage not caused by shipping</li>
                  <li>• Products with missing accessories or components</li>
                  <li>• Items showing signs of use or wear</li>
                  <li>• Products with scratches, dents, or water damage</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 text-red-900">Special Categories</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Personalized or customized items</li>
                  <li>• Software and digital downloads</li>
                  <li>• Items returned after 30-day window</li>
                  <li>• Products without original packaging</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Support */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Need Help with Returns?</h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is ready to assist you with returns and refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Start Return Process
            </Button>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Call us at <span className="font-medium">+91 1800-123-4567</span> or email <span className="font-medium">returns@phonemax.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}