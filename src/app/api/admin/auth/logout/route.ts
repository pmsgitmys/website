import { NextRequest, NextResponse } from 'next/server'
import { revokeAdminSession, logSecurityEvent, SecurityAction, getClientInfo } from '@/lib/security'

export async function POST(request: NextRequest) {
  const { ipAddress, userAgent } = getClientInfo(request)

  try {
    const token = request.cookies.get('admin-session')?.value

    if (token) {
      await revokeAdminSession(token)

      await logSecurityEvent(
        SecurityAction.LOGOUT,
        undefined,
        { ipAddress, userAgent },
        ipAddress,
        userAgent,
        true
      )
    }

    const response = NextResponse.json({ success: true })

    // Clear admin session cookie
    response.cookies.delete('admin-session')

    return response

  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}