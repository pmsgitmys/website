import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per minute
const STRICT_RATE_LIMIT_MAX = 10 // 10 requests per minute for sensitive endpoints

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  return `rate_limit:${ip}`
}

function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return false
  }

  if (record.count >= maxRequests) {
    return true
  }

  record.count++
  return false
}

// Protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/orders',
  '/account',
  '/profile',
  '/dashboard',
  '/api/admin',
  '/api/user',
]

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin',
]

// Public admin routes that don't require authentication
const publicAdminRoutes = [
  '/admin/login',
  '/api/admin/auth/login',
]

// API routes that need strict rate limiting
const strictRateLimitRoutes = [
  '/api/auth',
  '/api/login',
  '/api/register',
  '/api/admin',
]

// Input sanitization for common XSS patterns
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const url = pathname + search

  // Apply security headers to all responses
  const response = NextResponse.next()

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting (disabled in development)
  if (process.env.NODE_ENV === 'production') {
    const rateLimitKey = getRateLimitKey(request)
    const isStrictRoute = strictRateLimitRoutes.some(route => url.startsWith(route))
    const maxRequests = isStrictRoute ? STRICT_RATE_LIMIT_MAX : RATE_LIMIT_MAX_REQUESTS

    if (isRateLimited(rateLimitKey, maxRequests)) {
      console.warn(`Rate limit exceeded for ${request.ip} on ${url}`)
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: RATE_LIMIT_WINDOW / 1000
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(RATE_LIMIT_WINDOW / 1000),
            ...securityHeaders
          }
        }
      )
    }
  }

  // XSS Protection - sanitize query parameters
  if (search) {
    const urlParams = new URLSearchParams(search)
    let modified = false

    for (const [key, value] of urlParams.entries()) {
      const sanitized = sanitizeInput(value)
      if (sanitized !== value) {
        urlParams.set(key, sanitized)
        modified = true
        console.warn(`XSS attempt blocked: ${key}=${value}`)
      }
    }

    if (modified) {
      const newUrl = new URL(request.url)
      newUrl.search = urlParams.toString()
      return NextResponse.redirect(newUrl)
    }
  }

  // Check if route requires authentication (exclude public admin routes)
  const isPublicAdminRoute = publicAdminRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = !isPublicAdminRoute && protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = !isPublicAdminRoute && adminRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    try {
      // Handle admin routes with admin session verification
      if (isAdminRoute) {
        const adminSessionToken = request.cookies.get('admin-session')?.value

        if (!adminSessionToken) {
          console.warn(`Unauthorized admin access attempt to ${pathname} from ${request.ip}`)
          return new NextResponse(
            JSON.stringify({
              error: 'Forbidden',
              message: 'Admin authentication required'
            }),
            {
              status: 403,
              headers: {
                'Content-Type': 'application/json',
                ...securityHeaders
              }
            }
          )
        }

        // For admin routes, we'll let the route handle session validation
        // since we can't access Prisma in middleware easily
        console.info(`Admin session access: ${pathname}`)
      } else {
        // Handle regular user routes with NextAuth
        const token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
        })

        // No token - redirect to login
        if (!token) {
          console.warn(`Unauthorized access attempt to ${pathname} from ${request.ip}`)
          const loginUrl = new URL('/auth/signin', request.url)
          loginUrl.searchParams.set('callbackUrl', request.url)
          return NextResponse.redirect(loginUrl)
        }

        // Log successful authenticated access
        console.info(`Authenticated access: ${token.email} (${token.role}) -> ${pathname}`)
      }

    } catch (error) {
      console.error('Authentication middleware error:', error)
      return new NextResponse(
        JSON.stringify({
          error: 'Authentication Error',
          message: 'Unable to verify authentication'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders
          }
        }
      )
    }
  }

  // Add security logging for suspicious activities
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // Script injection
    /union.*select/i,  // SQL injection
    /exec\(/i,  // Code execution
    /eval\(/i,  // Code evaluation
  ]

  const fullUrl = url.toLowerCase()
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullUrl)) {
      console.error(`🚨 SECURITY ALERT: Suspicious request from ${request.ip}: ${url}`)
      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden',
          message: 'Suspicious activity detected'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders
          }
        }
      )
    }
  }

  // Add CSRF token header for POST/PUT/DELETE requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    if (origin && !origin.includes(host || '')) {
      console.warn(`CSRF attempt blocked: Origin ${origin} doesn't match host ${host}`)
      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden',
          message: 'CSRF protection: Invalid origin'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders
          }
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|sw.js|manifest.json).*)',
  ],
}