/**
 * Role-Based Access Control (RBAC) System
 * ERP-standard permission management following enterprise patterns
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Role hierarchy levels (higher number = more privileges)
export const ROLE_HIERARCHY = {
  CUSTOMER: 0,
  EMPLOYEE: 1,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
} as const

// Module permissions mapping
export const MODULE_PERMISSIONS = {
  DASHBOARD: {
    READ: 'dashboard:read',
    CREATE: 'dashboard:create',
    UPDATE: 'dashboard:update',
    DELETE: 'dashboard:delete',
  },
  SALES: {
    READ: 'sales:read',
    CREATE: 'sales:create',
    UPDATE: 'sales:update',
    DELETE: 'sales:delete',
    APPROVE: 'sales:approve',
    REJECT: 'sales:reject',
  },
  INVENTORY: {
    READ: 'inventory:read',
    CREATE: 'inventory:create',
    UPDATE: 'inventory:update',
    DELETE: 'inventory:delete',
    IMPORT: 'inventory:import',
    EXPORT: 'inventory:export',
  },
  CUSTOMERS: {
    READ: 'customers:read',
    CREATE: 'customers:create',
    UPDATE: 'customers:update',
    DELETE: 'customers:delete',
    EXPORT: 'customers:export',
  },
  ORDERS: {
    READ: 'orders:read',
    CREATE: 'orders:create',
    UPDATE: 'orders:update',
    DELETE: 'orders:delete',
    APPROVE: 'orders:approve',
    REJECT: 'orders:reject',
  },
  PRODUCTS: {
    READ: 'products:read',
    CREATE: 'products:create',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
    IMPORT: 'products:import',
    EXPORT: 'products:export',
  },
  ANALYTICS: {
    READ: 'analytics:read',
    EXPORT: 'analytics:export',
  },
  REPORTS: {
    READ: 'reports:read',
    CREATE: 'reports:create',
    EXPORT: 'reports:export',
  },
  USERS: {
    READ: 'users:read',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    APPROVE: 'users:approve',
    REJECT: 'users:reject',
  },
  SETTINGS: {
    READ: 'settings:read',
    UPDATE: 'settings:update',
  },
  FINANCE: {
    READ: 'finance:read',
    CREATE: 'finance:create',
    UPDATE: 'finance:update',
    DELETE: 'finance:delete',
    APPROVE: 'finance:approve',
    EXPORT: 'finance:export',
  },
  MARKETING: {
    READ: 'marketing:read',
    CREATE: 'marketing:create',
    UPDATE: 'marketing:update',
    DELETE: 'marketing:delete',
    APPROVE: 'marketing:approve',
  },
} as const

// Default role permissions (enterprise standard)
export const DEFAULT_ROLE_PERMISSIONS = {
  CUSTOMER: [],
  EMPLOYEE: [
    MODULE_PERMISSIONS.DASHBOARD.READ,
    MODULE_PERMISSIONS.PRODUCTS.READ,
    MODULE_PERMISSIONS.ORDERS.READ,
    MODULE_PERMISSIONS.CUSTOMERS.READ,
  ],
  MANAGER: [
    MODULE_PERMISSIONS.DASHBOARD.READ,
    MODULE_PERMISSIONS.SALES.READ,
    MODULE_PERMISSIONS.SALES.CREATE,
    MODULE_PERMISSIONS.SALES.UPDATE,
    MODULE_PERMISSIONS.INVENTORY.READ,
    MODULE_PERMISSIONS.INVENTORY.UPDATE,
    MODULE_PERMISSIONS.CUSTOMERS.READ,
    MODULE_PERMISSIONS.CUSTOMERS.CREATE,
    MODULE_PERMISSIONS.CUSTOMERS.UPDATE,
    MODULE_PERMISSIONS.ORDERS.READ,
    MODULE_PERMISSIONS.ORDERS.CREATE,
    MODULE_PERMISSIONS.ORDERS.UPDATE,
    MODULE_PERMISSIONS.ORDERS.APPROVE,
    MODULE_PERMISSIONS.PRODUCTS.READ,
    MODULE_PERMISSIONS.PRODUCTS.CREATE,
    MODULE_PERMISSIONS.PRODUCTS.UPDATE,
    MODULE_PERMISSIONS.ANALYTICS.READ,
    MODULE_PERMISSIONS.REPORTS.READ,
    MODULE_PERMISSIONS.REPORTS.CREATE,
  ],
  ADMIN: [
    // All manager permissions plus
    ...DEFAULT_ROLE_PERMISSIONS.MANAGER,
    MODULE_PERMISSIONS.SALES.DELETE,
    MODULE_PERMISSIONS.SALES.APPROVE,
    MODULE_PERMISSIONS.SALES.REJECT,
    MODULE_PERMISSIONS.INVENTORY.CREATE,
    MODULE_PERMISSIONS.INVENTORY.DELETE,
    MODULE_PERMISSIONS.INVENTORY.IMPORT,
    MODULE_PERMISSIONS.INVENTORY.EXPORT,
    MODULE_PERMISSIONS.CUSTOMERS.DELETE,
    MODULE_PERMISSIONS.CUSTOMERS.EXPORT,
    MODULE_PERMISSIONS.ORDERS.DELETE,
    MODULE_PERMISSIONS.ORDERS.REJECT,
    MODULE_PERMISSIONS.PRODUCTS.DELETE,
    MODULE_PERMISSIONS.PRODUCTS.IMPORT,
    MODULE_PERMISSIONS.PRODUCTS.EXPORT,
    MODULE_PERMISSIONS.ANALYTICS.EXPORT,
    MODULE_PERMISSIONS.REPORTS.EXPORT,
    MODULE_PERMISSIONS.USERS.READ,
    MODULE_PERMISSIONS.USERS.CREATE,
    MODULE_PERMISSIONS.USERS.UPDATE,
    MODULE_PERMISSIONS.FINANCE.READ,
    MODULE_PERMISSIONS.FINANCE.CREATE,
    MODULE_PERMISSIONS.FINANCE.UPDATE,
    MODULE_PERMISSIONS.MARKETING.READ,
    MODULE_PERMISSIONS.MARKETING.CREATE,
    MODULE_PERMISSIONS.MARKETING.UPDATE,
    MODULE_PERMISSIONS.SETTINGS.READ,
  ],
  SUPER_ADMIN: [
    // All permissions - system administrator
    ...Object.values(MODULE_PERMISSIONS).flatMap(module => Object.values(module)),
  ],
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  userId: string,
  module: keyof typeof MODULE_PERMISSIONS,
  action: string,
  resource?: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRole: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    if (!user || !user.isActive) {
      return false
    }

    // Super admin has all permissions
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    // Check role-based permissions
    const permission = `${module.toLowerCase()}:${action.toLowerCase()}`

    // Check if user has direct permission through role
    const hasDirectPermission = user.userRole?.permissions.some(rp => {
      const perm = rp.permission
      return perm.module === module &&
             perm.action === action.toUpperCase() as any &&
             (resource ? perm.resource === resource : true)
    })

    if (hasDirectPermission) {
      return true
    }

    // Fallback to default role permissions
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[user.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || []
    return defaultPermissions.includes(permission)

  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Check if user can access department
 */
