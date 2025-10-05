'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ProductCard } from '@/components/ui/product-card'
import {
  Search,
  Filter,
  X,
  Package,
  Loader2,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'

interface SearchResult {
  products: any[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  suggestions: string[]
  categories: { name: string; slug: string; count: number }[]
  brands: { name: string; count: number }[]
  query: string
  filters: {
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
  }
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || '')
  const [selectedBrand, setSelectedBrand] = useState(searchParams?.get('brand') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [sortBy, setSortBy] = useState(searchParams?.get('sortBy') || 'relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    const query = searchParams?.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('q', query)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedBrand) params.append('brand', selectedBrand)
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 200000) params.append('maxPrice', priceRange[1].toString())
      if (sortBy) params.append('sortBy', sortBy)
      params.append('page', page.toString())

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResult(data)
        setCurrentPage(page)

        // Update URL
        const newParams = new URLSearchParams(params)
        router.push(`/search?${newParams}`, { scroll: false })
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    performSearch(searchQuery)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    performSearch(searchQuery)
  }

  useEffect(() => {
    if (searchQuery && searchResult) {
      const timeoutId = setTimeout(() => {
        handleFilterChange()
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [selectedCategory, selectedBrand, priceRange, sortBy])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrand('')
    setPriceRange([0, 200000])
    setSortBy('relevance')
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search Suggestions */}
      {searchResult?.suggestions && searchResult.suggestions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Search Suggestions</h3>
          <div className="space-y-2">
            {searchResult.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => {
                  setSearchQuery(suggestion)
                  performSearch(suggestion)
                }}
              >
                <TrendingUp className="h-3 w-3 mr-2" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {searchResult?.categories && searchResult.categories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-categories"
                checked={selectedCategory === ''}
                onCheckedChange={() => setSelectedCategory('')}
              />
              <label htmlFor="all-categories" className="text-sm">All Categories</label>
            </div>
            {searchResult.categories.map(category => (
              <div key={category.slug} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={category.slug}
                    checked={selectedCategory === category.slug}
                    onCheckedChange={(checked) => {
                      setSelectedCategory(checked ? category.slug : '')
                    }}
                  />
                  <label htmlFor={category.slug} className="text-sm flex-1">{category.name}</label>
                </div>
                <Badge variant="secondary" className="text-xs">{category.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {searchResult?.brands && searchResult.brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-brands"
                checked={selectedBrand === ''}
                onCheckedChange={() => setSelectedBrand('')}
              />
              <label htmlFor="all-brands" className="text-sm">All Brands</label>
            </div>
            {searchResult.brands.map(brand => (
              <div key={brand.name} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={brand.name}
                    checked={selectedBrand === brand.name}
                    onCheckedChange={(checked) => {
                      setSelectedBrand(checked ? brand.name : '')
                    }}
                  />
                  <label htmlFor={brand.name} className="text-sm flex-1">{brand.name}</label>
                </div>
                <Badge variant="secondary" className="text-xs">{brand.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200000}
            min={0}
            step={1000}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Search</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 py-3 text-lg"
            />
            <Button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </form>

          {/* Results info and filters bar */}
          {searchResult && (
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="text-sm text-gray-600">
                {searchResult.totalCount > 0 ? (
                  <>
                    Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, searchResult.totalCount)} of {searchResult.totalCount} results for "<strong>{searchResult.query}</strong>"
                  </>
                ) : (
                  <>No results found for "<strong>{searchResult.query}</strong>"</>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {/* Mobile Filter Button */}
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Search Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSection />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {searchResult && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  Category: {searchResult.categories.find(c => c.slug === selectedCategory)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="gap-1">
                  Brand: {selectedBrand}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedBrand('')} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 200000) && (
                <Badge variant="secondary" className="gap-1">
                  ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 200000])} />
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          {searchResult && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterSection />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1">
            {loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Searching products...</p>
                </CardContent>
              </Card>
            )}

            {!loading && !searchResult && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start searching</h3>
                  <p className="text-gray-600">Enter a search term to find products</p>
                </CardContent>
              </Card>
            )}

            {!loading && searchResult && searchResult.products.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                    <Link href="/products">
                      <Button>Browse All Products</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && searchResult && searchResult.products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResult.products.map(product => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      comparePrice={product.comparePrice}
                      image={product.images[0]?.url || '/placeholder-product.jpg'}
                      brand={product.brand || ''}
                      inStock={product.stock > 0}
                      rating={4.5}
                      reviewCount={12}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {searchResult.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={!searchResult.hasPrevPage}
                      onClick={() => performSearch(searchQuery, currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                      Page {currentPage} of {searchResult.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!searchResult.hasNextPage}
                      onClick={() => performSearch(searchQuery, currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}