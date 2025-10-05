import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyPassword,
  isAccountLocked,
  handleFailedLogin,
  resetLoginAttempts,
  createAdminSession,
  logSecurityEvent,
  SecurityAction,
  UserRole,
  getClientInfo,
  checkRateLimit
} from '@/lib/security'
import { z } from 'zod'

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const { ipAddress, userAgent } = getClientInfo(request)

  try {
    // Rate limiting (disabled in development)
    if (process.env.NODE_ENV === 'production') {
      const rateLimit = checkRateLimit(`admin-login:${ipAddress}`, 5, 15 * 60 * 1000)
      if (!rateLimit.allowed) {
        await logSecurityEvent(
          SecurityAction.LOGIN_FAILED,
          undefined,
          { reason: 'Rate limit exceeded', ipAddress },
          ipAddress,
          userAgent,
          false
        )

        return NextResponse.json(
          {
            error: 'Too many login attempts. Please try again later.',
            resetTime: new Date(rateLimit.resetTime).toISOString()
          },
          { status: 429 }
        )
      }
    }

    const body = await request.json()
    const validatedData = adminLoginSchema.parse(body)
    const { email, password, twoFactorCode } = validatedData

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        loginAttempts: true,
        lockedUntil: true
      }
    })

    if (!user) {
      await logSecurityEvent(
        SecurityAction.LOGIN_FAILED,
        undefined,
        { reason: 'User not found', email, ipAddress },
        ipAddress,
        userAgent,
        false
      )

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      await logSecurityEvent(
        SecurityAction.UNAUTHORIZED_ACCESS,
        user.id,
        { reason: 'Non-admin login attempt', role: user.role, ipAddress },
        ipAddress,
        userAgent,
        false
      )

      return NextResponse.json(
        { error: 'Access denied. Admin credentials required.' },
        { status: 403 }
      )
    }

    // Check if account is active
    if (!user.isActive) {
      await logSecurityEvent(
        SecurityAction.LOGIN_FAILED,
        user.id,
        { reason: 'Account inactive', ipAddress },
        ipAddress,
        userAgent,
        false
      )

      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (await isAccountLocked(user.id)) {
      await logSecurityEvent(
        SecurityAction.LOGIN_FAILED,
        user.id,
        { reason: 'Account locked', ipAddress },
        ipAddress,
        userAgent,
        false
      )

      return NextResponse.json(
        { error: 'Account is temporarily locked due to multiple failed login attempts' },
        { status: 423 }
      )
    }

    // Verify password
    if (!user.password || !(await verifyPassword(password, user.password))) {
      await handleFailedLogin(user.id)
      await logSecurityEvent(
        SecurityAction.LOGIN_FAILED,
        user.id,
        { reason: 'Invalid password', ipAddress },
        ipAddress,
        userAgent,
        false
      )

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          {
            error: 'Two-factor authentication required',
            requiresTwoFactor: true
          },
          { status: 200 }
        )
      }

      // In production, use proper TOTP verification
      // For now, accept any 6-digit code
      if (!/^\d{6}$/.test(twoFactorCode)) {
        await logSecurityEvent(
          SecurityAction.LOGIN_FAILED,
          user.id,
          { reason: 'Invalid 2FA code', ipAddress },
          ipAddress,
          userAgent,
          false
        )

        return NextResponse.json(
          { error: 'Invalid two-factor authentication code' },
          { status: 401 }
        )
      }
    }

    // Successful login
    await resetLoginAttempts(user.id)

    // Create admin session
    const sessionToken = await createAdminSession(user.id, ipAddress, userAgent)

    await logSecurityEvent(
      SecurityAction.LOGIN_SUCCESS,
      user.id,
      { ipAddress, userAgent },
      ipAddress,
      userAgent,
      true
    )

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 4 * 60 * 60, // 4 hours
      path: '/'
    })

    return response

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    await logSecurityEvent(
      SecurityAction.LOGIN_FAILED,
      undefined,
      { reason: 'Server error', error: error instanceof Error ? error.message : 'Unknown error', ipAddress },
      ipAddress,
      userAgent,
      false
    )

    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}