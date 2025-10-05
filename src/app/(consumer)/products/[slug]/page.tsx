import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Phone,
  ChevronRight,
  Check,
  Minus,
  Plus
} from 'lucide-react'
import { ProductCard } from '@/components/ui/product-card'
import { prisma } from '@/lib/db'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: true,
      inventory: true,
      reviews: true,
      attributes: {
        include: {
          attribute: true
        }
      },
      variants: {
        include: {
          images: true,
          inventory: true
        }
      }
    }
  })

  if (!product || !product.published) {
    return null
  }

  return product
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      published: true,
      id: { not: currentProductId }
    },
    include: {
      brand: true,
      images: true,
      inventory: true,
      reviews: true
    },
    take: 4
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const isInStock = product.inventory && product.inventory.quantity > 0
  const isLowStock = product.inventory && product.inventory.quantity < 10

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image
              src={product.images[0]?.url || '/placeholder-product.jpg'}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover"
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                Featured
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 right-4 bg-green-500">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75">
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand and Name */}
          <div>
            {product.brand && (
              <p className="text-blue-600 font-medium mb-2">{product.brand.name}</p>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {averageRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-gray-600">
              EMI from ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {isInStock ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">
                  {isLowStock ? `Only ${product.inventory?.quantity} left in stock` : 'In Stock'}
                </span>
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-red-600" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Key Features */}
          {product.attributes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.attributes.slice(0, 6).map((attr, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{attr.attribute.name}:</span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button
                className="flex-1"
                size="lg"
                disabled={!isInStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {isInStock && (
              <Button variant="secondary" size="lg" className="w-full">
                Buy Now - Same Day Delivery in Mysore
              </Button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Free Delivery</p>
              <p className="text-xs text-gray-600">Same day in Mysore</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Genuine Product</p>
              <p className="text-xs text-gray-600">Official warranty</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600">7-day policy</p>
            </div>
          </div>

          {/* Call Store */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Want to see it in person?</p>
                  <p className="text-sm text-blue-700">Visit our store or call us</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Description */}
      <div className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {product.description ? (
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              ) : (
                <p className="text-gray-500">No description available for this product.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Reviews */}
      {product.reviews.length > 0 && (
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews ({product.reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <div key={index}>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.customerName || 'Anonymous'}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-1">{review.title}</h4>
                    )}
                    {review.content && (
                      <p className="text-gray-700 text-sm">{review.content}</p>
                    )}
                    {index < product.reviews.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}