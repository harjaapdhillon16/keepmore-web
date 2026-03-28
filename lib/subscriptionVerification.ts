import { createPrivateKey, createSign } from 'crypto'

export type SupportedStore = 'APP_STORE' | 'PLAY_STORE'

export type VerificationInput = {
  store: SupportedStore
  productId?: string | null
  transactionId?: string | null
  originalTransactionId?: string | null
  purchaseToken?: string | null
  environment?: string | null
}

export type VerifiedSubscription = {
  isActive: boolean
  productId: string | null
  transactionId: string | null
  originalTransactionId: string | null
  purchaseToken: string | null
  purchaseDate: string | null
  expirationDate: string | null
  environment: string | null
  autoRenewing: boolean | null
  periodType: string | null
  store: SupportedStore
  raw: unknown
}

class VerificationError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message)
    this.name = 'VerificationError'
  }
}

type AppStoreHistoryResponse = {
  environment?: string
  signedTransactions?: string[]
}

type AppStoreTransaction = {
  environment?: string
  expiresDate?: number | string | null
  offerType?: number | null
  originalPurchaseDate?: number | string | null
  originalTransactionId?: string | null
  productId?: string | null
  purchaseDate?: number | string | null
  revocationDate?: number | string | null
  transactionId?: string | null
}

type GoogleAccessTokenResponse = {
  access_token?: string
}

type GoogleSubscriptionLineItem = {
  expiryTime?: string | null
  productId?: string | null
  autoRenewingPlan?: {
    autoRenewEnabled?: boolean | null
  } | null
  offerDetails?: {
    offerTags?: string[] | null
  } | null
}

type GoogleSubscriptionResponse = {
  acknowledgementState?: string
  lineItems?: GoogleSubscriptionLineItem[]
  startTime?: string
  subscriptionState?: string
  testPurchase?: Record<string, unknown> | null
}

const defaultBundleId = 'com.priyanshukumar18.keepmore'
const defaultPackageName = 'com.priyanshukumar18.keepmore'
const androidPublisherScope = 'https://www.googleapis.com/auth/androidpublisher'

const normalizeMultilineSecret = (value?: string | null) =>
  value?.replace(/\\n/g, '\n').trim() ?? null

const base64UrlEncode = (value: Buffer | string) =>
  Buffer.from(value).toString('base64url')

const encodeJson = (value: unknown) => base64UrlEncode(JSON.stringify(value))

const decodeSignedPayload = <T,>(value: string): T => {
  const [, payload] = value.split('.')
  if (!payload) {
    throw new VerificationError('Invalid signed payload from store.', 502)
  }

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T
  } catch {
    throw new VerificationError('Unable to decode signed payload from store.', 502)
  }
}

const signJwt = (
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  privateKeyPem: string,
  algorithm: 'ES256' | 'RS256',
) => {
  const encodedHeader = encodeJson(header)
  const encodedPayload = encodeJson(payload)
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  const signer = createSign('sha256')
  signer.update(unsignedToken)
  signer.end()

  const signature =
    algorithm === 'ES256'
      ? signer.sign({ key: createPrivateKey(privateKeyPem), dsaEncoding: 'ieee-p1363' })
      : signer.sign(createPrivateKey(privateKeyPem))

  return `${unsignedToken}.${base64UrlEncode(signature)}`
}

