'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EnhancedProductShowcase } from '@/components/ui/enhanced-product-showcase'
import {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
} from 'lucide-react'

// Sample data for demonstration
const sampleProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 134900,
    comparePrice: 149900,
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', alt: 'iPhone 15 Pro' }],
    brand: { name: 'Apple' },
    inventory: { quantity: 5 },
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    featured: true
  },
  {
    id: '2',
    name: 'MacBook Pro 14" M3',
    price: 199900,
    comparePrice: 219900,
    images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', alt: 'MacBook Pro' }],
    brand: { name: 'Apple' },
    inventory: { quantity: 3 },
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    featured: false
  },
  {
    id: '3',
    name: 'AirPods Pro (2nd Gen)',
    price: 24900,
    comparePrice: 27900,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', alt: 'AirPods Pro' }],
    brand: { name: 'Apple' },
    inventory: { quantity: 10 },
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
    featured: true
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    price: 129999,
    comparePrice: 139999,
    images: [{ url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', alt: 'Galaxy S24' }],
    brand: { name: 'Samsung' },
    inventory: { quantity: 7 },
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
    featured: false
  }
]

const sampleCategories = [
  {
    id: '1',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest mobile phones with cutting-edge technology',
    _count: { products: 25 }
  },
  {
    id: '2',
    name: 'Laptops',
    slug: 'laptops',
    description: 'High-performance laptops for work and gaming',
    _count: { products: 18 }
  },
  {
    id: '3',
    name: 'Audio',
    slug: 'audio',
    description: 'Premium headphones and speakers',
    _count: { products: 32 }
  },
  {
    id: '4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Cases, chargers, and other essentials',
    _count: { products: 45 }
  }
]

export function StaticCategoriesSection() {
  const categoryIcons = {
    'smartphones': Smartphone,
    'laptops': Laptop,
    'audio': Headphones,
    'accessories': Gamepad2
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of electronics across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCategories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Smartphone
            return (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                  <CardContent className="p-8 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <Badge variant="secondary">
                      {category._count.products} Products
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function StaticFeaturedProductsSection() {
  return (
    <EnhancedProductShowcase
      products={sampleProducts}
      title="Featured Products"
      subtitle="Hand-picked products with the best value for money"
    />
  )
}