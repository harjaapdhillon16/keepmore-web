import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { plaidClient } from '../../../../lib/plaid'

type ExchangeTokenBody = {
  publicToken?: string
  user?: string // your user UUID
  institutionId?: string
  institutionName?: string
}

const getPlaidErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object') {
    const message = (error as { response?: { data?: { error_message?: string } } })
      .response?.data?.error_message
    if (typeof message === 'string' && message.length > 0) return message
  }
  return error instanceof Error ? error.message : 'Plaid request failed'
}

// ✅ Server-only Supabase client (DO NOT expose service role key to client)
const supabaseAdmin = createClient(
  'https://iimlwwmxbaeinfcpqsxp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'
)

export async function POST(request: Request) {
  let body: ExchangeTokenBody | null = null
  try {
    body = (await request.json()) as ExchangeTokenBody
  } catch {
    body = null
  }

  const publicToken = body?.publicToken
  const userId = body?.user

  if (!publicToken || typeof publicToken !== 'string') {
    return NextResponse.json({ error: 'publicToken is required' }, { status: 400 })
  }

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'user is required' }, { status: 400 })
  }

  try {
    // 1) Exchange public_token -> access_token + item_id
    const exchange = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    const accessToken = exchange.data.access_token
    const itemId = exchange.data.item_id

    // 2) Save in Supabase (server-side)
    // ✅ Upsert is helpful if user re-links (item_id changes if linked again)
    const { error: dbError } = await supabaseAdmin
      .from('plaid_items')
      .upsert(
        {
          user_id: userId,
          access_token: accessToken,
          item_id: itemId,
          institution_id: body?.institutionId ?? null,
          institution_name: body?.institutionName ?? null,
          last_synced_at: null,
        }
      )

    if (dbError) {
      return NextResponse.json(
        { error: `Failed to save Plaid item: ${dbError.message}` },
        { status: 500 },
      )
    }

    // ✅ Never return access_token to the client
    return NextResponse.json({ accessToken: exchange.data.access_token, itemId: exchange.data.item_id, requestId: exchange.data.request_id, })
  } catch (error) {
    return NextResponse.json({ error: getPlaidErrorMessage(error) }, { status: 500 })
  }
}
