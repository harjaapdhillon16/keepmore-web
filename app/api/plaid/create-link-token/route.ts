import { NextResponse } from 'next/server'
import { CountryCode, Products, type LinkTokenCreateRequest } from 'plaid'
import { plaidClient } from '../../../../lib/plaid'

type CreateLinkTokenBody = {
  userId?: string
  platform?: string
}

const REQUIRED_ENV = ['PLAID_CLIENT_ID', 'PLAID_SECRET'] as const

const getMissingEnv = () =>
  REQUIRED_ENV.filter((key) => !process.env[key] || process.env[key]?.length === 0)

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
  const missingEnv = getMissingEnv()
  if (missingEnv.length > 0) {
    return NextResponse.json(
      { error: `Missing Plaid configuration: ${missingEnv.join(', ')}` },
      { status: 500 },
    )
  }

  let body: CreateLinkTokenBody | null = null
  try {
    body = (await request.json()) as CreateLinkTokenBody
  } catch {
    body = null
  }

  if (!body?.userId || typeof body.userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const platform = typeof body.platform === 'string' ? body.platform : undefined
  const linkTokenRequest: LinkTokenCreateRequest = {
    user: { client_user_id: body.userId },
    client_name: 'KeepMore',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
  }

  if (platform === 'ios' && process.env.PLAID_REDIRECT_URI) {
    linkTokenRequest.redirect_uri = process.env.PLAID_REDIRECT_URI
  }
  if (platform === 'android' && process.env.PLAID_ANDROID_PACKAGE_NAME) {
    linkTokenRequest.android_package_name = process.env.PLAID_ANDROID_PACKAGE_NAME
  }
  if (process.env.PLAID_WEBHOOK_URL) {
    linkTokenRequest.webhook = process.env.PLAID_WEBHOOK_URL
  }

  try {
    const response = await plaidClient.linkTokenCreate(linkTokenRequest)
    return NextResponse.json({
      linkToken: response.data.link_token,
      expiration: response.data.expiration,
      requestId: response.data.request_id,
    })
  } catch (error) {
    return NextResponse.json({ error: getPlaidErrorMessage(error) }, { status: 500 })
  }
}
