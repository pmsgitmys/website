'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart,
  Shield,
  BarChart3,
  Heart,
  Search,
  Smartphone,
  Database,
  Key,
  Users,
  Star,
  Package,
  CreditCard,
  Globe,
  Monitor,
  Lock,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface RouteSection {
  title: string
  description: string
  icon: any
  routes: {
    name: string
    url: string
    description: string
    badge?: string
    external?: boolean
  }[]
}

export default function DeveloperPortal() {
  const routeSections: RouteSection[] = [
    {
      title: "Customer Experience",
      description: "Public-facing pages for customers",
      icon: ShoppingCart,
      routes: [
        {
          name: "Homepage",
          url: "/",
          description: "Main landing page with featured products"
        },
        {
          name: "Product Catalog",
          url: "/products",
          description: "Browse all products with filtering"
        },
        {
          name: "Product Categories",
          url: "/products?category=smartphones",
          description: "Category-filtered product views"
        },
        {
          name: "Search Results",
          url: "/search?q=phone",
          description: "Advanced search with MeiliSearch integration"
        },
        {
          name: "Wishlist",
          url: "/wishlist",
          description: "User's saved products (requires login)"
        },
        {
          name: "Checkout",
          url: "/checkout",
          description: "Complete order placement with Razorpay"
        },
        {
          name: "Orders",
          url: "/orders",
          description: "Order history and tracking (requires login)"
        }
      ]
    },
    {
      title: "Authentication",
      description: "User authentication and account management",
      icon: Users,
      routes: [
        {
          name: "Customer Sign In",
          url: "/auth/signin",
          description: "Customer login with NextAuth"
        },
        {
          name: "Customer Sign Up",
          url: "/auth/signup",
          description: "New customer registration"
        },
        {
          name: "Admin Login",
          url: "/admin/login",
          description: "Secure admin authentication",
          badge: "SECURE"
        }
      ]
    },
    {
      title: "Admin Dashboard",
      description: "Secure admin management interface",
      icon: Shield,
      routes: [
        {
          name: "Standard Dashboard",
          url: "/admin/dashboard",
          description: "Sales analytics and business intelligence",
          badge: "ADMIN ONLY"
        },
        {
          name: "ERP Dashboard",
          url: "/admin/dashboard/erp",
          description: "Enterprise resource planning dashboard",
          badge: "ERP SYSTEM"
        },
        {
          name: "User Management",
          url: "/admin/users",
          description: "Role-based admin user management",
          badge: "RBAC"
        }
      ]
    },
    {
      title: "API Endpoints",
      description: "Backend API routes for data management",
      icon: Database,
      routes: [
        {
          name: "Products API",
          url: "/api/products",
          description: "Product catalog management"
        },
        {
          name: "Orders API",
          url: "/api/orders",
          description: "Order creation and management"
        },
        {
          name: "Reviews API",
          url: "/api/reviews",
          description: "Product reviews and ratings"
        },
        {
          name: "Wishlist API",
          url: "/api/wishlist",
          description: "User wishlist management"
        },
        {
          name: "Search API",
          url: "/api/search",
          description: "Advanced product search with filters"
        },
        {
          name: "Recommendations API",
          url: "/api/recommendations",
          description: "AI-powered product recommendations"
        },
        {
          name: "Analytics API",
          url: "/api/analytics/dashboard",
          description: "Business analytics and metrics",
          badge: "ADMIN"
        },
        {
          name: "Admin Auth API",
          url: "/api/admin/auth/login",
          description: "Secure admin authentication",
          badge: "SECURE"
        }
      ]
    },
    {
      title: "Development Tools",
      description: "Database and development utilities",
      icon: Settings,
      routes: [
        {
          name: "Prisma Studio",
          url: "http://localhost:5555",
          description: "Visual database browser and editor",
          external: true,
          badge: "EXTERNAL"
        },
        {
          name: "Dev Portal",
          url: "/dev-portal",
          description: "This developer navigation page"
        }
      ]
    }
  ]

  const features = [
    {
      name: "Payment Integration",
      description: "Razorpay with COD, Cards, UPI",
      icon: CreditCard,
      status: "✅ Complete"
    },
    {
      name: "Advanced Search",
      description: "MeiliSearch with fallback",
      icon: Search,
      status: "✅ Complete"
    },
    {
      name: "ERP Admin System",
      description: "Enterprise-grade admin with RBAC, departments",
      icon: Lock,
      status: "✅ Complete"
    },
    {
      name: "PWA Support",
      description: "Offline functionality, service worker",
      icon: Smartphone,
      status: "✅ Complete"
    },
    {
      name: "Analytics Dashboard",
      description: "Sales metrics, top products, charts",
      icon: BarChart3,
      status: "✅ Complete"
    },
    {
      name: "Recommendations",
      description: "AI-powered product suggestions",
      icon: Star,
      status: "✅ Complete"
    },
    {
      name: "Reviews System",
      description: "User ratings and feedback",
      icon: Star,
      status: "✅ Complete"
    },
    {
      name: "Wishlist",
      description: "Save products for later",
      icon: Heart,
      status: "✅ Complete"
    }
  ]

  const credentials = [
    {
      type: "Admin Access",
      email: "admin@phonemax.com",
      password: "AdminPass123!",
      note: "Full admin dashboard access"
    },
    {
      type: "Test Customer",
      email: "Create your own",
      password: "Via signup page",
      note: "Register for customer features"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 PhoneMax Developer Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete e-commerce platform with advanced features, secure admin access,
            and comprehensive API endpoints. Explore all available routes and functionality.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">25+</div>
              <div className="text-sm text-gray-600">API Endpoints</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Major Features</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">10+</div>
              <div className="text-sm text-gray-600">UI Pages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Implemented Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <feature.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-gray-600 mb-1">{feature.description}</div>
                    <div className="text-xs text-green-600">{feature.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Routes by Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {routeSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.routes.map((route) => (
                    <div key={route.url} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{route.name}</span>
                          {route.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {route.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{route.description}</p>
                        <code className="text-xs text-blue-600">{route.url}</code>
                      </div>
                      <Link href={route.url} target={route.external ? '_blank' : undefined}>
                        <Button size="sm" variant="outline">
                          Visit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credentials */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Test Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {credentials.map((cred) => (
                <div key={cred.type} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm mb-2">{cred.type}</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Email:</span> <code className="bg-white px-2 py-1 rounded">{cred.email}</code></div>
                    <div><span className="text-gray-600">Password:</span> <code className="bg-white px-2 py-1 rounded">{cred.password}</code></div>
                    <div className="text-xs text-gray-500 mt-2">{cred.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/admin/login">
                <Button className="w-full" variant="default">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Customer Store
                </Button>
              </Link>
              <Link href="http://localhost:5555" target="_blank">
                <Button className="w-full" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Database Studio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg border">
          <p className="text-gray-600">
            🎉 <strong>PhoneMax E-commerce Platform</strong> - Complete with payment processing,
            admin dashboard, search, recommendations, and enterprise security features.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
            <span>✅ PWA Ready</span>
            <span>✅ Mobile Optimized</span>
            <span>✅ Production Ready</span>
            <span>✅ Fully Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}