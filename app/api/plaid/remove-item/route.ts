import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { plaidClient } from '../../../../lib/plaid'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  'https://iimlwwmxbaeinfcpqsxp.supabase.co'
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  const { userId, plaidItemId } = payload ?? {}

  if (!userId || !plaidItemId) {
    return NextResponse.json({ error: 'userId and plaidItemId are required' }, { status: 400 })
  }

  const { data: item, error: fetchError } = await supabaseAdmin
    .from('plaid_items')
    .select('id, access_token, user_id')
    .eq('id', plaidItemId)
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!item) {
    return NextResponse.json({ error: 'Plaid item not found' }, { status: 404 })
  }

  try {
    if (item.access_token) {
      await plaidClient.itemRemove({ access_token: item.access_token })
    }

    await supabaseAdmin.from('plaid_transactions').delete().eq('plaid_item_id', item.id)
    await supabaseAdmin.from('plaid_accounts').delete().eq('plaid_item_id', item.id)
    await supabaseAdmin.from('plaid_recurring_transactions').delete().eq('plaid_item_id', item.id)
    await supabaseAdmin.from('plaid_items').delete().eq('id', item.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Unable to remove item' },
      { status: 500 },
    )
  }
}
