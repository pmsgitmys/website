'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  BarChart3,
  FileBarChart,
  Settings,
  DollarSign,
  Megaphone,
  Shield,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Module {
  name: string
  href: string
  icon: any
  badge?: string
  children?: Module[]
}

const adminModules: Module[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Sales',
    href: '/admin/sales',
    icon: ShoppingCart,
    children: [
      { name: 'Orders', href: '/admin/sales/orders', icon: FileText },
      { name: 'Invoices', href: '/admin/sales/invoices', icon: FileBarChart },
      { name: 'Customers', href: '/admin/sales/customers', icon: Users },
    ],
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: Package,
    children: [
      { name: 'Products', href: '/admin/inventory/products', icon: Package },
      { name: 'Categories', href: '/admin/inventory/categories', icon: Package },
      { name: 'Stock Management', href: '/admin/inventory/stock', icon: Package },
    ],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    children: [
      { name: 'Customer Management', href: '/admin/users/customers', icon: Users },
      { name: 'Admin Users', href: '/admin/users/admins', icon: Shield },
      { name: 'Roles & Permissions', href: '/admin/users/roles', icon: Shield },
      { name: 'Departments', href: '/admin/users/departments', icon: Users },
    ],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { name: 'Sales Analytics', href: '/admin/analytics/sales', icon: BarChart3 },
      { name: 'Product Analytics', href: '/admin/analytics/products', icon: Package },
      { name: 'Customer Analytics', href: '/admin/analytics/customers', icon: Users },
    ],
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileBarChart,
    children: [
      { name: 'Sales Reports', href: '/admin/reports/sales', icon: FileBarChart },
      { name: 'Inventory Reports', href: '/admin/reports/inventory', icon: Package },
      { name: 'Financial Reports', href: '/admin/reports/financial', icon: DollarSign },
    ],
  },
  {
    name: 'Finance',
    href: '/admin/finance',
    icon: DollarSign,
    children: [
      { name: 'Payments', href: '/admin/finance/payments', icon: DollarSign },
      { name: 'Revenue', href: '/admin/finance/revenue', icon: BarChart3 },
      { name: 'Expenses', href: '/admin/finance/expenses', icon: FileText },
    ],
  },
  {
    name: 'Marketing',
    href: '/admin/marketing',
    icon: Megaphone,
    children: [
      { name: 'Campaigns', href: '/admin/marketing/campaigns', icon: Megaphone },
      { name: 'Promotions', href: '/admin/marketing/promotions', icon: Megaphone },
      { name: 'Email Marketing', href: '/admin/marketing/email', icon: Megaphone },
    ],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    children: [
      { name: 'System Config', href: '/admin/settings/system', icon: Settings },
      { name: 'Security', href: '/admin/settings/security', icon: Shield },
      { name: 'Audit Logs', href: '/admin/settings/audit', icon: FileText },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>(['Dashboard'])
  const pathname = usePathname()

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(name => name !== moduleName)
        : [...prev, moduleName]
    )
  }

  const isActiveLink = (href: string) => {
    return pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">PhoneMax</span>
              <div className="text-sm text-gray-500">Admin Portal</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {adminModules.map((module) => (
              <div key={module.name}>
                {module.children ? (
                  <div>
                    <button
                      onClick={() => toggleModule(module.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        expandedModules.includes(module.name)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <module.icon className="h-5 w-5" />
                        <span>{module.name}</span>
                        {module.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {module.badge}
                          </Badge>
                        )}
                      </div>
                      {expandedModules.includes(module.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedModules.includes(module.name) && (
                      <div className="ml-6 mt-2 space-y-1">
                        {module.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActiveLink(child.href)
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={module.href}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActiveLink(module.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <module.icon className="h-5 w-5" />
                    <span>{module.name}</span>
                    {module.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {module.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-xs text-gray-500 text-center">
            PhoneMax ERP v1.0
            <br />
            Enterprise Admin Portal
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Enterprise Resource Planning System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">Admin User</div>
                    <div className="text-xs text-gray-500">SUPER_ADMIN</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Security Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}