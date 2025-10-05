'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from './button'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/store/wishlist'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  showText?: boolean
}

export function WishlistButton({
  productId,
  size = 'md',
  variant = 'outline',
  className,
  showText = false
}: WishlistButtonProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()

  const inWishlist = isInWishlist(productId)

  const handleToggleWishlist = async () => {
    if (!session) {
      toast.error('Please sign in to add items to your wishlist')
      return
    }

    setIsLoading(true)

    try {
      let success = false

      if (inWishlist) {
        success = await removeFromWishlist(productId)
        if (success) {
          toast.success('Removed from wishlist')
        }
      } else {
        success = await addToWishlist(productId)
        if (success) {
          toast.success('Added to wishlist')
        }
      }

      if (!success) {
        toast.error('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={inWishlist ? 'default' : variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        'transition-colors',
        inWishlist && 'bg-red-500 hover:bg-red-600 text-white',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          showText && 'mr-2',
          inWishlist && 'fill-current'
        )}
      />
      {showText && (inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
    </Button>
  )
}