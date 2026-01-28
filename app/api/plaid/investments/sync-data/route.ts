import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const supabase = createClient(
  'https://iimlwwmxbaeinfcpqsxp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'
)

const plaidEnv = (process.env.PLAID_ENV ?? 'sandbox') as keyof typeof PlaidEnvironments
const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[plaidEnv],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
        'PLAID-SECRET': process.env.PLAID_SECRET!,
        'Plaid-Version': '2020-09-14',
      },
    },
  }),
)

type SyncResult = {
  success: boolean
  count?: number
  inserted?: number
  updated?: number
  error?: string
}

export async function POST(request: Request) {
  let body: { userId?: string } | null = null
  try {
    body = (await request.json()) as { userId?: string }
  } catch {
    body = null
  }

  try {
    let query = supabase.from('plaid_investment_items').select('*')
    if (body?.userId) {
      query = query.eq('user_id', body.userId)
    }

    const { data: items, error } = await query
    if (error) {
      throw error
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ success: true, message: 'No investment items to sync', count: 0 })
    }

    const itemResults: SyncResult[] = []

    for (const item of items) {
      const result = await syncPlaidInvestments(item)
      itemResults.push(result)
      await supabase
        .from('plaid_investment_items')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', item.id)
    }

    return NextResponse.json({
      success: true,
      count: itemResults.reduce((sum, r) => sum + (r.count ?? 0), 0),
      items: itemResults,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? 'Failed to sync' }, { status: 500 })
  }
}

async function syncPlaidInvestments(item: any): Promise<SyncResult> {
  try {
    const response = await plaidClient.investmentsHoldingsGet({
      access_token: item.access_token,
    })

    const holdings = response.data.holdings || []
    const securities = response.data.securities || []
    const accounts = response.data.accounts || []

    if (holdings.length === 0) {
      return { success: true, count: 0 }
    }

    const accountMap = new Map(accounts.map((account: any) => [account.account_id, account]))
    const securityMap = new Map(securities.map((security: any) => [security.security_id, security]))

    const accountIds = holdings.map((holding: any) => holding.account_id)
    const { data: existingHoldings } = await supabase
      .from('plaid_investments')
      .select('account_id, security_id')
      .eq('user_id', item.user_id)
      .in('account_id', accountIds)

    const existingKeys = new Set(
      (existingHoldings || []).map(
        (row: any) => `${row.account_id || ''}:${row.security_id || ''}`,
      ),
    )

    const now = new Date().toISOString()
    const holdingsToUpsert = holdings.map((holding: any) => {
      const account = accountMap.get(holding.account_id)
      const security = securityMap.get(holding.security_id)
      const price =
        holding.institution_price ??
        security?.close_price ??
        security?.price ??
        null
      const value =
        holding.institution_value ??
        (price && holding.quantity ? price * holding.quantity : null)
      const currency =
        holding.iso_currency_code ??
        security?.iso_currency_code ??
        holding.unofficial_currency_code ??
        security?.unofficial_currency_code ??
        null
      const lastUpdated =
        holding.institution_price_as_of ??
        security?.close_price_as_of ??
        security?.price_as_of ??
        null

      return {
        user_id: item.user_id,
        plaid_item_id: item.id,
        account_id: holding.account_id,
        account_name: account?.name ?? null,
        account_type: account?.type ?? null,
        account_subtype: account?.subtype ?? null,
        institution_name: item.institution_name ?? null,
        security_id: holding.security_id ?? null,
        security_name: security?.name ?? null,
        symbol: security?.ticker_symbol ?? null,
        quantity: holding.quantity ?? null,
        price,
        value,
        cost_basis: holding.cost_basis ?? null,
        iso_currency_code: currency,
        unofficial_currency_code: security?.unofficial_currency_code ?? null,
        last_updated_at: lastUpdated,
        updated_at: now,
      }
    })

    const BATCH_SIZE = 100
    let inserted = 0
    let updated = 0

    for (let i = 0; i < holdingsToUpsert.length; i += BATCH_SIZE) {
      const batch = holdingsToUpsert.slice(i, i + BATCH_SIZE)

      const { error: upsertError } = await supabase
        .from('plaid_investments')
        .upsert(batch, {
          onConflict: 'user_id,account_id,security_id',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        throw upsertError
      }

      batch.forEach((row: any) => {
        const key = `${row.account_id || ''}:${row.security_id || ''}`
        if (existingKeys.has(key)) {
          updated++
        } else {
          inserted++
        }
      })
    }

    return { success: true, count: holdings.length, inserted, updated }
  } catch (error: any) {
    return { success: false, error: error?.message ?? 'Failed to sync investments' }
  }
}
