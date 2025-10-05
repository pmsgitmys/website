import { MeiliSearch } from 'meilisearch'

// Initialize MeiliSearch client
export const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || '',
})

// Index names
export const PRODUCTS_INDEX = 'products'

// Initialize indexes and settings
export async function initializeSearchIndexes() {
  try {
    // Create products index
    const productsIndex = meiliClient.index(PRODUCTS_INDEX)

    // Configure searchable attributes
    await productsIndex.updateSearchableAttributes([
      'name',
      'description',
      'brand',
      'features',
      'specifications',
      'category.name'
    ])

    // Configure filterable attributes
    await productsIndex.updateFilterableAttributes([
      'categoryId',
      'brand',
      'price',
      'isActive',
      'stock'
    ])

    // Configure sortable attributes
    await productsIndex.updateSortableAttributes([
      'price',
      'createdAt',
      'name'
    ])

    // Configure displayed attributes
    await productsIndex.updateDisplayedAttributes([
      'id',
      'name',
      'description',
      'price',
      'comparePrice',
      'brand',
      'categoryId',
      'category',
      'sku',
      'stock',
      'features',
      'specifications',
      'images',
      'isActive',
      'createdAt'
    ])

    // Configure ranking rules
    await productsIndex.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'price:asc'
    ])

    console.log('MeiliSearch indexes initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing MeiliSearch indexes:', error)
    return false
  }
}

// Add or update products in search index
export async function indexProducts(products: any[]) {
  try {
    const productsIndex = meiliClient.index(PRODUCTS_INDEX)

    // Transform products for indexing
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      brand: product.brand,
      categoryId: product.categoryId,
      category: product.category,
      sku: product.sku,
      stock: product.stock,
      features: Array.isArray(product.features)
        ? product.features.join(' ')
        : typeof product.features === 'string'
        ? product.features
        : '',
      specifications: typeof product.specifications === 'object'
        ? Object.values(product.specifications).join(' ')
        : typeof product.specifications === 'string'
        ? product.specifications
        : '',
      images: product.images || [],
      isActive: product.isActive,
      createdAt: product.createdAt
    }))

    const result = await productsIndex.addDocuments(transformedProducts)
    console.log('Products indexed successfully:', result.taskUid)
    return result
  } catch (error) {
    console.error('Error indexing products:', error)
    throw error
  }
}

// Search products
export async function searchProducts(options: {
  query: string
  filters?: string[]
  sort?: string[]
  limit?: number
  offset?: number
  facets?: string[]
}) {
  try {
    const productsIndex = meiliClient.index(PRODUCTS_INDEX)

    const searchParams: any = {
      q: options.query,
      limit: options.limit || 20,
      offset: options.offset || 0,
    }

    if (options.filters && options.filters.length > 0) {
      searchParams.filter = options.filters
    }

    if (options.sort && options.sort.length > 0) {
      searchParams.sort = options.sort
    }

    if (options.facets && options.facets.length > 0) {
      searchParams.facets = options.facets
    }

    const results = await productsIndex.search(options.query, searchParams)
    return results
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

// Get search suggestions
export async function getSearchSuggestions(query: string) {
  try {
    const productsIndex = meiliClient.index(PRODUCTS_INDEX)

    const results = await productsIndex.search(query, {
      limit: 5,
      attributesToRetrieve: ['name', 'brand'],
      attributesToHighlight: ['name']
    })

    return results.hits.map((hit: any) => ({
      suggestion: hit.name,
      brand: hit.brand,
      highlighted: hit._formatted?.name || hit.name
    }))
  } catch (error) {
    console.error('Error getting search suggestions:', error)
    return []
  }
}

// Get search facets for filters
export async function getSearchFacets() {
  try {
    const productsIndex = meiliClient.index(PRODUCTS_INDEX)

    const results = await productsIndex.search('', {
      facets: ['brand', 'categoryId', 'price'],
      limit: 0
    })

    return results.facetDistribution
  } catch (error) {
    console.error('Error getting search facets:', error)
    return {}
  }
}