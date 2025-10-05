/**
 * Enterprise Audit Trail System
 * Comprehensive logging and compliance tracking following ERP standards
 */

import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

export interface AuditLogEntry {
  userId?: string
  userName?: string
  action: string
  module: string
  resourceId?: string
  resourceType?: string
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  success: boolean
  errorMessage?: string
  metadata?: any
}

export interface SecurityLogEntry {
  userId?: string
  action: string
  details: any
  ipAddress?: string
  userAgent?: string
  location?: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  success: boolean
  metadata?: any
}

/**
 * Create audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        userName: entry.userName,
        action: entry.action,
        module: entry.module,
        resourceId: entry.resourceId,
        resourceType: entry.resourceType,
        oldValues: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        newValues: entry.newValues ? JSON.stringify(entry.newValues) : null,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        sessionId: entry.sessionId,
        success: entry.success,
        errorMessage: entry.errorMessage,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging should not break application flow
  }
}

/**
 * Create security log entry
 */
export async function createSecurityLog(entry: SecurityLogEntry): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        details: JSON.stringify(entry.details),
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        location: entry.location,
        riskLevel: entry.riskLevel,
        success: entry.success,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Failed to create security log:', error)
  }
}

/**
 * Extract request metadata for audit logging
 */
export function getRequestMetadata(request: NextRequest) {
  const ip = request.ip ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const userAgent = request.headers.get('user-agent') || 'unknown'

  return {
    ipAddress: ip,
    userAgent,
    url: request.url,
    method: request.method,
  }
}

/**
 * Audit middleware for API routes
 */
export function auditAction(
  action: string,
  module: string,
  resourceType?: string
) {
  return function auditDecorator<T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()
      let success = true
      let errorMessage: string | undefined
      let result: any

      try {
        result = await originalMethod?.apply(this, args)
        return result
      } catch (error) {
        success = false
        errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw error
      } finally {
        // Log the action (implement based on your context)
        const duration = Date.now() - startTime
        console.log(`Audit: ${action} in ${module} - ${success ? 'SUCCESS' : 'FAILED'} (${duration}ms)`)

        // You can extend this to extract user/request info from context
        await createAuditLog({
          action,
          module,
          resourceType,
          success,
          errorMessage,
          metadata: { duration },
        })
      }
    } as T

    return descriptor
  }
}

/**
 * Database change tracking
 */
export async function logDatabaseChange(
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  tableName: string,
  recordId: string,
  oldValues?: any,
  newValues?: any,
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createAuditLog({
    userId,
    action: `${action}_${tableName.toUpperCase()}`,
    module: 'DATABASE',
    resourceType: tableName,
    resourceId: recordId,
    oldValues,
    newValues,
    success: true,
    ...metadata,
  })
}

/**
 * User session tracking
 */
