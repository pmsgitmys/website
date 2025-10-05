import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    comparePrice?: number
    images: { url: string; alt?: string }[]
    category: { name: string; slug: string }
    averageRating?: number
    reviewCount?: number
  }
  createdAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean

  // Actions
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        try {
          set({ isLoading: true })

          const response = await fetch('/api/wishlist')
          if (response.ok) {
            const data = await response.json()
            set({ items: data.items })
          } else if (response.status === 401) {
            // User not authenticated, clear wishlist
            set({ items: [] })
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      addToWishlist: async (productId: string) => {
        try {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
          })

          if (response.ok) {
            const data = await response.json()
            set(state => ({
              items: [data.item, ...state.items]
            }))
            return true
          } else {
            const error = await response.json()
            console.error('Error adding to wishlist:', error.error)
            return false
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error)
          return false
        }
      },

      removeFromWishlist: async (productId: string) => {
        try {
          const response = await fetch(`/api/wishlist?productId=${productId}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            set(state => ({
              items: state.items.filter(item => item.productId !== productId)
            }))
            return true
          } else {
            const error = await response.json()
            console.error('Error removing from wishlist:', error.error)
            return false
          }
        } catch (error) {
          console.error('Error removing from wishlist:', error)
          return false
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some(item => item.productId === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'phonemax-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)