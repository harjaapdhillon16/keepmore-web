import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  isVerificationError,
  verifyStoreSubscription,
  type SupportedStore,
} from '../../../../lib/subscriptionVerification'

type SubscriptionSyncBody = {
  reason?: string
  eventType?: string
  isActive?: boolean
  productId?: string | null
  transactionId?: string | null
  originalTransactionId?: string | null
  purchaseToken?: string | null
  transactionDate?: number | string | null
  expirationDate?: number | string | null
  environment?: string | null
  autoRenewing?: boolean | null
  store?: string | null
  periodType?: string | null
  payload?: unknown
}

type ExistingSubscription = {
  product_id?: string | null
  entitlement_id?: string | null
  store?: string | null
  period_type?: string | null
  environment?: string | null
  purchase_date?: string | null
  expiration_date?: string | null
}

const entitlementId = 'premium'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const normalizeAuthHeader = (value: string) =>
  value.replace(/^Bearer\s+/i, '').trim()

const parseTimestamp = (value?: number | string | null) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
      return new Date(numeric).toISOString()
    }

    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }

  return null
}

const normalizeStore = (value?: string | null) => {
  if (!value) return null
  const normalized = value.trim().toUpperCase()
  if (normalized === 'APP_STORE' || normalized === 'PLAY_STORE') {
    return normalized
  }
  return normalized.length > 0 ? normalized : null
}