export async function logUserSession(
  userId: string,
  action: 'LOGIN' | 'LOGOUT' | 'SESSION_EXPIRED' | 'FORCE_LOGOUT',
  sessionData: any,
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createSecurityLog({
    userId,
    action: `USER_${action}`,
    details: {
      sessionData,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
    riskLevel: action === 'FORCE_LOGOUT' ? 'HIGH' : 'LOW',
    success: true,
    ...metadata,
  })
}

/**
 * Failed login attempts tracking
 */
export async function logFailedLogin(
  email: string,
  reason: string,
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createSecurityLog({
    action: 'FAILED_LOGIN',
    details: {
      email,
      reason,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
    riskLevel: 'MEDIUM',
    success: false,
    ...metadata,
  })
}

/**
 * Permission violations
 */
export async function logPermissionViolation(
  userId: string,
  attemptedAction: string,
  resource: string,
  reason: string,
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createSecurityLog({
    userId,
    action: 'PERMISSION_VIOLATION',
    details: {
      attemptedAction,
      resource,
      reason,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
    riskLevel: 'HIGH',
    success: false,
    ...metadata,
  })
}

/**
 * Suspicious activity detection
 */
export async function logSuspiciousActivity(
  userId: string | undefined,
  activityType: string,
  details: any,
  riskLevel: SecurityLogEntry['riskLevel'] = 'MEDIUM',
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createSecurityLog({
    userId,
    action: 'SUSPICIOUS_ACTIVITY',
    details: {
      activityType,
      ...details,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
    riskLevel,
    success: false,
    ...metadata,
  })
}

/**
 * System configuration changes
 */
export async function logConfigurationChange(
  userId: string,
  configKey: string,
  oldValue: any,
  newValue: any,
  category: string,
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createAuditLog({
    userId,
    action: 'UPDATE_CONFIGURATION',
    module: 'SYSTEM',
    resourceType: 'CONFIGURATION',
    resourceId: configKey,
    oldValues: { [configKey]: oldValue, category },
    newValues: { [configKey]: newValue, category },
    success: true,
    ...metadata,
  })
}

/**
 * Data export/import tracking
 */
export async function logDataOperation(
  userId: string,
  operation: 'EXPORT' | 'IMPORT',
  dataType: string,
  recordCount: number,
  filters?: any,
  request?: NextRequest
) {
  const metadata = request ? getRequestMetadata(request) : {}

  await createAuditLog({
    userId,
    action: `${operation}_DATA`,
    module: 'DATA_MANAGEMENT',
    resourceType: dataType,
    newValues: {
      operation,
      dataType,
      recordCount,
      filters,
      timestamp: new Date().toISOString(),
    },
    success: true,
    ...metadata,
  })
}

/**
 * Compliance reporting
 */
export async function generateComplianceReport(
  startDate: Date,
  endDate: Date,
  modules?: string[]
) {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        ...(modules && { module: { in: modules } }),
      },
      orderBy: { timestamp: 'desc' },
    })

    const securityLogs = await prisma.securityLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const summary = {
      totalAuditEvents: auditLogs.length,
      totalSecurityEvents: securityLogs.length,
      successfulOperations: auditLogs.filter(log => log.success).length,
      failedOperations: auditLogs.filter(log => !log.success).length,
      securityIncidents: securityLogs.filter(log =>
        log.riskLevel === 'HIGH' || log.riskLevel === 'CRITICAL'
      ).length,
      moduleBreakdown: auditLogs.reduce((acc, log) => {
        acc[log.module] = (acc[log.module] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      actionBreakdown: auditLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }

    return {
      summary,
      auditLogs: auditLogs.slice(0, 1000), // Limit for performance
      securityLogs: securityLogs.slice(0, 1000),
      generatedAt: new Date(),
      dateRange: { startDate, endDate },
    }
  } catch (error) {
    console.error('Failed to generate compliance report:', error)
    throw new Error('Failed to generate compliance report')
  }
}

/**
 * Real-time monitoring alerts
 */
export async function checkSecurityAlerts(): Promise<{
  alerts: Array<{
    type: string
    message: string
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    count: number
    lastOccurred: Date
  }>
}> {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Check for multiple failed logins
    const failedLogins = await prisma.securityLog.groupBy({
      by: ['ipAddress'],
      where: {
        action: 'FAILED_LOGIN',
        createdAt: { gte: last24Hours },
      },
      _count: { id: true },
      having: {
        id: { _count: { gte: 5 } },
      },
    })

    // Check for permission violations
    const permissionViolations = await prisma.securityLog.findMany({
      where: {
        action: 'PERMISSION_VIOLATION',
        createdAt: { gte: last24Hours },
      },
    })

    // Check for suspicious activities
    const suspiciousActivities = await prisma.securityLog.findMany({
      where: {
        action: 'SUSPICIOUS_ACTIVITY',
        riskLevel: { in: ['HIGH', 'CRITICAL'] },
        createdAt: { gte: last24Hours },
      },
    })

    const alerts = [
      ...failedLogins.map(login => ({
        type: 'MULTIPLE_FAILED_LOGINS',
        message: `Multiple failed login attempts from IP: ${login.ipAddress}`,
        level: 'HIGH' as const,
        count: login._count.id,
        lastOccurred: last24Hours,
      })),
      ...permissionViolations.map(violation => ({
        type: 'PERMISSION_VIOLATION',
        message: 'Unauthorized access attempt detected',
        level: 'MEDIUM' as const,
        count: 1,
        lastOccurred: violation.createdAt,
      })),
      ...suspiciousActivities.map(activity => ({
        type: 'SUSPICIOUS_ACTIVITY',
        message: 'Suspicious user activity detected',
        level: activity.riskLevel as any,
        count: 1,
        lastOccurred: activity.createdAt,
      })),
    ]

    return { alerts }
  } catch (error) {
    console.error('Failed to check security alerts:', error)
    return { alerts: [] }
  }
}