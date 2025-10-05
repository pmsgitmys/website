import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For demo purposes, we'll assume all users can access analytics
    // In production, you'd check for admin role

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get total sales and revenue
    const totalSales = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: {
          in: ['PAID', 'CONFIRMED', 'DELIVERED']
        },
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get sales by status
    const salesByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get top-selling products (simplified to avoid groupBy issues)
    let topProducts = []
    let topProductsWithDetails = []

    try {
      const topProductsRaw = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
        },
        _count: {
          productId: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 10,
        where: {
          order: {
            createdAt: {
              gte: startDate,
            },
            status: {
              in: ['PAID', 'CONFIRMED', 'DELIVERED']
            }
          },
        },
      })

      // Get product details for top products
      if (topProductsRaw.length > 0) {
        const productIds = topProductsRaw.map(item => item.productId)
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          include: {
            images: {
              take: 1,
            },
          },
        })

        topProductsWithDetails = topProductsRaw.map(item => {
          const product = products.find(p => p.id === item.productId)
          return {
            ...item,
            product,
            _count: { id: item._count.productId }
          }
        })
      }
    } catch (error) {
      console.error('Error fetching top products:', error)
      // Use fallback data
      topProductsWithDetails = []
    }

    // Get daily sales for chart
    const dailySales = await prisma.$queryRaw`
      SELECT
        DATE(createdAt) as date,
        COUNT(*) as orders,
        SUM(totalAmount) as revenue
      FROM orders
      WHERE createdAt >= ${startDate}
        AND status IN ('PAID', 'CONFIRMED', 'DELIVERED')
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt)
    `

    // Get user registration stats
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get inventory alerts (low stock products)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10, // Alert when stock is 10 or below
        },
        isActive: true,
      },
      include: {
        images: {
          take: 1,
        },
      },
      orderBy: {
        stock: 'asc',
      },
      take: 10,
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
          },
        },
      },
    })

    // Calculate growth rates (comparing to previous period)
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(period))

    const previousPeriodSales = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: {
          in: ['PAID', 'CONFIRMED', 'DELIVERED']
        },
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    const revenueGrowth = previousPeriodSales._sum.totalAmount
      ? ((totalSales._sum.totalAmount || 0) - (previousPeriodSales._sum.totalAmount || 0)) / (previousPeriodSales._sum.totalAmount || 1) * 100
      : 0

    const ordersGrowth = previousPeriodSales._count.id
      ? ((totalSales._count.id || 0) - (previousPeriodSales._count.id || 0)) / (previousPeriodSales._count.id || 1) * 100
      : 0

    return NextResponse.json({
      summary: {
        totalRevenue: totalSales._sum.totalAmount || 0,
        totalOrders: totalSales._count.id || 0,
        newUsers,
        revenueGrowth: Number(revenueGrowth.toFixed(1)),
        ordersGrowth: Number(ordersGrowth.toFixed(1)),
      },
      salesByStatus,
      topProducts: topProductsWithDetails,
      dailySales,
      lowStockProducts,
      recentOrders,
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}