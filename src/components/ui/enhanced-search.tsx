'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Smartphone, Laptop, Headphones, Package, TrendingUp, Clock } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SearchResult {
  id: string
  name: string
  type: 'product' | 'category' | 'brand'
  price?: number
  category?: string
  url: string
}

interface EnhancedSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnhancedSearch({ open, onOpenChange }: EnhancedSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('phonemax_recent_searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&enhanced=true`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchResults, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (item: SearchResult | string) => {
    if (typeof item === 'string') {
      // Handle recent search selection
      setQuery(item)
      router.push(`/search?q=${encodeURIComponent(item)}`)
    } else {
      // Handle search result selection
      router.push(item.url)

      // Add to recent searches
      const newRecent = [item.name, ...recentSearches.filter(s => s !== item.name)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('phonemax_recent_searches', JSON.stringify(newRecent))
    }
    onOpenChange(false)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />
      case 'category':
        return <Smartphone className="h-4 w-4" />
      case 'brand':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const quickActions = [
    { label: "Browse Smartphones", url: "/products?category=smartphones", icon: <Smartphone className="h-4 w-4" /> },
    { label: "Browse Laptops", url: "/products?category=laptops", icon: <Laptop className="h-4 w-4" /> },
    { label: "Browse Audio", url: "/products?category=audio", icon: <Headphones className="h-4 w-4" /> },
    { label: "View All Products", url: "/products", icon: <Package className="h-4 w-4" /> },
  ]

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for products, brands, or categories..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!query && (
          <>
            {recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((search, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(search)}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandSeparator />

            <CommandGroup heading="Quick Actions">
              {quickActions.map((action, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    router.push(action.url)
                    onOpenChange(false)
                  }}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {query && loading && (
          <CommandEmpty>
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Searching...
            </div>
          </CommandEmpty>
        )}

        {query && !loading && results.length === 0 && (
          <CommandEmpty>
            <div className="text-center py-6">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No results found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords or browse categories</p>
            </div>
          </CommandEmpty>
        )}

        {query && results.length > 0 && (
          <>
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center justify-between gap-2 py-3"
                >
                  <div className="flex items-center gap-3">
                    {getResultIcon(result.type)}
                    <div className="flex flex-col">
                      <span className="font-medium">{result.name}</span>
                      {result.category && (
                        <span className="text-xs text-gray-500">{result.category}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.price && (
                      <span className="font-semibold text-green-600">
                        ₹{result.price.toLocaleString('en-IN')}
                      </span>
                    )}
                    <Badge variant="secondary" className="capitalize">
                      {result.type}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {results.length >= 5 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`)
                      onOpenChange(false)
                    }}
                    className="flex items-center gap-2 py-3 text-blue-600 font-medium"
                  >
                    <Search className="h-4 w-4" />
                    <span>View all results for "{query}"</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

// Search trigger button component
export function SearchTrigger({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpen()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [onOpen])

  return (
    <Button
      variant="outline"
      className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      onClick={onOpen}
    >
      <Search className="mr-2 h-4 w-4" />
      <span className="hidden lg:inline-flex">Search products...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}