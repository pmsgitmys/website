import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Payment integration is disabled for deployment
  return NextResponse.json(
    { error: 'Payment integration is currently disabled.' },
    { status: 501 }
  )
}