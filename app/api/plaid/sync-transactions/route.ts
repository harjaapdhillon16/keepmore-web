import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body?.access_token || !body?.start_date || !body?.end_date) {
    return NextResponse.json(
      { error: 'Missing access_token or date range' },
      { status: 400 }
    )
  }

  return NextResponse.json({ transactions: [] })
}
