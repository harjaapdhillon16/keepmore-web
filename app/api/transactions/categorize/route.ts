import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body?.transaction_id || !body?.category) {
    return NextResponse.json(
      { error: 'Missing transaction_id or category' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
