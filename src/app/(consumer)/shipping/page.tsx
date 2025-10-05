'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Clock, Shield, MapPin, Package, Zap, Globe, CheckCircle } from 'lucide-react'

export default function ShippingPage() {
  const shippingOptions = [
    {
      type: 'Standard Delivery',
      duration: '3-5 Business Days',
      cost: 'Free on orders above ₹500',
      features: ['Order tracking', 'SMS updates', 'Safe packaging']
    },
    {
      type: 'Express Delivery',
      duration: '1-2 Business Days',
      cost: '₹199',
      features: ['Priority handling', 'Real-time tracking', 'Secure packaging', 'SMS & Email updates']
    },
    {
      type: 'Same Day Delivery',
      duration: 'Within 6 hours',
      cost: '₹399',
      features: ['Available in select cities', 'Order before 2 PM', 'Live tracking', 'Direct handover']
    }
  ]

  const deliveryZones = [
    {
      zone: 'Metro Cities',
      cities: 'Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad',
      standard: '2-3 days',
      express: '1 day',
      sameDay: 'Available'
    },
    {
      zone: 'Tier 1 Cities',
      cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Surat',
      standard: '3-4 days',
      express: '1-2 days',
      sameDay: 'Not Available'
    },
    {
      zone: 'Tier 2 Cities',
      cities: 'Guwahati, Bhopal, Chandigarh, Coimbatore, Nashik',
      standard: '4-5 days',
      express: '2-3 days',
      sameDay: 'Not Available'
    },
    {
      zone: 'Remote Areas',
      cities: 'Hill stations, Remote locations, Island territories',
      standard: '5-7 days',
      express: '3-4 days',
      sameDay: 'Not Available'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Fast, reliable, and secure delivery options to get your electronics to you quickly and safely.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Truck className="h-6 w-6 mr-2 text-blue-600" />
          Delivery Options
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {shippingOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{option.type}</CardTitle>
                  {index === 1 && <Badge className="bg-blue-500">Most Popular</Badge>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-green-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-medium">{option.duration}</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{option.cost}</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-green-600" />
          Delivery Zones & Timeline
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium">Zone</th>
                    <th className="text-left p-4 font-medium">Cities/Areas</th>
                    <th className="text-left p-4 font-medium">Standard</th>
                    <th className="text-left p-4 font-medium">Express</th>
                    <th className="text-left p-4 font-medium">Same Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {deliveryZones.map((zone, index) => (
                    <tr key={index}>
                      <td className="p-4 font-medium">{zone.zone}</td>
                      <td className="p-4 text-sm text-gray-600">{zone.cities}</td>
                      <td className="p-4">
                        <Badge variant="outline">{zone.standard}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{zone.express}</Badge>
                      </td>
                      <td className="p-4">
                        {zone.sameDay === 'Available' ? (
                          <Badge className="bg-green-100 text-green-800">Available</Badge>
                        ) : (
                          <Badge variant="secondary">Not Available</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-purple-600" />
          Shipping Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-medium mb-2">Secure Packaging</h3>
              <p className="text-sm text-gray-600">
                Bubble wrap, anti-static bags, and sturdy boxes protect your electronics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-medium mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">
                Track your order from warehouse to doorstep with live updates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-medium mb-2">Insurance Coverage</h3>
              <p className="text-sm text-gray-600">
                All shipments insured against damage and loss during transit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <h3 className="font-medium mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">
                Orders processed and shipped within 24 hours on business days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shipping Policy</h2>
        <Card>
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Order Processing</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Orders placed before 2 PM are processed the same day</li>
                    <li>• Orders placed after 2 PM are processed the next business day</li>
                    <li>• No processing on Sundays and national holidays</li>
                    <li>• Custom/bulk orders may take additional 1-2 days</li>
                  </ul>

                  <h3 className="text-lg font-medium mb-4 mt-6">Shipping Charges</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Free standard shipping on orders above ₹500</li>
                    <li>• Express delivery: ₹199 (regardless of order value)</li>
                    <li>• Same day delivery: ₹399 (select cities only)</li>
                    <li>• COD charges: ₹50 additional</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Signature required for all deliveries</li>
                    <li>• Multiple delivery attempts for failed deliveries</li>
                    <li>• Package held at facility for 7 days before return</li>
                    <li>• SMS and email notifications at each step</li>
                  </ul>

                  <h3 className="text-lg font-medium mb-4 mt-6">Special Cases</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Remote areas may incur additional charges</li>
                    <li>• Large items (TVs, appliances) may require special handling</li>
                    <li>• Weather conditions may affect delivery timelines</li>
                    <li>• Recipient must be available during delivery window</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Need Help with Shipping?</h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help with any shipping questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Track Order: </span>
              <span className="text-blue-600 ml-1">phonemax.com/track</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Support: </span>
              <span className="text-blue-600 ml-1">+91 1800-123-4567</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}