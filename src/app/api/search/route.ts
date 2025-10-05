import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchProducts, getSearchSuggestions } from '@/lib/meilisearch'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const brand = searchParams.get('brand')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const enhanced = searchParams.get('enhanced') === 'true'

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        products: [],
        totalCount: 0,
        suggestions: [],
        categories: [],
        brands: []
      })
    }

    const skip = (page - 1) * limit

    // Build where clause (SQLite case-insensitive search)
    const searchQuery = query.toLowerCase()
    const where: any = {
      isActive: true,
      OR: [
        {
          name: {
            contains: searchQuery
          }
        },
        {
          description: {
            contains: searchQuery
          }
        },
        {
          brand: {
            contains: searchQuery
          }
        }
      ]
    }

    // Add filters
    if (category) {
      where.category = {
        slug: category
      }
    }

    if (brand) {
      where.brand = {
        contains: brand.toLowerCase()
      }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        // Relevance - prioritize exact name matches, then description matches
        orderBy = { name: 'asc' }
    }

    // Execute search using raw SQL for case-insensitive LIKE in SQLite
    const searchPattern = `%${searchQuery}%`

    let sqlWhere = `(LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?)) AND isActive = 1`
    const params: any[] = [searchPattern, searchPattern, searchPattern]

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } })
      if (cat) {
        sqlWhere += ` AND categoryId = ?`
        params.push(cat.id)
      }
    }

    if (brand) {
      sqlWhere += ` AND LOWER(brand) LIKE LOWER(?)`
      params.push(`%${brand}%`)
    }

    if (minPrice) {
      sqlWhere += ` AND price >= ?`
      params.push(parseFloat(minPrice))
    }

    if (maxPrice) {
      sqlWhere += ` AND price <= ?`
      params.push(parseFloat(maxPrice))
    }

    // Get sort column
    let orderBySQL = 'name ASC'
    switch (sortBy) {
      case 'price-low':
        orderBySQL = 'price ASC'
        break
      case 'price-high':
        orderBySQL = 'price DESC'
        break
      case 'name':
        orderBySQL = 'name ASC'
        break
      case 'newest':
        orderBySQL = 'createdAt DESC'
        break
    }

    const products = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM products WHERE ${sqlWhere} ORDER BY ${orderBySQL} LIMIT ? OFFSET ?`,
      ...params,
      limit,
      skip
    )

    const totalCountResult = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
      `SELECT COUNT(*) as count FROM products WHERE ${sqlWhere}`,
      ...params
    )
    const totalCount = Number(totalCountResult[0]?.count || 0n)

    // Fetch related category and images for each product
    const productsWithRelations = await Promise.all(
      products.map(async (product) => ({
        ...product,
        category: await prisma.category.findUnique({ where: { id: product.categoryId } }),
        images: await prisma.productImage.findMany({ where: { productId: product.id } })
      }))
    )

    // Get search suggestions (similar product names)
    const suggestions = await prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: searchQuery
        }
      },
      select: {
        name: true
      },
      take: 5,
      distinct: ['name']
    })

    // Get categories that have matching products
    const matchingCategories = await prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            isActive: true,
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { brand: { contains: searchQuery } }
            ]
          }
        }
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                OR: [
                  { name: { contains: searchQuery } },
                  { description: { contains: searchQuery } },
                  { brand: { contains: searchQuery } }
                ]
              }
            }
          }
        }
      }
    })

    // Get brands that have matching products
    const matchingBrands = await prisma.product.groupBy({
      by: ['brand'],
      where: {
        isActive: true,
        brand: { not: null },
        OR: [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
          { brand: { contains: searchQuery } }
        ]
      },
      _count: {
        brand: true
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    // Format results for enhanced search component
    const searchResults = enhanced
      ? productsWithRelations.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category?.name || '',
          url: `/products/${product.id}`,
          price: product.price
        }))
      : undefined

    return NextResponse.json({
      products: productsWithRelations,
      results: searchResults, // For enhanced search component
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      suggestions: suggestions.map(s => s.name),
      categories: matchingCategories.map(c => ({
        name: c.name,
        slug: c.slug,
        count: c._count.products
      })),
      brands: matchingBrands.map(b => ({
        name: b.brand,
        count: b._count.brand
      })),
      query,
      filters: {
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}