const normalizeTimestamp = (value?: number | string | null) => {
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

const isFutureTimestamp = (value?: string | null) =>
  Boolean(value && new Date(value).getTime() > Date.now())

const inferPeriodType = (offerType?: number | null) => {
  if (offerType === 1) return 'intro'
  if (offerType === 2 || offerType === 3) return 'promotional'
  return null
}

const getAppStoreAuthToken = () => {
  const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID?.trim()
  const keyId = process.env.APP_STORE_CONNECT_KEY_ID?.trim()
  const privateKey = normalizeMultilineSecret(process.env.APP_STORE_CONNECT_PRIVATE_KEY)
  const bundleId = process.env.APP_STORE_BUNDLE_ID?.trim() || defaultBundleId

  if (!issuerId || !keyId || !privateKey) {
    throw new VerificationError('App Store verification is not configured.', 500)
  }

  const now = Math.floor(Date.now() / 1000)
  return signJwt(
    {
      alg: 'ES256',
      kid: keyId,
      typ: 'JWT',
    },
    {
      iss: issuerId,
      iat: now,
      exp: now + 300,
      aud: 'appstoreconnect-v1',
      bid: bundleId,
    },
    privateKey,
    'ES256',
  )
}

const getAppStoreBaseUrls = (environment?: string | null) => {
  const isSandbox =
    typeof environment === 'string' &&
    (environment.toLowerCase().includes('sandbox') || environment.toLowerCase().includes('xcode'))

  const urls = isSandbox
    ? [
        'https://api.storekit-sandbox.itunes.apple.com',
        'https://api.storekit.itunes.apple.com',
      ]
    : [
        'https://api.storekit.itunes.apple.com',
        'https://api.storekit-sandbox.itunes.apple.com',
      ]

  return Array.from(new Set(urls))
}

const selectLatestGoogleLineItem = (
  lineItems: GoogleSubscriptionLineItem[],
  productId?: string | null,
) => {
  const filtered = productId
    ? lineItems.filter((lineItem) => lineItem.productId === productId)
    : lineItems

  return [...filtered].sort((left, right) => {
    const leftExpiry = normalizeTimestamp(left.expiryTime)
      ? new Date(normalizeTimestamp(left.expiryTime) as string).getTime()
      : 0
    const rightExpiry = normalizeTimestamp(right.expiryTime)
      ? new Date(normalizeTimestamp(right.expiryTime) as string).getTime()
      : 0
    return rightExpiry - leftExpiry
  })[0] ?? null
}

const fetchAppStoreHistory = async (input: VerificationInput) => {
  const transactionReference = input.originalTransactionId ?? input.transactionId
  if (!transactionReference) {
    throw new VerificationError('Missing App Store transaction identifier.', 400)
  }

  const authToken = getAppStoreAuthToken()
  let lastError: VerificationError | null = null

  for (const baseUrl of getAppStoreBaseUrls(input.environment)) {
    const url = new URL(
      `/inApps/v2/history/${encodeURIComponent(transactionReference)}`,
      baseUrl,
    )
    url.searchParams.set('sort', 'DESCENDING')
    url.searchParams.set('revoked', 'false')

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
    })

    if (response.ok) {
      return (await response.json()) as AppStoreHistoryResponse
    }

    if (response.status === 404) {
      lastError = new VerificationError('Subscription not found in App Store history.', 404)
      continue
    }

    const message = await response.text().catch(() => '')
    lastError = new VerificationError(
      message || 'App Store verification failed.',
      response.status >= 500 ? 502 : response.status,
    )
  }

  throw lastError ?? new VerificationError('App Store verification failed.', 502)
}

const verifyAppStoreSubscription = async (
  input: VerificationInput,
): Promise<VerifiedSubscription> => {
  const history = await fetchAppStoreHistory(input)
  const signedTransactions = history.signedTransactions ?? []
  const transactions = signedTransactions.map((value) =>
    decodeSignedPayload<AppStoreTransaction>(value),
  )
  const transaction =
    transactions.find((item) => !input.productId || item.productId === input.productId) ??
    transactions[0] ??
    null

  if (!transaction) {
    return {
      isActive: false,
      productId: input.productId ?? null,
      transactionId: input.transactionId ?? null,
      originalTransactionId: input.originalTransactionId ?? null,
      purchaseToken: input.purchaseToken ?? null,
      purchaseDate: null,
      expirationDate: null,
      environment: history.environment ?? input.environment ?? null,
      autoRenewing: null,
      periodType: null,
      store: 'APP_STORE',
      raw: history,
    }
  }

  const purchaseDate =
    normalizeTimestamp(transaction.purchaseDate) ??
    normalizeTimestamp(transaction.originalPurchaseDate)
  const expirationDate = normalizeTimestamp(transaction.expiresDate)
  const revokedAt = normalizeTimestamp(transaction.revocationDate)

  return {
    isActive: !revokedAt && isFutureTimestamp(expirationDate),
    productId: transaction.productId ?? input.productId ?? null,
    transactionId: transaction.transactionId ?? input.transactionId ?? null,
    originalTransactionId:
      transaction.originalTransactionId ?? input.originalTransactionId ?? null,
    purchaseToken: input.purchaseToken ?? null,
    purchaseDate,
    expirationDate,
    environment: transaction.environment ?? history.environment ?? input.environment ?? null,
    autoRenewing: null,
    periodType: inferPeriodType(transaction.offerType),
    store: 'APP_STORE',
    raw: {
      history,
      transaction,
    },
  }
}

