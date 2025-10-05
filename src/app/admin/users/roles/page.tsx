'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Plus, Users, Key, Lock } from 'lucide-react'

const roles = [
  { name: 'Super Admin', users: 1, permissions: 'Full Access', color: 'red' },
  { name: 'Sales Manager', users: 2, permissions: 'Sales & Orders', color: 'blue' },
  { name: 'Inventory Manager', users: 2, permissions: 'Products & Stock', color: 'green' },
  { name: 'Customer Support', users: 3, permissions: 'Customer Care', color: 'purple' },
  { name: 'Marketing Lead', users: 1, permissions: 'Campaigns & Analytics', color: 'orange' },
  { name: 'Finance Manager', users: 1, permissions: 'Payments & Reports', color: 'indigo' },
]

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-gray-500 mt-2">Define access levels and user permissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Total Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-gray-500 mt-1">Defined access levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assigned Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.reduce((sum, r) => sum + r.users, 0)}</div>
            <p className="text-xs text-gray-500 mt-1">Staff with roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Custom Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length - 1}</div>
            <p className="text-xs text-gray-500 mt-1">Department specific</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-gray-500 mt-1">Available permissions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roles.map((role, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 text-${role.color}-600`} />
                  {role.name}
                </span>
                <span className="text-sm font-normal text-gray-500">{role.users} users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Access Scope</span>
                  <span className="text-sm font-medium">{role.permissions}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Edit Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
