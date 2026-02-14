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

// Helper to create log context
const createLogContext = (data: Record<string, unknown>) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    service: 'plaid-link-token',
    ...data,
  })
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  
  console.log(createLogContext({
    level: 'info',
    message: 'Link token creation request started',
    requestId,
  }))

  // Check environment variables
  const missingEnv = getMissingEnv()
  if (missingEnv.length > 0) {
    console.error(createLogContext({
      level: 'error',
      message: 'Missing Plaid environment variables',
      requestId,
      missingEnv,
    }))
    
    return NextResponse.json(
      { error: `Missing Plaid configuration: ${missingEnv.join(', ')}` },
      { status: 500 },
    )
  }

  // Parse request body
  let body: CreateLinkTokenBody | null = null
  try {
    body = (await request.json()) as CreateLinkTokenBody
    console.log(createLogContext({
      level: 'info',
      message: 'Request body parsed',
      requestId,
      platform: body.platform,
      hasUserId: !!body.userId,
    }))
  } catch (error) {
    console.error(createLogContext({
      level: 'error',
      message: 'Failed to parse request body',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }))
    body = null
  }

  // Validate userId
  if (!body?.userId || typeof body.userId !== 'string') {
    console.error(createLogContext({
      level: 'error',
      message: 'Invalid or missing userId',
      requestId,
    }))
    
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const platform = typeof body.platform === 'string' ? body.platform : undefined
  const linkTokenRequest: LinkTokenCreateRequest = {
    user: { client_user_id: body.userId },
    client_name: 'KeepMore',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us, CountryCode.Ca],
    language: 'en',
  }

  if (platform === 'ios') {
    linkTokenRequest.redirect_uri = 'https://www.keepmore.finance/plaid'
  }
  if (platform === 'android' && process.env.PLAID_ANDROID_PACKAGE_NAME) {
    linkTokenRequest.android_package_name = process.env.PLAID_ANDROID_PACKAGE_NAME
  }
  if (process.env.PLAID_WEBHOOK_URL) {
    linkTokenRequest.webhook = process.env.PLAID_WEBHOOK_URL
  }

  console.log(createLogContext({
    level: 'info',
    message: 'Creating Plaid link token',
    requestId,
    platform,
    hasWebhook: !!process.env.PLAID_WEBHOOK_URL,
    hasRedirectUri: !!linkTokenRequest.redirect_uri,
    hasAndroidPackage: !!linkTokenRequest.android_package_name,
  }))

  try {
    const response = await plaidClient.linkTokenCreate(linkTokenRequest)
    
    console.log(createLogContext({
      level: 'info',
      message: 'Link token created successfully',
      requestId,
      plaidRequestId: response.data.request_id,
      expiresAt: response.data.expiration,
    }))
    
    return NextResponse.json({
      linkToken: response.data.link_token,
      expiration: response.data.expiration,
      requestId: response.data.request_id,
    })
  } catch (error) {
    const errorMessage = getPlaidErrorMessage(error)
    
    console.error(createLogContext({
      level: 'error',
      message: 'Plaid link token creation failed',
      requestId,
      error: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      // Include additional Plaid error details if available
      plaidErrorCode: (error as any)?.response?.data?.error_code,
      plaidErrorType: (error as any)?.response?.data?.error_type,
    }))
    
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}