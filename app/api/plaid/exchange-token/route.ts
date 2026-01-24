import { NextResponse } from 'next/server'
import { plaidClient } from '../../../../lib/plaid'

type ExchangeTokenBody = {
  publicToken?: string
}

const getPlaidErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object') {
    const message = (error as { response?: { data?: { error_message?: string } } })
      .response?.data?.error_message
    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }
  return error instanceof Error ? error.message : 'Plaid request failed'
}

export async function POST(request: Request) {
  let body: ExchangeTokenBody | null = null
  try {
    body = (await request.json()) as ExchangeTokenBody
  } catch {
    body = null
  }

  if (!body?.publicToken || typeof body.publicToken !== 'string') {
    return NextResponse.json({ error: 'publicToken is required' }, { status: 400 })
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: body.publicToken,
    })
    return NextResponse.json({
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
      requestId: response.data.request_id,
    })
  } catch (error) {
    return NextResponse.json({ error: getPlaidErrorMessage(error) }, { status: 500 })
  }
}
