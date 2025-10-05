import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get admin session token from cookie
    const sessionToken = request.cookies.get('admin-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No admin session found' },
        { status: 401 }
      )
    }

    // Verify session in database
    const session = await prisma.adminSession.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.adminSession.delete({
          where: { id: session.id }
        })
      }

      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Update last activity time
    await prisma.adminSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    })

    return NextResponse.json({
      success: true,
      user: session.user
    })

  } catch (error) {
    console.error('Admin session verification error:', error)
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    )
  }
}