export async function canAccessDepartment(
  userId: string,
  departmentId: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
        userRole: true,
      },
    })

    if (!user || !user.isActive) {
      return false
    }

    // Super admin can access all departments
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    // User can access their own department
    if (user.departmentId === departmentId) {
      return true
    }

    // Managers can access child departments
    if (user.role === 'MANAGER' || user.role === 'ADMIN') {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          parent: true,
        },
      })

      // Check if user's department is parent of target department
      return department?.parentId === user.departmentId
    }

    return false
  } catch (error) {
    console.error('Error checking department access:', error)
    return false
  }
}

/**
 * Get user's accessible departments
 */
export async function getAccessibleDepartments(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: {
          include: {
            children: true,
          },
        },
      },
    })

    if (!user || !user.isActive) {
      return []
    }

    // Super admin can access all departments
    if (user.role === 'SUPER_ADMIN') {
      return await prisma.department.findMany({
        where: { isActive: true },
        include: {
          children: true,
          users: true,
        },
      })
    }

    const accessibleDepartments = []

    // User's own department
    if (user.department) {
      accessibleDepartments.push(user.department)
    }

    // For managers/admins, include child departments
    if ((user.role === 'MANAGER' || user.role === 'ADMIN') && user.department?.children) {
      accessibleDepartments.push(...user.department.children)
    }

    return accessibleDepartments
  } catch (error) {
    console.error('Error getting accessible departments:', error)
    return []
  }
}

/**
 * Audit log for permission checks
 */
export async function logPermissionCheck(
  userId: string,
  action: string,
  resource: string,
  allowed: boolean,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PERMISSION_CHECK',
        module: 'RBAC',
        resourceType: 'PERMISSION',
        resourceId: resource,
        newValues: JSON.stringify({
          action,
          resource,
          allowed,
          metadata,
        }),
        success: true,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error('Error logging permission check:', error)
  }
}

/**
 * Validate role hierarchy
 */
export function validateRoleHierarchy(
  currentUserRole: keyof typeof ROLE_HIERARCHY,
  targetUserRole: keyof typeof ROLE_HIERARCHY
): boolean {
  return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[targetUserRole]
}

/**
 * Department hierarchy validation
 */
export async function validateDepartmentHierarchy(
  parentDepartmentId: string,
  childDepartmentId: string
): Promise<boolean> {
  try {
    // Prevent circular dependencies
    const parentDept = await prisma.department.findUnique({
      where: { id: parentDepartmentId },
      include: {
        parent: true,
      },
    })

    // Check if child would create circular reference
    let currentParent = parentDept?.parent
    while (currentParent) {
      if (currentParent.id === childDepartmentId) {
        return false // Circular dependency detected
      }
      currentParent = await prisma.department.findUnique({
        where: { id: currentParent.parentId || '' },
        include: { parent: true },
      }).then(dept => dept?.parent)
    }

    return true
  } catch (error) {
    console.error('Error validating department hierarchy:', error)
    return false
  }
}

/**
 * Get effective permissions for user
 */
export async function getUserEffectivePermissions(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRole: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    if (!user || !user.isActive) {
      return []
    }

    // Get role-based permissions
    const rolePermissions = user.userRole?.permissions.map(rp => ({
      module: rp.permission.module,
      action: rp.permission.action,
      resource: rp.permission.resource,
    })) || []

    // Get default permissions for role
    const defaultPerms = DEFAULT_ROLE_PERMISSIONS[user.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || []

    // Combine and deduplicate
    const allPermissions = [
      ...rolePermissions,
      ...defaultPerms.map(perm => {
        const [module, action] = perm.split(':')
        return {
          module: module.toUpperCase(),
          action: action.toUpperCase(),
          resource: null,
        }
      }),
    ]

    return allPermissions
  } catch (error) {
    console.error('Error getting user permissions:', error)
    return []
  }
}