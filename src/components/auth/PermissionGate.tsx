'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AlertTriangle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PermissionGateProps {
  children: React.ReactNode
  module: string
  action: string
  resource?: string
  fallback?: React.ReactNode
  showError?: boolean
  requireDepartment?: string
}

interface PermissionCheck {
  allowed: boolean
  loading: boolean
  error?: string
}

export function PermissionGate({
  children,
  module,
  action,
  resource,
  fallback,
  showError = true,
  requireDepartment,
}: PermissionGateProps) {
  const { data: session, status } = useSession()
  const [permission, setPermission] = useState<PermissionCheck>({
    allowed: false,
    loading: true,
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      setPermission({ allowed: false, loading: false, error: 'Not authenticated' })
      return
    }

    checkPermission()
  }, [session, status, module, action, resource, requireDepartment])

  const checkPermission = async () => {
    try {
      setPermission({ allowed: false, loading: true })

      const params = new URLSearchParams({
        module,
        action,
        ...(resource && { resource }),
        ...(requireDepartment && { department: requireDepartment }),
      })

      const response = await fetch(`/api/admin/permissions/check?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPermission({ allowed: data.allowed, loading: false })
      } else {
        setPermission({
          allowed: false,
          loading: false,
          error: data.error || 'Permission check failed',
        })
      }
    } catch (error) {
      console.error('Permission check error:', error)
      setPermission({
        allowed: false,
        loading: false,
        error: 'Failed to verify permissions',
      })
    }
  }

  // Loading state
  if (permission.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Permission granted
  if (permission.allowed) {
    return <>{children}</>
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>
  }

  // Don't show error - just hide content
  if (!showError) {
    return null
  }

  // Default error display
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-red-600" />
        </div>
        <CardTitle className="text-xl">Access Denied</CardTitle>
        <CardDescription>
          You don't have permission to access this resource
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Required Permission:</strong> {module}:{action}</p>
          {resource && <p><strong>Resource:</strong> {resource}</p>}
          {requireDepartment && <p><strong>Department:</strong> {requireDepartment}</p>}
          {permission.error && (
            <div className="flex items-center justify-center gap-2 text-red-600 mt-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{permission.error}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button onClick={checkPermission}>
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Hook for checking permissions
 */
export function usePermission(module: string, action: string, resource?: string) {
  const { data: session, status } = useSession()
  const [permission, setPermission] = useState<PermissionCheck>({
    allowed: false,
    loading: true,
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      setPermission({ allowed: false, loading: false, error: 'Not authenticated' })
      return
    }

    checkPermission()
  }, [session, status, module, action, resource])

  const checkPermission = async () => {
    try {
      setPermission({ allowed: false, loading: true })

      const params = new URLSearchParams({
        module,
        action,
        ...(resource && { resource }),
      })

      const response = await fetch(`/api/admin/permissions/check?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPermission({ allowed: data.allowed, loading: false })
      } else {
        setPermission({
          allowed: false,
          loading: false,
          error: data.error || 'Permission check failed',
        })
      }
    } catch (error) {
      console.error('Permission check error:', error)
      setPermission({
        allowed: false,
        loading: false,
        error: 'Failed to verify permissions',
      })
    }
  }

  return {
    ...permission,
    refetch: checkPermission,
  }
}

/**
 * Higher-order component for protecting pages
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  module: string,
  action: string,
  resource?: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <PermissionGate module={module} action={action} resource={resource}>
        <WrappedComponent {...props} />
      </PermissionGate>
    )
  }
}

/**
 * Department access gate
 */
interface DepartmentGateProps {
  children: React.ReactNode
  departmentId: string
  fallback?: React.ReactNode
}

export function DepartmentGate({ children, departmentId, fallback }: DepartmentGateProps) {
  const { data: session, status } = useSession()
  const [canAccess, setCanAccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      setCanAccess(false)
      return
    }

    checkDepartmentAccess()
  }, [session, status, departmentId])

  const checkDepartmentAccess = async () => {
    try {
      const response = await fetch(`/api/admin/departments/${departmentId}/access`)
      const data = await response.json()
      setCanAccess(data.canAccess)
    } catch (error) {
      console.error('Department access check error:', error)
      setCanAccess(false)
    }
  }

  if (canAccess === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (canAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle className="text-xl">Department Access Denied</CardTitle>
        <CardDescription>
          You don't have access to this department's resources
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </CardContent>
    </Card>
  )
}