const buildEventId = (
  userId: string,
  body: SubscriptionSyncBody,
  purchaseDate: string | null,
  expirationDate: string | null,
) => {
  return createHash('sha256')
    .update(
      [
        userId,
        body.eventType ?? '',
        body.productId ?? '',
        body.transactionId ?? '',
        body.originalTransactionId ?? '',
        purchaseDate ?? '',
        expirationDate ?? '',
        String(body.isActive ?? ''),
      ].join('|'),
    )
    .digest('hex')
}

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
  const authHeader = request.headers.get('authorization') ?? ''
  const token = normalizeAuthHeader(authHeader)

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: SubscriptionSyncBody | null = null
  try {
    body = (await request.json()) as SubscriptionSyncBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (typeof body?.isActive !== 'boolean') {
    return NextResponse.json({ error: 'isActive is required' }, { status: 400 })
  }

  const { data, error: existingError } = await supabaseAdmin
    .from('revenuecat_subscriptions')
    .select(
      'product_id, entitlement_id, store, period_type, environment, purchase_date, expiration_date',
    )
    .eq('app_user_id', authData.user.id)
    .maybeSingle()

  const existingSubscription = (data ?? null) as ExistingSubscription | null

  if (existingError) {
    return NextResponse.json(
      { error: `Failed to load existing subscription: ${existingError.message}` },
      { status: 500 },
    )
  }

  const purchaseDate =
    parseTimestamp(body.transactionDate) ?? existingSubscription?.purchase_date ?? null
  const expirationDate =
    parseTimestamp(body.expirationDate) ?? existingSubscription?.expiration_date ?? null
  const productId = body.productId ?? existingSubscription?.product_id ?? null

  if (!body.isActive && !productId && !existingSubscription) {
    return NextResponse.json({
      success: true,
      isActive: false,
      subscription: null,
    })
  }

  const store = normalizeStore(body.store) ?? existingSubscription?.store ?? null
  let verified = null as Awaited<ReturnType<typeof verifyStoreSubscription>> | null

  try {
    if (store === 'APP_STORE' || store === 'PLAY_STORE') {
      const hasVerificationReference =
        store === 'APP_STORE'
          ? Boolean(body.transactionId || body.originalTransactionId)
          : Boolean(body.purchaseToken)

      if (body.isActive && !hasVerificationReference) {
        return NextResponse.json(
          { error: 'Missing store verification reference for active subscription.' },
          { status: 400 },
        )
      }

      if (hasVerificationReference) {
        verified = await verifyStoreSubscription({
          store: store as SupportedStore,
          productId,
          transactionId: body.transactionId ?? null,
          originalTransactionId: body.originalTransactionId ?? null,
          purchaseToken: body.purchaseToken ?? null,
          environment: body.environment ?? existingSubscription?.environment ?? null,
        })
      }
    } else if (body.isActive) {
      return NextResponse.json({ error: 'Unsupported store for subscription sync.' }, { status: 400 })
    }
  } catch (error) {
    if (isVerificationError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    return NextResponse.json({ error: 'Subscription verification failed.' }, { status: 500 })
  }

  const resolvedIsActive = verified?.isActive ?? body.isActive
  const resolvedProductId = verified?.productId ?? productId
  const resolvedPurchaseDate = verified?.purchaseDate ?? purchaseDate
  const resolvedExpirationDate = verified?.expirationDate ?? expirationDate
  const resolvedStore = verified?.store ?? (store as SupportedStore | null)
  const environment =
    verified?.environment ?? body.environment ?? existingSubscription?.environment ?? null
  const periodType = verified?.periodType ?? body.periodType ?? existingSubscription?.period_type ?? null

  if (resolvedIsActive && !resolvedProductId) {
    return NextResponse.json({ error: 'productId is required for active subscriptions' }, { status: 400 })
  }

  const eventType = body.eventType ?? (resolvedIsActive ? 'SYNC_ACTIVE' : 'SYNC_INACTIVE')
  const eventTimestamp = resolvedPurchaseDate ?? resolvedExpirationDate ?? new Date().toISOString()
  const eventId = buildEventId(
    authData.user.id,
    {
      ...body,
      isActive: resolvedIsActive,
      productId: resolvedProductId,
      transactionId: verified?.transactionId ?? body.transactionId ?? null,
      originalTransactionId:
        verified?.originalTransactionId ?? body.originalTransactionId ?? null,
    },
    resolvedPurchaseDate,
    resolvedExpirationDate,
  )

  const payload = {
    userId: authData.user.id,
    reason: body.reason ?? null,
    productId: resolvedProductId,
    transactionId: verified?.transactionId ?? body.transactionId ?? null,
    originalTransactionId: verified?.originalTransactionId ?? body.originalTransactionId ?? null,
    purchaseToken: verified?.purchaseToken ?? body.purchaseToken ?? null,
    transactionDate: resolvedPurchaseDate,
    expirationDate: resolvedExpirationDate,
    environment,
    autoRenewing: verified?.autoRenewing ?? body.autoRenewing ?? null,
    store: resolvedStore,
    payload: body.payload ?? null,
    verification: verified?.raw ?? null,
  }

  const { error: eventError } = await supabaseAdmin
    .from('revenuecat_events')
    .upsert(
      {
        id: eventId,
        app_user_id: authData.user.id,
        type: eventType,
        product_id: resolvedProductId,
        entitlement_id: entitlementId,
        entitlement_ids: [entitlementId],
        environment,
        event_timestamp: eventTimestamp,
        payload,
      },
      { onConflict: 'id' },
    )

  if (eventError) {
    return NextResponse.json(
      { error: `Failed to save subscription event: ${eventError.message}` },
      { status: 500 },
    )
  }

  const { error: subscriptionError } = await supabaseAdmin
    .from('revenuecat_subscriptions')
    .upsert(
      {
        app_user_id: authData.user.id,
        entitlement_id: existingSubscription?.entitlement_id ?? entitlementId,
        product_id: resolvedProductId,
        store: resolvedStore,
        period_type: periodType,
        environment,
        purchase_date: resolvedPurchaseDate,
        expiration_date: resolvedExpirationDate,
        is_active: resolvedIsActive,
        latest_event_id: eventId,
        latest_event_type: eventType,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'app_user_id' },
    )

  if (subscriptionError) {
    return NextResponse.json(
      { error: `Failed to update subscription row: ${subscriptionError.message}` },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    isActive: resolvedIsActive,
    subscription: {
      product_id: resolvedProductId,
      expiration_date: resolvedExpirationDate,
      is_active: resolvedIsActive,
      period_type: periodType,
    },
  })
}
