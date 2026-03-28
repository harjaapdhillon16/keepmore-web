import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { POST as runPlaidSync } from '../../plaid/sync-data/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  'https://iimlwwmxbaeinfcpqsxp.supabase.co'
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

const PLAID_ITEMS_PAGE_SIZE = 1000
const USER_SYNC_CONCURRENCY = 2

type SyncDataResponse = {
  success?: boolean
  message?: string
  totalItems?: number
  itemsSucceeded?: number
  itemsFailed?: number
  error?: string
  details?: string
}

type UserSyncResult = {
  userId: string
  success: boolean
  totalItems: number
  itemsSucceeded: number
  itemsFailed: number
  error?: string
}

function getUnauthorizedResponse(request: Request) {
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    if (process.env.NODE_ENV !== 'production') {
      return null
    }

    return NextResponse.json(
      { success: false, error: 'CRON_SECRET is not configured.' },
      { status: 500 },
    )
  }

  const authorization = request.headers.get('authorization')
  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

async function getPlaidUserIds() {
  const userIds = new Set<string>()
  let offset = 0

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('plaid_items')
      .select('id, user_id')
      .not('user_id', 'is', null)
      .order('id', { ascending: true })
      .range(offset, offset + PLAID_ITEMS_PAGE_SIZE - 1)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      break
    }

    for (const row of data) {
      if (typeof row.user_id === 'string' && row.user_id.length > 0) {
        userIds.add(row.user_id)
      }
    }

    if (data.length < PLAID_ITEMS_PAGE_SIZE) {
      break
    }

    offset += PLAID_ITEMS_PAGE_SIZE
  }

  return Array.from(userIds)
}

async function syncUser(request: Request, userId: string): Promise<UserSyncResult> {
  const syncRequest = new Request(new URL('/api/plaid/sync-data', request.url), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })

  try {
    const response = await runPlaidSync(syncRequest)
    const payload = (await response.json().catch(() => null)) as SyncDataResponse | null

    return {
      userId,
      success: response.ok && payload?.success !== false,
      totalItems: payload?.totalItems ?? 0,
      itemsSucceeded: payload?.itemsSucceeded ?? 0,
      itemsFailed: payload?.itemsFailed ?? 0,
      error: payload?.error ?? payload?.details,
    }
  } catch (error) {
    return {
      userId,
      success: false,
      totalItems: 0,
      itemsSucceeded: 0,
      itemsFailed: 0,
      error: error instanceof Error ? error.message : 'Failed to sync user',
    }
  }
}

async function handleCronSync(request: Request) {
  const unauthorizedResponse = getUnauthorizedResponse(request)
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const startedAt = Date.now()
  const userIds = await getPlaidUserIds()

  if (userIds.length === 0) {
    return NextResponse.json({
      success: true,
      message: 'No Plaid users found to sync.',
      totalUsers: 0,
      usersSucceeded: 0,
      usersFailed: 0,
      durationMs: Date.now() - startedAt,
    })
  }

  const userResults: UserSyncResult[] = []

  for (let index = 0; index < userIds.length; index += USER_SYNC_CONCURRENCY) {
    const batch = userIds.slice(index, index + USER_SYNC_CONCURRENCY)
    const batchResults = await Promise.all(batch.map((userId) => syncUser(request, userId)))
    userResults.push(...batchResults)
  }

  const usersSucceeded = userResults.filter((result) => result.success).length
  const usersFailed = userResults.length - usersSucceeded

  return NextResponse.json(
    {
      success: usersFailed === 0,
      message: 'Weekly Plaid sync completed.',
      totalUsers: userIds.length,
      usersSucceeded,
      usersFailed,
      totalItemsSynced: userResults.reduce((sum, result) => sum + result.totalItems, 0),
      durationMs: Date.now() - startedAt,
      failedUsers: userResults.filter((result) => !result.success),
    },
    { status: usersFailed === 0 ? 200 : 207 },
  )
}

export async function GET(request: Request) {
  try {
    return await handleCronSync(request)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run Plaid cron sync',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