const getGoogleAccessToken = async () => {
  const clientEmail = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL?.trim()
  const privateKey = normalizeMultilineSecret(
    process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY,
  )

  if (!clientEmail || !privateKey) {
    throw new VerificationError('Google Play verification is not configured.', 500)
  }

  const now = Math.floor(Date.now() / 1000)
  const assertion = signJwt(
    {
      alg: 'RS256',
      typ: 'JWT',
    },
    {
      iss: clientEmail,
      scope: androidPublisherScope,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    },
    privateKey,
    'RS256',
  )

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new VerificationError(
      message || 'Google Play access token request failed.',
      response.status >= 500 ? 502 : response.status,
    )
  }

  const payload = (await response.json()) as GoogleAccessTokenResponse
  if (!payload.access_token) {
    throw new VerificationError('Google Play access token response was invalid.', 502)
  }

  return payload.access_token
}

const verifyGooglePlaySubscription = async (
  input: VerificationInput,
): Promise<VerifiedSubscription> => {
  if (!input.purchaseToken) {
    throw new VerificationError('Missing Google Play purchase token.', 400)
  }

  const accessToken = await getGoogleAccessToken()
  const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME?.trim() || defaultPackageName
  const url = new URL(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(
      packageName,
    )}/purchases/subscriptionsv2/tokens/${encodeURIComponent(input.purchaseToken)}`,
  )

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (response.status === 404) {
    return {
      isActive: false,
      productId: input.productId ?? null,
      transactionId: input.transactionId ?? null,
      originalTransactionId: input.originalTransactionId ?? null,
      purchaseToken: input.purchaseToken,
      purchaseDate: null,
      expirationDate: null,
      environment: null,
      autoRenewing: null,
      periodType: null,
      store: 'PLAY_STORE',
      raw: null,
    }
  }

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new VerificationError(
      message || 'Google Play verification failed.',
      response.status >= 500 ? 502 : response.status,
    )
  }

  const payload = (await response.json()) as GoogleSubscriptionResponse
  const lineItem = selectLatestGoogleLineItem(payload.lineItems ?? [], input.productId)
  const expirationDate = normalizeTimestamp(lineItem?.expiryTime)
  const state = payload.subscriptionState ?? null
  const isActive =
    (state === 'SUBSCRIPTION_STATE_ACTIVE' ||
      state === 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD' ||
      (state === 'SUBSCRIPTION_STATE_CANCELED' && isFutureTimestamp(expirationDate))) &&
    (isFutureTimestamp(expirationDate) || state === 'SUBSCRIPTION_STATE_ACTIVE')

  return {
    isActive,
    productId: lineItem?.productId ?? input.productId ?? null,
    transactionId: input.transactionId ?? null,
    originalTransactionId: input.originalTransactionId ?? null,
    purchaseToken: input.purchaseToken,
    purchaseDate: normalizeTimestamp(payload.startTime),
    expirationDate,
    environment: payload.testPurchase ? 'TEST' : 'PRODUCTION',
    autoRenewing: lineItem?.autoRenewingPlan?.autoRenewEnabled ?? null,
    periodType: null,
    store: 'PLAY_STORE',
    raw: payload,
  }
}

export const isVerificationError = (error: unknown): error is VerificationError =>
  error instanceof VerificationError

export async function verifyStoreSubscription(
  input: VerificationInput,
): Promise<VerifiedSubscription> {
  if (input.store === 'APP_STORE') {
    return verifyAppStoreSubscription(input)
  }

  if (input.store === 'PLAY_STORE') {
    return verifyGooglePlaySubscription(input)
  }

  throw new VerificationError('Unsupported store.', 400)
}
