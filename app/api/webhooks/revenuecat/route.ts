import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

type RevenueCatEvent = {
  id?: string
  event_id?: string
  type?: string
  app_user_id?: string
  product_id?: string | null
  entitlement_id?: string | null
  entitlement_ids?: string[] | null
  store?: string | null
  period_type?: string | null
  environment?: string | null
  expiration_at_ms?: number | null
  purchased_at_ms?: number | null
  event_timestamp_ms?: number | null
}

type RevenueCatWebhookPayload = {
  api_version?: string
  event?: RevenueCatEvent
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  'https://iimlwwmxbaeinfcpqsxp.supabase.co'
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MzIyMSwiZXhwIjoyMDg0NDI5MjIxfQ.XpPo_lsDlcVJ3hr1Nfhcu62VTH9W9xPSE_nO_hFTV7M'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

const activeEventTypes = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
  'TEMPORARY_ENTITLEMENT_GRANT',
  'TEST',
])

const parseTimestamp = (value?: number | null) =>
  typeof value === 'number' ? new Date(value).toISOString() : null

const normalizeAuthHeader = (value: string) =>
  value.replace(/^Bearer\s+/i, '').trim()

export async function POST(request: NextRequest) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET
  if (secret) {
    const header = request.headers.get('authorization') ?? ''
    const token = normalizeAuthHeader(header)
    if (token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let payload: RevenueCatWebhookPayload | null = null
  try {
    payload = JSON.parse(await request.text()) as RevenueCatWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const event = payload?.event
  if (!event?.app_user_id || !event.type) {
    return NextResponse.json({ error: 'Missing event data' }, { status: 400 })
  }

  const eventId = event.id ?? event.event_id
  if (!eventId) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 })
  }

  const entitlementIds = Array.isArray(event.entitlement_ids)
    ? event.entitlement_ids
    : []
  const primaryEntitlement = event.entitlement_id ?? entitlementIds[0] ?? null
  const expirationAt = parseTimestamp(event.expiration_at_ms)
  const purchasedAt = parseTimestamp(event.purchased_at_ms)
  const eventTimestamp = parseTimestamp(
    event.event_timestamp_ms ?? event.purchased_at_ms ?? event.expiration_at_ms,
  )
  const isActive = expirationAt
    ? new Date(expirationAt).getTime() > Date.now()
    : activeEventTypes.has(event.type)

  const { error: eventError } = await supabaseAdmin
    .from('revenuecat_events')
    .upsert(
      {
        id: eventId,
        app_user_id: event.app_user_id,
        type: event.type,
        product_id: event.product_id ?? null,
        entitlement_id: primaryEntitlement,
        entitlement_ids: entitlementIds.length > 0 ? entitlementIds : null,
        environment: event.environment ?? null,
        event_timestamp: eventTimestamp,
        payload,
      },
      { onConflict: 'id' },
    )

  if (eventError) {
    return NextResponse.json(
      { error: `Failed to save RevenueCat event: ${eventError.message}` },
      { status: 500 },
    )
  }

  const { error: subscriptionError } = await supabaseAdmin
    .from('revenuecat_subscriptions')
    .upsert(
      {
        app_user_id: event.app_user_id,
        entitlement_id: primaryEntitlement,
        product_id: event.product_id ?? null,
        store: event.store ?? null,
        period_type: event.period_type ?? null,
        environment: event.environment ?? null,
        purchase_date: purchasedAt,
        expiration_date: expirationAt,
        is_active: isActive,
        latest_event_id: eventId,
        latest_event_type: event.type,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'app_user_id' },
    )

  if (subscriptionError) {
    return NextResponse.json(
      {
        error: `Failed to update RevenueCat subscription: ${subscriptionError.message}`,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ received: true })
}
