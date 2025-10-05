'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Star, Heart, ShoppingCart, Eye, Zap, Shield, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  images: { url: string; alt?: string | null }[]
  brand?: { name: string } | null
  inventory?: { quantity: number } | null
  reviews?: { rating: number }[]
  featured?: boolean
}

interface EnhancedProductShowcaseProps {
  products: Product[]
  title?: string
  subtitle?: string
  className?: string
}

export function EnhancedProductShowcase({
  products,
  title = "Featured Products",
  subtitle = "Discover our handpicked selection of premium electronics",
  className = ""
}: EnhancedProductShowcaseProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '/placeholder-product.jpg',
    })
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (!products.length) {
    return <ProductShowcaseSkeleton />
  }

  return (
    <TooltipProvider>
      <section className={`py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 ${className}`}>
        <div className="container mx-auto px-4">
          {/* Header with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </motion.div>

          {/* Enhanced Product Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <EnhancedProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/80 hover:bg-white border-2 shadow-lg" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/80 hover:bg-white border-2 shadow-lg" />
            </Carousel>
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Eye className="mr-2 h-5 w-5" />
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  )
}

function EnhancedProductCard({ product, onAddToCart }: { product: Product, onAddToCart: (product: Product) => void }) {
  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const isOutOfStock = product.inventory ? product.inventory.quantity <= 0 : false
  const rating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 4.5

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-white/70 backdrop-blur-sm h-full">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </motion.div>
          )}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                {discountPercentage}% OFF
              </Badge>
            </motion.div>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="bg-gray-500 text-white">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/90 hover:bg-white shadow-lg w-8 h-8"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Wishlist</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/products/${product.id}`}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/90 hover:bg-white shadow-lg w-8 h-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quick View</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Quick Add to Cart Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="bg-white text-black hover:bg-gray-100 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </motion.div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Brand with hover card */}
          {product.brand && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                  {product.brand.name}
                </p>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{product.brand.name}</h4>
                  <p className="text-xs text-gray-600">
                    Trusted brand with official warranty and service support.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Genuine
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      Fast Delivery
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          {/* Product name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm leading-tight hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star
                      className={`h-3 w-3 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviews?.length || 0})
              </span>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span className="text-xs text-gray-600">
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">
              EMI from ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductShowcaseSkeleton() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}