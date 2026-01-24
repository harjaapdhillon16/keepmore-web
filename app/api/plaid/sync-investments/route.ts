import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body?.access_token) {
    return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
  }

  return NextResponse.json({
    holdings: [],
    securities: [],
    transactions: [],
  })
}
