# KeepMore Web

Next.js 14 app router for the marketing site and API routes.

## Quick start

- `npm install`
- `npm run dev`

## Notes

- Tailwind CSS and Framer Motion are preconfigured.
- API routes are stubbed and ready for Plaid, Supabase, and native subscription sync wiring.

## Plaid setup

Set these variables in `web/.env.local` before running the API routes:

- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV` (e.g. `sandbox`)
- `PLAID_ANDROID_PACKAGE_NAME` (required for Android OAuth institutions)
- `PLAID_REDIRECT_URI` (required for iOS OAuth institutions)
- `PLAID_WEBHOOK_URL` (optional)

## Subscription verification setup

The native subscription sync route verifies purchases against Apple and Google before writing to the existing `revenuecat_subscriptions` and `revenuecat_events` tables.

- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_PRIVATE_KEY`
- `APP_STORE_BUNDLE_ID` (optional if your bundle id is `com.priyanshukumar18.keepmore`)
- `GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_PLAY_PACKAGE_NAME` (optional if your package name is `com.priyanshukumar18.keepmore`)
