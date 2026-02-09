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

const parseAllowlist = () =>
  (process.env.ADMIN_EMAIL_ALLOWLIST ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

const fetchAll = async <T>(
  builder: (from: number, to: number) => Promise<{ data: T[] | null; error: any }>,
) => {
  const pageSize = 1000
  let from = 0
  const rows: T[] = []

  while (true) {
    const { data, error } = await builder(from, from + pageSize - 1)
    if (error) throw error
    const batch = data ?? []
    rows.push(...batch)
    if (batch.length < pageSize) break
    from += pageSize
  }

  return rows
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token)

  if (authError || !authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowlist = parseAllowlist()
  if (allowlist.length > 0 && !allowlist.includes(authData.user.email?.toLowerCase() ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const now = new Date()
  const date7 = new Date(now)
  date7.setDate(date7.getDate() - 7)
  const date30 = new Date(now)
  date30.setDate(date30.getDate() - 30)
  const date12m = new Date(now)
  date12m.setMonth(date12m.getMonth() - 12)

  const toDateString = (date: Date) => date.toISOString().split('T')[0]
  const date30Str = toDateString(date30)
  const date12Str = toDateString(date12m)

  const users: Array<{ id: string; created_at: string }> = []
  const perPage = 1000
  let page = 1
  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    })
    if (error) throw error
    users.push(...data.users.map((u) => ({ id: u.id, created_at: u.created_at })))
    if (data.users.length < perPage) break
    page += 1
  }

  const newUsers7d = users.filter((u) => new Date(u.created_at) >= date7).length
  const newUsers30d = users.filter((u) => new Date(u.created_at) >= date30).length

  const signupsLast14 = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (13 - i))
    return {
      date: toDateString(date),
      count: 0,
    }
  })

  signupsLast14.forEach((day) => {
    day.count = users.filter(
      (u) => toDateString(new Date(u.created_at)) === day.date,
    ).length
  })

  const activity7d = await fetchAll<{ user_id: string }>((from, to) =>
    supabaseAdmin
      .from('user_activity')
      .select('user_id')
      .gte('created_at', date7.toISOString())
      .range(from, to),
  )
  const activity1d = await fetchAll<{ user_id: string }>((from, to) =>
    supabaseAdmin
      .from('user_activity')
      .select('user_id')
      .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
      .range(from, to),
  )

  const dau = new Set(activity1d.map((row) => row.user_id)).size
  const wau = new Set(activity7d.map((row) => row.user_id)).size

  const { count: plaidItemsCount } = await supabaseAdmin
    .from('plaid_items')
    .select('id', { count: 'exact', head: true })

  const { count: plaidAccountsCount } = await supabaseAdmin
    .from('plaid_accounts')
    .select('id', { count: 'exact', head: true })

  const { count: recurringCount } = await supabaseAdmin
    .from('plaid_recurring_transactions')
    .select('id', { count: 'exact', head: true })

  const { count: goalsCount } = await supabaseAdmin
    .from('financial_goals')
    .select('id', { count: 'exact', head: true })

  const { count: insights7dCount } = await supabaseAdmin
    .from('financial_insights')
    .select('id', { count: 'exact', head: true })
    .gte('generated_at', date7.toISOString())

  const { count: insights30dCount } = await supabaseAdmin
    .from('financial_insights')
    .select('id', { count: 'exact', head: true })
    .gte('generated_at', date30.toISOString())

  const { count: activeSubscriptions } = await supabaseAdmin
    .from('revenuecat_subscriptions')
    .select('app_user_id', { count: 'exact', head: true })
    .eq('is_active', true)

  const transactions30 = await fetchAll<{ amount: number; date: string }>((from, to) =>
    supabaseAdmin
      .from('plaid_transactions')
      .select('amount, date')
      .gte('date', date30Str)
      .range(from, to),
  )

  const transactions12m = await fetchAll<{ amount: number; date: string }>((from, to) =>
    supabaseAdmin
      .from('plaid_transactions')
      .select('amount, date')
      .gte('date', date12Str)
      .range(from, to),
  )

  const sumAmounts = (rows: Array<{ amount: number }>) =>
    rows.reduce((sum, row) => sum + Math.abs(Number(row.amount ?? 0)), 0)

  const transactions30Total = sumAmounts(transactions30)
  const transactions12Total = sumAmounts(transactions12m)

  const transactionTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (29 - i))
    return {
      date: toDateString(date),
      count: 0,
      total: 0,
    }
  })

  transactions30.forEach((tx) => {
    const day = toDateString(new Date(tx.date))
    const entry = transactionTrend.find((item) => item.date === day)
    if (entry) {
      entry.count += 1
      entry.total += Math.abs(Number(tx.amount ?? 0))
    }
  })

  const { data: plaidItems } = await supabaseAdmin
    .from('plaid_items')
    .select('institution_name')

  const institutionMap = (plaidItems ?? []).reduce((acc, item: any) => {
    const name = item.institution_name ?? 'Unknown'
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topInstitutions = Object.entries(institutionMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

    return NextResponse.json({
      success: true,
      metrics: {
        totals: {
          users: users.length,
          connectedInstitutions: plaidItemsCount ?? 0,
          connectedAccounts: plaidAccountsCount ?? 0,
          recurring: recurringCount ?? 0,
          goals: goalsCount ?? 0,
          insights7d: insights7dCount ?? 0,
          insights30d: insights30dCount ?? 0,
          activeSubscriptions: activeSubscriptions ?? 0,
        },
        activity: {
          dau,
          wau,
          newUsers7d,
          newUsers30d,
        },
        volume: {
          transactions30dCount: transactions30.length,
          transactions30dTotal: transactions30Total,
          transactions12mCount: transactions12m.length,
          transactions12mTotal: transactions12Total,
        },
        trends: {
          signupsLast14Days: signupsLast14,
          transactionsLast30Days: transactionTrend,
        },
        topInstitutions,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Unable to load metrics.' },
      { status: 500 },
    )
  }
}
