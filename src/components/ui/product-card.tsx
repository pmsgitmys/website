'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  comparePrice?: number | null
  images: { url: string; alt?: string | null }[]
  brand?: { name: string } | null
  inventory?: { quantity: number } | null
  reviews?: { rating: number }[]
  featured?: boolean
}

interface ProductCardPropsWithProduct {
  product: Product
  className?: string
  // Individual props not used when product is provided
  id?: never
  name?: never
  price?: never
  comparePrice?: never
  image?: never
  brand?: never
  inStock?: never
  rating?: never
  reviewCount?: never
  viewMode?: never
}

interface ProductCardPropsWithIndividualProps {
  // Individual props
  id: string
  name: string
  price: number
  comparePrice?: number | null
  image: string
  brand?: string
  inStock?: boolean
  rating?: number
  reviewCount?: number
  viewMode?: 'grid' | 'list'
  className?: string
  // product not used when individual props are provided
  product?: never
}

type ProductCardProps = ProductCardPropsWithProduct | ProductCardPropsWithIndividualProps

export function ProductCard(props: ProductCardProps) {
  const { className = '' } = props

  // Normalize the props - either from product object or individual props
  const product = 'product' in props && props.product ? {
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    comparePrice: props.product.comparePrice,
    image: props.product.images?.[0]?.url || '/placeholder-product.jpg',
    brand: props.product.brand?.name || '',
    inStock: props.product.inventory ? props.product.inventory.quantity > 0 : true,
    rating: props.product.reviews?.length ?
      props.product.reviews.reduce((sum, review) => sum + review.rating, 0) / props.product.reviews.length : 4.5,
    reviewCount: props.product.reviews?.length || 0,
    viewMode: 'grid' as const
  } : {
    id: props.id,
    name: props.name,
    price: props.price,
    comparePrice: props.comparePrice,
    image: props.image,
    brand: props.brand || '',
    inStock: props.inStock ?? true,
    rating: props.rating ?? 4.5,
    reviewCount: props.reviewCount ?? 0,
    viewMode: props.viewMode || 'grid' as const
  }
  const { addItem } = useCartStore()

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const isOutOfStock = !product.inStock

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`,
    })
  }

  // List view for better mobile experience
  if (product.viewMode === 'list') {
    return (
      <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
        <div className="flex p-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="80px"
              />
            </Link>
          </div>

          {/* Product Info */}
          <div className="flex-1 ml-4 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {product.brand && (
                  <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                )}
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-sm leading-tight hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                </Link>
                {product.rating > 0 && (
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= product.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviewCount})</span>
                  </div>
                )}
              </div>
              <div className="text-right ml-2">
                <div className="text-lg font-bold text-green-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
                {product.comparePrice && (
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.comparePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                className="w-full"
                disabled={isOutOfStock}
                variant={isOutOfStock ? 'secondary' : 'default'}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view (default)
  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.featured && (
            <Badge variant="destructive" className="text-xs">
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="secondary" className="text-xs bg-green-500 text-white">
              {discountPercentage}% OFF
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-xs bg-gray-500">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-600">{product.brand}</p>
          )}

          {/* Product name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm leading-tight hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= product.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
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

          {/* EMI info */}
          <p className="text-xs text-gray-600">
            EMI from ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={isOutOfStock}
          variant={isOutOfStock ? 'secondary' : 'default'}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}