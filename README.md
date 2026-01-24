# KeepMore Web

Next.js 14 app router for the marketing site and API routes.

## Quick start

- `npm install`
- `npm run dev`

## Notes

- Tailwind CSS and Framer Motion are preconfigured.
- API routes are stubbed and ready for Plaid, Supabase, and RevenueCat wiring.

## Plaid setup

Set these variables in `web/.env.local` before running the API routes:

- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV` (e.g. `sandbox`)
- `PLAID_ANDROID_PACKAGE_NAME` (required for Android OAuth institutions)
- `PLAID_REDIRECT_URI` (required for iOS OAuth institutions)
- `PLAID_WEBHOOK_URL` (optional)
