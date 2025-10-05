import { prisma } from './prisma'

interface Product {
  id: string
  name: string
  price: number
  comparePrice?: number
  categoryId: string
  brand?: string
  images: { url: string; alt?: string }[]
  category: { name: string; slug: string }
}

// Get recommended products based on user behavior
export async function getRecommendationsForUser(userId: string, limit: number = 10): Promise<Product[]> {
  try {
    // Get user's order history to understand preferences
    const userOrders = await prisma.order.findMany({
      where: {
        userId,
        status: {
          in: ['PAID', 'CONFIRMED', 'DELIVERED']
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    // Get user's wishlist to understand interests
    const userWishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    // Extract categories and brands user is interested in
    const preferredCategories = new Set<string>()
    const preferredBrands = new Set<string>()
    const purchasedProductIds = new Set<string>()

    // From orders
    userOrders.forEach(order => {
      order.items.forEach(item => {
        preferredCategories.add(item.product.categoryId)
        if (item.product.brand) {
          preferredBrands.add(item.product.brand)
        }
        purchasedProductIds.add(item.product.id)
      })
    })

    // From wishlist
    userWishlist.forEach(item => {
      preferredCategories.add(item.product.categoryId)
      if (item.product.brand) {
        preferredBrands.add(item.product.brand)
      }
    })

    // Build recommendation query
    const whereConditions: any = {
      isActive: true,
      id: {
        notIn: Array.from(purchasedProductIds)
      }
    }

    if (preferredCategories.size > 0 || preferredBrands.size > 0) {
      whereConditions.OR = []

      if (preferredCategories.size > 0) {
        whereConditions.OR.push({
          categoryId: {
            in: Array.from(preferredCategories)
          }
        })
      }

      if (preferredBrands.size > 0) {
        whereConditions.OR.push({
          brand: {
            in: Array.from(preferredBrands)
          }
        })
      }
    }

    const recommendations = await prisma.product.findMany({
      where: whereConditions,
      include: {
        images: true,
        category: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }, // Prefer newer products
        { price: 'asc' } // Then by price
      ],
      take: limit
    })

    return recommendations.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0
    }))

  } catch (error) {
    console.error('Error getting user recommendations:', error)
    return []
  }
}

// Get products frequently bought together
export async function getFrequentlyBoughtTogether(productId: string, limit: number = 4): Promise<Product[]> {
  try {
    // Find orders that contain this product
    const ordersWithProduct = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId
          }
        },
        status: {
          in: ['PAID', 'CONFIRMED', 'DELIVERED']
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      }
    })

    // Count frequency of other products in these orders
    const productFrequency = new Map<string, { count: number; product: any }>()

    ordersWithProduct.forEach(order => {
      order.items.forEach(item => {
        if (item.productId !== productId) {
          const existing = productFrequency.get(item.productId)
          if (existing) {
            existing.count++
          } else {
            productFrequency.set(item.productId, {
              count: 1,
              product: item.product
            })
          }
        }
      })
    })

    // Sort by frequency and return top products
    const sortedProducts = Array.from(productFrequency.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => item.product)

    return sortedProducts

  } catch (error) {
    console.error('Error getting frequently bought together:', error)
    return []
  }
}

// Get similar products based on category and price range
export async function getSimilarProducts(productId: string, limit: number = 8): Promise<Product[]> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true
      }
    })

    if (!product) return []

    const priceRange = product.price * 0.3 // 30% price variation
    const minPrice = product.price - priceRange
    const maxPrice = product.price + priceRange

    const similarProducts = await prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        categoryId: product.categoryId,
        price: {
          gte: minPrice,
          lte: maxPrice
        }
      },
      include: {
        images: true,
        category: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return similarProducts.map(p => ({
      ...p,
      averageRating: p.reviews.length > 0
        ? p.reviews.reduce((sum, review) => sum + review.rating, 0) / p.reviews.length
        : 0
    }))

  } catch (error) {
    console.error('Error getting similar products:', error)
    return []
  }
}

// Get trending products based on recent orders and views
export async function getTrendingProducts(limit: number = 12): Promise<Product[]> {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get products with most orders in last 30 days
    const trendingProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 }
      },
      include: {
        images: true,
        category: true,
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: thirtyDaysAgo
                  },
                  status: {
                    in: ['PAID', 'CONFIRMED', 'DELIVERED']
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        {
          orderItems: {
            _count: 'desc'
          }
        },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return trendingProducts.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0
    }))

  } catch (error) {
    console.error('Error getting trending products:', error)
    return []
  }
}

// Get recommended products for category page
export async function getCategoryRecommendations(categoryId: string, excludeProductId?: string, limit: number = 8): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        stock: { gt: 0 },
        ...(excludeProductId && { id: { not: excludeProductId } })
      },
      include: {
        images: true,
        category: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' },
        { price: 'asc' }
      ],
      take: limit
    })

    return products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0
    }))

  } catch (error) {
    console.error('Error getting category recommendations:', error)
    return []
  }
}