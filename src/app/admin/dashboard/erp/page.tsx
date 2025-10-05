'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Overview } from '@/components/admin/overview'
import { RecentOrders } from '@/components/admin/recent-orders'
import { TopProducts } from '@/components/admin/top-products'
import {
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Building,
  UserCheck,
  Calendar,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function ERPDashboard() {
  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ERP Dashboard</h2>
          <p className="text-muted-foreground">
            Enterprise resource planning overview and key performance indicators
          </p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-blue-900">System Status: Operational</p>
                <p className="text-sm text-blue-700">All services running normally. Last backup: 2 hours ago</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,56,789</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+20.1%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Target: ₹5,00,000</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+15.2%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Departments: Sales, IT, Finance</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Processing</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3 text-orange-500" />
              <span className="text-orange-500">47</span>
              <span className="ml-1">pending approval</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Avg. processing: 2.3 hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 h-3 w-3 text-red-500" />
              <span className="text-red-500">12</span>
              <span className="ml-1">low stock alerts</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Reorder points set</div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Sales Department
            </CardTitle>
            <CardDescription>Current month performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Revenue Target</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">91% Complete</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹4,56,789 / ₹5,00,000</span>
                <span>9 days left</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span>Team Members: 12</span>
                  <span>Active Orders: 156</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Inventory Management
            </CardTitle>
            <CardDescription>Stock levels and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stock Health</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Needs Attention</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>In Stock: 177 items</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Low Stock: 12 items</span>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex justify-between">
                  <span>Out of Stock: 0 items</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span>Categories: 4</span>
                  <span>Total Products: 189</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              System Security
            </CardTitle>
            <CardDescription>Security status and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Security Score</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Sessions: 23</span>
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex justify-between">
                  <span>Failed Logins: 2 today</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>2FA Enabled: 87%</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span>Admin Users: 8</span>
                  <span>Last Audit: Today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Revenue Analytics
            </CardTitle>
            <CardDescription>
              Monthly revenue trend and forecasting
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              System Notifications
            </CardTitle>
            <CardDescription>
              Recent system events and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Order #1234 approved by Sales Dept</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Inventory alert: iPhone 15 Pro - Reorder required</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New admin user added to Finance Dept</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="h-4 w-4 text-purple-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Monthly financial report auto-generated</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Security scan completed - No threats</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Modules & Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Department Overview
            </CardTitle>
            <CardDescription>
              Cross-departmental performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Sales Department</p>
                    <p className="text-xs text-gray-500">12 members • Target: 91%</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Inventory Management</p>
                    <p className="text-xs text-gray-500">8 members • Health: Good</p>
                  </div>
                </div>
                <Badge variant="secondary">Monitoring</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Finance Department</p>
                    <p className="text-xs text-gray-500">5 members • Reports: Current</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Customer Service</p>
                    <p className="text-xs text-gray-500">6 members • Satisfaction: 94%</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              User Management Insights
            </CardTitle>
            <CardDescription>
              Role-based access and permissions overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">31</div>
                  <div className="text-xs text-blue-700">Total Admin Users</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2,847</div>
                  <div className="text-xs text-green-700">Customer Accounts</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Super Admins: 2</span>
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Department Managers: 8</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Employees: 21</span>
                  <Badge variant="secondary" className="text-xs">Standard</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Locked Accounts: 3</span>
                  <Badge variant="outline" className="text-xs">Security</Badge>
                </div>
              </div>
              <div className="pt-2 border-t">
                <Link href="/admin/users/roles">
                  <Button size="sm" variant="outline" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Roles & Permissions
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Enterprise Module Access
          </CardTitle>
          <CardDescription>
            Quick access to critical ERP modules and functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/admin/sales">
              <Button variant="outline" size="sm" className="h-auto p-4 flex flex-col items-center w-full">
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">Sales Management</span>
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button variant="outline" size="sm" className="h-auto p-4 flex flex-col items-center w-full">
                <Package className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">Inventory Control</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" size="sm" className="h-auto p-4 flex flex-col items-center w-full">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">User Management</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm" className="h-auto p-4 flex flex-col items-center w-full">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">Analytics Hub</span>
              </Button>
            </Link>
            <Link href="/admin/finance">
              <Button variant="outline" size="sm" className="h-auto p-4 flex flex-col items-center w-full">
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">Finance Module</span>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" size="sm" className="h-auto p-4 flex flex-col items-center w-full">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">System Config</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}