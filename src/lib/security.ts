import { prisma } from './prisma'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum SecurityAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  ADMIN_SESSION_CREATED = 'ADMIN_SESSION_CREATED',
  ADMIN_SESSION_EXPIRED = 'ADMIN_SESSION_EXPIRED'
}

// Security constants
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_DURATION: 30 * 60 * 1000, // 30 minutes
  ADMIN_SESSION_DURATION: 4 * 60 * 60 * 1000, // 4 hours
  PASSWORD_MIN_LENGTH: 12,
  REQUIRE_SPECIAL_CHARS: true,
  SESSION_CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
}

// Generate secure random token
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Hash password with high security
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 14) // Higher rounds for admin accounts
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`)
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (SECURITY_CONFIG.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Check if account is locked
export async function isAccountLocked(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lockedUntil: true }
  })

  if (!user?.lockedUntil) return false

  if (user.lockedUntil > new Date()) {
    return true
  }

  // Unlock account if lock period has expired
  await prisma.user.update({
    where: { id: userId },
    data: {
      lockedUntil: null,
      loginAttempts: 0
    }
  })

  return false
}

// Lock account after failed attempts
export async function handleFailedLogin(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loginAttempts: true }
  })

  const attempts = (user?.loginAttempts || 0) + 1

  if (attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    const lockUntil = new Date(Date.now() + SECURITY_CONFIG.ACCOUNT_LOCK_DURATION)

    await prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: attempts,
        lockedUntil: lockUntil
      }
    })

    await logSecurityEvent(SecurityAction.ACCOUNT_LOCKED, userId, {
      attempts,
      lockUntil: lockUntil.toISOString()
    })
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { loginAttempts: attempts }
    })
  }
}

// Reset login attempts on successful login
export async function resetLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date()
    }
  })
}

// Create admin session
export async function createAdminSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const token = generateSecureToken()
  const sessionId = generateSecureToken() // Generate a unique session ID
  const expiresAt = new Date(Date.now() + SECURITY_CONFIG.ADMIN_SESSION_DURATION)

  await prisma.adminSession.create({
    data: {
      userId,
      token,
      sessionId,
      expiresAt,
      ipAddress,
      userAgent
    }
  })

  await logSecurityEvent(SecurityAction.ADMIN_SESSION_CREATED, userId, {
    expiresAt: expiresAt.toISOString(),
    ipAddress,
    userAgent
  })

  return token
}

// Validate admin session
export async function validateAdminSession(token: string): Promise<{
  isValid: boolean
  userId?: string
  user?: any
}> {
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true
        }
      }
    }
  })

  if (!session || !session.isActive || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.update({
        where: { id: session.id },
        data: { isActive: false }
      })
    }
    return { isValid: false }
  }

  if (!session.user.isActive || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return { isValid: false }
  }

  // Update last activity
  await prisma.adminSession.update({
    where: { id: session.id },
    data: { lastActivity: new Date() }
  })

  return {
    isValid: true,
    userId: session.userId,
    user: session.user
  }
}

// Revoke admin session
export async function revokeAdminSession(token: string): Promise<void> {
  await prisma.adminSession.update({
    where: { token },
    data: { isActive: false }
  })
}

// Log security events
export async function logSecurityEvent(
  action: SecurityAction,
  userId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string,
  success: boolean = true
): Promise<void> {
  await prisma.securityLog.create({
    data: {
      userId,
      action,
      details: JSON.stringify(details || {}),
      ipAddress,
      userAgent,
      success
    }
  })
}

// Get client IP and User Agent from request
export function getClientInfo(request: NextRequest): {
  ipAddress: string
  userAgent: string
} {
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    '127.0.0.1' // Default to localhost for development

  const userAgent = request.headers.get('user-agent') || 'unknown'

  return { ipAddress, userAgent }
}

// Check if user has required role
export function hasRequiredRole(userRole: string, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole as UserRole)
}

// Cleanup expired sessions (run periodically)
export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.adminSession.updateMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { lastActivity: { lt: new Date(Date.now() - SECURITY_CONFIG.SESSION_CLEANUP_INTERVAL) } }
      ]
    },
    data: { isActive: false }
  })
}

// Rate limiting utility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, resetTime: now + windowMs }
  }

  if (record.count >= limit) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, resetTime: record.resetTime }
}

// Generate 2FA secret
export function generateTwoFactorSecret(): string {
  return crypto.randomBytes(20).toString('base32')
}

// Verify 2FA token (basic implementation - would use libraries like speakeasy in production)
export function verifyTwoFactorToken(secret: string, token: string): boolean {
  // This is a simplified implementation
  // In production, use libraries like 'speakeasy' for proper TOTP verification
  return token.length === 6 && /^\d{6}$/.test(token)
}