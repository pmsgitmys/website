import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  getRecommendationsForUser,
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getTrendingProducts,
  getCategoryRecommendations
} from '@/lib/recommendations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'trending'
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '8')

    let recommendations = []

    switch (type) {
      case 'user':
        const session = await getServerSession(authOptions)
        if (session?.user?.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email }
          })
          if (user) {
            recommendations = await getRecommendationsForUser(user.id, limit)
          }
        }
        // Fallback to trending if no user session
        if (recommendations.length === 0) {
          recommendations = await getTrendingProducts(limit)
        }
        break

      case 'frequently-bought-together':
        if (!productId) {
          return NextResponse.json(
            { error: 'Product ID is required for frequently bought together recommendations' },
            { status: 400 }
          )
        }
        recommendations = await getFrequentlyBoughtTogether(productId, limit)
        break

      case 'similar':
        if (!productId) {
          return NextResponse.json(
            { error: 'Product ID is required for similar product recommendations' },
            { status: 400 }
          )
        }
        recommendations = await getSimilarProducts(productId, limit)
        break

      case 'category':
        if (!categoryId) {
          return NextResponse.json(
            { error: 'Category ID is required for category recommendations' },
            { status: 400 }
          )
        }
        recommendations = await getCategoryRecommendations(categoryId, productId || undefined, limit)
        break

      case 'trending':
      default:
        recommendations = await getTrendingProducts(limit)
        break
    }

    return NextResponse.json({
      type,
      recommendations,
      count: recommendations.length
    })

  } catch (error) {
    console.error('Error getting recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}