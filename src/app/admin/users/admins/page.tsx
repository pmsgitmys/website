'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, UserPlus, Key, Activity, AlertCircle } from 'lucide-react'

const adminUsers = [
  { id: 1, name: 'Rajesh Kumar', role: 'Super Admin', email: 'rajesh@phonemax.in', lastActive: '2 mins ago', status: 'online' },
  { id: 2, name: 'Priya Sharma', role: 'Sales Manager', email: 'priya@phonemax.in', lastActive: '1 hour ago', status: 'away' },
  { id: 3, name: 'Amit Patel', role: 'Inventory Manager', email: 'amit@phonemax.in', lastActive: '5 hours ago', status: 'offline' },
  { id: 4, name: 'Sunita Reddy', role: 'Customer Support', email: 'sunita@phonemax.in', lastActive: '10 mins ago', status: 'online' },
  { id: 5, name: 'Vikram Singh', role: 'Marketing Lead', email: 'vikram@phonemax.in', lastActive: 'Yesterday', status: 'offline' },
]

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin User Management</h1>
          <p className="text-gray-500 mt-2">Manage admin access, roles, and permissions</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Total Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Online Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {adminUsers.filter(a => a.status === 'online').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Super Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500 mt-1">Full system access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <p className="text-xs text-gray-500 mt-1">Access requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">{admin.role}</div>
                    <div className="text-xs text-gray-500">Last active: {admin.lastActive}</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    admin.status === 'online' ? 'bg-green-500' :
                    admin.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
