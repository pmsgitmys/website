'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ShoppingBag,
  Heart,
  CreditCard,
  User,
  Package,
  Star,
  TrendingUp,
  Gift,
  MapPin,
  Bell,
  Smartphone,
  Award
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UserStats {
  totalOrders: number
  totalSpent: number
  rewardsPoints: number
  wishlistItems: number
  membershipTier: string
  recentOrders: any[]
  favoriteCategories: any[]
  recommendations: any[]
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin?callbackUrl=/dashboard')
      return
    }

    fetchUserData()
  }, [session, status, router])

  const fetchUserData = async () => {
    try {
      // Fetch actual customer data based on session
      const response = await fetch('/api/user/dashboard', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      } else {
        // Use customer mock data if API fails
        setUserStats({
          totalOrders: 3,
          totalSpent: 58997,
          rewardsPoints: 590,
          wishlistItems: 5,
          membershipTier: 'Silver',
          recentOrders: [
            { id: 'ORD-789', date: '2024-12-10', total: 29999, status: 'Delivered', items: 1 },
            { id: 'ORD-678', date: '2024-12-05', total: 18999, status: 'Shipped', items: 2 },
            { id: 'ORD-567', date: '2024-11-28', total: 9999, status: 'Delivered', items: 1 }
          ],
          favoriteCategories: [
            { name: 'Audio', purchases: 2, icon: '🎧' },
            { name: 'Accessories', purchases: 3, icon: '🔌' },
            { name: 'Smartphones', purchases: 1, icon: '📱' }
          ],
          recommendations: [
            { id: 1, name: 'Samsung Galaxy Buds2 Pro', price: 17999, image: '/api/placeholder/200/200', rating: 4.6 },
            { id: 2, name: 'OnePlus 12R', price: 39999, image: '/api/placeholder/200/200', rating: 4.5 },
            { id: 3, name: 'Sony WF-1000XM4', price: 19999, image: '/api/placeholder/200/200', rating: 4.7 }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // Customer mock data for error case
      setUserStats({
        totalOrders: 3,
        totalSpent: 58997,
        rewardsPoints: 590,
        wishlistItems: 5,
        membershipTier: 'Silver',
        recentOrders: [
          { id: 'ORD-789', date: '2024-12-10', total: 29999, status: 'Delivered', items: 1 },
          { id: 'ORD-678', date: '2024-12-05', total: 18999, status: 'Shipped', items: 2 },
          { id: 'ORD-567', date: '2024-11-28', total: 9999, status: 'Delivered', items: 1 }
        ],
        favoriteCategories: [
          { name: 'Audio', purchases: 2, icon: '🎧' },
          { name: 'Accessories', purchases: 3, icon: '🔌' },
          { name: 'Smartphones', purchases: 1, icon: '📱' }
        ],
        recommendations: [
          { id: 1, name: 'Samsung Galaxy Buds2 Pro', price: 17999, image: '/api/placeholder/200/200', rating: 4.6 },
          { id: 2, name: 'OnePlus 12R', price: 39999, image: '/api/placeholder/200/200', rating: 4.5 },
          { id: 3, name: 'Sony WF-1000XM4', price: 19999, image: '/api/placeholder/200/200', rating: 4.7 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      case 'Shipped': return 'bg-blue-100 text-blue-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800'
      case 'Silver': return 'bg-gray-100 text-gray-800'
      case 'Platinum': return 'bg-purple-100 text-purple-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* User Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-bold text-blue-600">PhoneMax</span>
                  <div className="text-xs text-gray-500">My Dashboard</div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Welcome back, {session?.user?.name}!
                </div>
                <div className="text-xs text-gray-500">
                  {userStats?.membershipTier} Member
                </div>
              </div>
              <Badge className={getTierColor(userStats?.membershipTier || 'Bronze')}>
                <Award className="h-3 w-3 mr-1" />
                {userStats?.membershipTier}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/account')}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              My Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats?.totalOrders}</div>
                  <p className="text-xs text-blue-200">
                    Lifetime purchases
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Total Spent</CardTitle>
                  <CreditCard className="h-4 w-4 text-green-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{userStats?.totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-green-200">
                    All time spending
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">Reward Points</CardTitle>
                  <Gift className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats?.rewardsPoints.toLocaleString()}</div>
                  <p className="text-xs text-purple-200">
                    Available to redeem
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-pink-100">Wishlist Items</CardTitle>
                  <Heart className="h-4 w-4 text-pink-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats?.wishlistItems}</div>
                  <p className="text-xs text-pink-200">
                    Saved for later
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userStats?.recentOrders.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/orders">
                      <Button variant="outline" className="w-full">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Shopping Insights */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Your Shopping Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Favorite Categories</h4>
                      <div className="space-y-2">
                        {userStats?.favoriteCategories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{category.icon}</span>
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <Badge variant="secondary">{category.purchases} purchases</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-green-600" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userStats?.recommendations.map((product, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Detailed order history interface will be implemented here</p>
                  <Link href="/orders" className="inline-block mt-4">
                    <Button>View All Orders</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Your saved items will appear here</p>
                  <Link href="/wishlist" className="inline-block mt-4">
                    <Button>View Wishlist</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Rewards & Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Rewards program interface will be implemented here</p>
                  <p className="mt-2">Current Points: <span className="font-bold text-purple-600">{userStats?.rewardsPoints}</span></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}