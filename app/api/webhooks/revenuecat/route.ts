import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  return NextResponse.json({ received: true, payload })
}
