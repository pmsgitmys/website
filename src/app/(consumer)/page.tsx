import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/ui/product-card'
import { EnhancedProductShowcase } from '@/components/ui/enhanced-product-showcase'
import {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Shield,
  Truck,
  RotateCcw,
  Clock,
  Star,
  ArrowRight,
  Phone,
  MapPin
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/sections/hero-section'
import { DatabaseTest } from '@/components/debug/database-test'
import { StaticCategoriesSection, StaticFeaturedProductsSection } from '@/components/demo/static-demo'

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: {
      isActive: true
    },
    include: {
      category: true,
      images: true
    },
    take: 8,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    where: {
      isActive: true,
      products: {
        some: {
          isActive: true
        }
      }
    },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true
            }
          }
        }
      }
    }
  })
}


function TrustBadges() {
  const badges = [
    { icon: Shield, title: '100% Genuine', desc: 'Authentic products only' },
    { icon: Truck, title: 'Free Delivery', desc: 'Same day in Mysore' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
    { icon: Clock, title: 'Quick Service', desc: '24/7 customer support' }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full">
                <badge.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

async function CategoriesSection() {
  const categories = await getCategories()

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
          {categories.map((category) => {
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

async function FeaturedProductsSection() {
  const products = await getFeaturedProducts()

  return (
    <EnhancedProductShowcase
      products={products}
      title="Featured Products"
      subtitle="Hand-picked products with the best value for money"
    />
  )
}

function WhyChooseUsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose PhoneMax?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Trusted by 10,000+ Customers</h3>
                  <p className="text-gray-600">
                    Serving Mysore for over 5 years with excellent customer satisfaction ratings.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Local Store, Personal Service</h3>
                  <p className="text-gray-600">
                    Visit our store in Mysore for hands-on experience and expert advice.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Authorized Service Partners</h3>
                  <p className="text-gray-600">
                    Official warranty and service support for all major brands.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Visit Our Store</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <span>123 Electronics Street, Mysore, Karnataka 570001</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5" />
                  <span>Mon-Sat: 10AM-8PM, Sunday: 11AM-6PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+91-821-2345678</span>
                </div>
              </div>
              <Button className="mt-6 bg-white text-blue-600 hover:bg-gray-100">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <Suspense fallback={<div className="py-16 text-center">Loading categories...</div>}>
        <CategoriesSection />
      </Suspense>
      <Suspense fallback={<div className="py-16 text-center">Loading featured products...</div>}>
        <FeaturedProductsSection />
      </Suspense>
      <WhyChooseUsSection />
    </>
  )
}
