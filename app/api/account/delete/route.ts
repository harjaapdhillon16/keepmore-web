import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  'https://iimlwwmxbaeinfcpqsxp.supabase.co'
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

const deletionTargets: Array<{ table: string; column: string }> = [
  { table: 'plaid_items', column: 'user_id' },
  { table: 'plaid_accounts', column: 'user_id' },
  { table: 'plaid_transactions', column: 'user_id' },
  { table: 'plaid_recurring_transactions', column: 'user_id' },
  { table: 'plaid_investment_items', column: 'user_id' },
  { table: 'plaid_investments', column: 'user_id' },
  { table: 'financial_goals', column: 'user_id' },
  { table: 'user_financial_summaries', column: 'user_id' },
  { table: 'financial_insights', column: 'user_id' },
  { table: 'embeddings', column: 'user_id' },
  { table: 'user_activity', column: 'user_id' },
  { table: 'user_preferences', column: 'user_id' },
  { table: 'user_budgets', column: 'user_id' },
  { table: 'revenuecat_subscriptions', column: 'app_user_id' },
  { table: 'revenuecat_events', column: 'app_user_id' },
]

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  const { userId } = payload ?? {}

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  for (const target of deletionTargets) {
    const { error } = await supabaseAdmin
      .from(target.table)
      .delete()
      .eq(target.column, userId)

    if (error) {
      // Continue deleting other tables; capture errors but do not abort early.
      console.warn(`Delete failed for ${target.table}:`, error.message)
    }
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message ?? 'Failed to delete user.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
