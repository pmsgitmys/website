'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, ShoppingCart, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Offer {
  id: string
  title: string
  description: string
  discount: string
  originalPrice: number
  salePrice: number
  image: string
  category: string
  brand: string
  validUntil: string
  featured: boolean
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading offers data
    const mockOffers: Offer[] = [
      {
        id: '1',
        title: 'iPhone 15 Pro Max - Limited Time Deal',
        description: 'Get the latest iPhone with premium features at an incredible price.',
        discount: '15% OFF',
        originalPrice: 159900,
        salePrice: 135915,
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
        category: 'Smartphones',
        brand: 'Apple',
        validUntil: '2024-12-31',
        featured: true
      },
      {
        id: '2',
        title: 'Samsung Galaxy S24 Ultra Bundle',
        description: 'Complete smartphone package with wireless charger and case included.',
        discount: '20% OFF',
        originalPrice: 134999,
        salePrice: 107999,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
        category: 'Smartphones',
        brand: 'Samsung',
        validUntil: '2024-12-25',
        featured: true
      },
      {
        id: '3',
        title: 'MacBook Pro M3 Student Discount',
        description: 'Special pricing for students and educators on the latest MacBook Pro.',
        discount: '10% OFF',
        originalPrice: 199900,
        salePrice: 179910,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
        category: 'Laptops',
        brand: 'Apple',
        validUntil: '2024-12-30',
        featured: false
      },
      {
        id: '4',
        title: 'Sony WH-1000XM5 Headphones',
        description: 'Premium noise-cancelling headphones with superior sound quality.',
        discount: '25% OFF',
        originalPrice: 34990,
        salePrice: 26242,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        category: 'Audio',
        brand: 'Sony',
        validUntil: '2024-12-28',
        featured: false
      },
      {
        id: '5',
        title: 'Gaming Laptop Mega Sale',
        description: 'High-performance gaming laptops for the ultimate gaming experience.',
        discount: '30% OFF',
        originalPrice: 159999,
        salePrice: 111999,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',
        category: 'Gaming',
        brand: 'ASUS',
        validUntil: '2024-12-29',
        featured: true
      },
      {
        id: '6',
        title: 'Wireless Accessories Bundle',
        description: 'Complete wireless setup with chargers, earbuds, and power banks.',
        discount: '40% OFF',
        originalPrice: 15999,
        salePrice: 9599,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600',
        category: 'Accessories',
        brand: 'Anker',
        validUntil: '2024-12-26',
        featured: false
      }
    ]

    setOffers(mockOffers)
    setIsLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const calculateSavings = (original: number, sale: number) => {
    return original - sale
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Special Offers & Deals</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover amazing deals on the latest electronics. Limited time offers you don't want to miss!
        </p>
      </div>

      {/* Featured Offers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Star className="h-6 w-6 mr-2 text-yellow-500" />
          Featured Deals
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.filter(offer => offer.featured).map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  {offer.discount}
                </Badge>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Until {formatDate(offer.validUntil)}
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2">{offer.brand}</Badge>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{offer.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{offer.salePrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{offer.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Save ₹{calculateSavings(offer.originalPrice, offer.salePrice).toLocaleString()}
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Offers */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Tag className="h-6 w-6 mr-2 text-blue-500" />
          All Offers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                  {offer.discount}
                </Badge>
                {offer.featured && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{offer.brand}</Badge>
                  <Badge variant="secondary">{offer.category}</Badge>
                </div>
                <CardTitle className="text-base">{offer.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm line-clamp-2">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-green-600">
                        ₹{offer.salePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 line-through ml-1">
                        ₹{offer.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">
                      Save ₹{calculateSavings(offer.originalPrice, offer.salePrice).toLocaleString()}
                    </span>
                    <span className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Until {formatDate(offer.validUntil)}
                    </span>
                  </div>
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Don't Miss Out!</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to get notified about the latest deals and exclusive offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  )
}