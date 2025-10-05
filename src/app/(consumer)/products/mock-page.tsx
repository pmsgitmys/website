'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ProductCard } from '@/components/ui/product-card'
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ChevronDown,
  Star
} from 'lucide-react'

// Mock data - in a real app, this would come from an API
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    price: 134900,
    comparePrice: 139900,
    images: [{ url: '/placeholder-phone.jpg', alt: 'iPhone 15 Pro' }],
    brand: { name: 'Apple' },
    inventory: { quantity: 25 },
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    featured: true,
    category: 'smartphones',
    attributes: [
      { name: 'Storage', value: '128GB' },
      { name: 'Color', value: 'Black' },
      { name: 'RAM', value: '8GB' }
    ]
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 129999,
    comparePrice: 134999,
    images: [{ url: '/placeholder-phone.jpg', alt: 'Galaxy S24 Ultra' }],
    brand: { name: 'Samsung' },
    inventory: { quantity: 20 },
    reviews: [{ rating: 5 }, { rating: 5 }],
    featured: true,
    category: 'smartphones',
    attributes: [
      { name: 'Storage', value: '256GB' },
      { name: 'Color', value: 'Black' },
      { name: 'RAM', value: '12GB' }
    ]
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    price: 84999,
    comparePrice: 89999,
    images: [{ url: '/placeholder-phone.jpg', alt: 'Pixel 8 Pro' }],
    brand: { name: 'Google' },
    inventory: { quantity: 15 },
    reviews: [{ rating: 4 }, { rating: 5 }],
    featured: false,
    category: 'smartphones',
    attributes: [
      { name: 'Storage', value: '128GB' },
      { name: 'Color', value: 'Blue' },
      { name: 'RAM', value: '12GB' }
    ]
  },
  {
    id: '4',
    name: 'MacBook Pro 16-inch M3',
    slug: 'macbook-pro-16-m3',
    price: 249900,
    comparePrice: 259900,
    images: [{ url: '/placeholder-laptop.jpg', alt: 'MacBook Pro' }],
    brand: { name: 'Apple' },
    inventory: { quantity: 8 },
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    featured: true,
    category: 'laptops',
    attributes: [
      { name: 'Storage', value: '512GB' },
      { name: 'Color', value: 'Silver' },
      { name: 'RAM', value: '16GB' }
    ]
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    price: 29990,
    comparePrice: 34990,
    images: [{ url: '/placeholder-headphones.jpg', alt: 'Sony WH-1000XM5' }],
    brand: { name: 'Sony' },
    inventory: { quantity: 30 },
    reviews: [{ rating: 5 }, { rating: 4 }],
    featured: true,
    category: 'audio',
    attributes: [
      { name: 'Color', value: 'Black' },
      { name: 'Type', value: 'Over-ear' }
    ]
  }
]

const categories = [
  { value: 'smartphones', label: 'Smartphones' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'audio', label: 'Audio' },
  { value: 'accessories', label: 'Accessories' }
]

const brands = [
  { value: 'apple', label: 'Apple' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'google', label: 'Google' },
  { value: 'sony', label: 'Sony' },
  { value: 'dell', label: 'Dell' }
]

const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']
const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB', '32GB']
const colors = ['Black', 'White', 'Blue', 'Red', 'Gold', 'Silver', 'Green', 'Purple']

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 300000])
  const [selectedStorage, setSelectedStorage] = useState<string[]>([])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter(product => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false
      }

      // Brand filter
      if (selectedBrands.length > 0 &&
          !selectedBrands.includes(product.brand?.name.toLowerCase() || '')) {
        return false
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      // Storage filter
      if (selectedStorage.length > 0) {
        const productStorage = product.attributes?.find(attr => attr.name === 'Storage')?.value
        if (!productStorage || !selectedStorage.includes(productStorage)) {
          return false
        }
      }

      // RAM filter
      if (selectedRAM.length > 0) {
        const productRAM = product.attributes?.find(attr => attr.name === 'RAM')?.value
        if (!productRAM || !selectedRAM.includes(productRAM)) {
          return false
        }
      }

      // Color filter
      if (selectedColors.length > 0) {
        const productColor = product.attributes?.find(attr => attr.name === 'Color')?.value
        if (!productColor || !selectedColors.includes(productColor)) {
          return false
        }
      }

      return true
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => {
          const avgA = a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
          const avgB = b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
          return avgB - avgA
        })
        break
      case 'newest':
        // For demo, sort by featured status
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured))
        break
      default: // popularity
        filtered.sort((a, b) => b.reviews.length - a.reviews.length)
    }

    return filtered
  }, [searchTerm, selectedCategory, selectedBrands, priceRange, selectedStorage, selectedRAM, selectedColors, sortBy])

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={selectedCategory === category.value}
                onCheckedChange={(checked) => {
                  setSelectedCategory(checked ? category.value : '')
                }}
              />
              <label htmlFor={category.value} className="text-sm cursor-pointer">
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.value} className="flex items-center space-x-2">
              <Checkbox
                id={brand.value}
                checked={selectedBrands.includes(brand.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand.value])
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand.value))
                  }
                }}
              />
              <label htmlFor={brand.value} className="text-sm cursor-pointer">
                {brand.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={300000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Storage */}
      <div>
        <h3 className="font-semibold mb-3">Storage</h3>
        <div className="space-y-2">
          {storageOptions.map((storage) => (
            <div key={storage} className="flex items-center space-x-2">
              <Checkbox
                id={storage}
                checked={selectedStorage.includes(storage)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStorage([...selectedStorage, storage])
                  } else {
                    setSelectedStorage(selectedStorage.filter(s => s !== storage))
                  }
                }}
              />
              <label htmlFor={storage} className="text-sm cursor-pointer">
                {storage}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* RAM */}
      <div>
        <h3 className="font-semibold mb-3">RAM</h3>
        <div className="space-y-2">
          {ramOptions.map((ram) => (
            <div key={ram} className="flex items-center space-x-2">
              <Checkbox
                id={ram}
                checked={selectedRAM.includes(ram)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRAM([...selectedRAM, ram])
                  } else {
                    setSelectedRAM(selectedRAM.filter(r => r !== ram))
                  }
                }}
              />
              <label htmlFor={ram} className="text-sm cursor-pointer">
                {ram}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-3">Colors</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={color}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColors([...selectedColors, color])
                  } else {
                    setSelectedColors(selectedColors.filter(c => c !== color))
                  }
                }}
              />
              <label htmlFor={color} className="text-sm cursor-pointer">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategory('')
          setSelectedBrands([])
          setPriceRange([0, 300000])
          setSelectedStorage([])
          setSelectedRAM([])
          setSelectedColors([])
        }}
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label || 'Products' : 'All Products'}
        </h1>
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span>Products</span>
          {selectedCategory && (
            <>
              <span className="mx-2">/</span>
              <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Toggle */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSection />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
            </div>
            <FilterSection />
          </Card>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {mockProducts.length} products
            </p>
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.value === selectedCategory)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory('')}
                  />
                </Badge>
              )}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                  {brands.find(b => b.value === brand)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">No products found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedBrands([])
                  setPriceRange([0, 300000])
                  setSelectedStorage([])
                  setSelectedRAM([])
                  setSelectedColors([])
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading products...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}