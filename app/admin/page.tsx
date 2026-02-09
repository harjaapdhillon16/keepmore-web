'use client'

import { useEffect, useState } from 'react'
import { createClient, type Session } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://iimlwwmxbaeinfcpqsxp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

type MetricsResponse = {
  success: boolean
  metrics: {
    totals: Record<string, number>
    activity: Record<string, number>
    volume: Record<string, number>
    trends: {
      signupsLast14Days: Array<{ date: string; count: number }>
      transactionsLast30Days: Array<{ date: string; count: number; total: number }>
    }
    topInstitutions: Array<{ name: string; count: number }>
  }
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState<MetricsResponse['metrics'] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const fetchMetrics = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = (await response.json()) as MetricsResponse
      if (!response.ok || !payload?.success) {
        throw new Error((payload as any)?.error ?? 'Unable to load metrics.')
      }
      setMetrics(payload.metrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load metrics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.access_token) {
      void fetchMetrics(session.access_token)
    } else {
      setMetrics(null)
    }
  }, [session?.access_token])

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Enter a valid email.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Only allow existing users to login
        },
      })
      if (signInError) throw signInError
      setOtpSent(true)
      setError('Check your email for the 8-digit code.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 8) {
      setError('Enter a valid 8-digit code.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (verifyError) throw verifyError
      // Session will be set automatically by onAuthStateChange
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setMetrics(null)
    setOtpSent(false)
    setEmail('')
    setOtp('')
    setError(null)
  }

  const handleBackToEmail = () => {
    setOtpSent(false)
    setOtp('')
    setError(null)
  }

  if (!supabaseAnonKey) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-slate-700">
        Missing NEXT_PUBLIC_SUPABASE_ANON_KEY
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Real-time analytics for KeepMore.
            </p>
          </div>
          {session ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
            >
              Sign out
            </button>
          ) : null}
        </div>

        {!session ? (
          <div className="mt-12 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl">Sign in</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {otpSent
                ? 'Enter the 8-digit code sent to your email.'
                : 'Use your admin email to receive a verification code.'}
            </p>
            <div className="mt-6 space-y-3">
              {!otpSent ? (
                <>
                  <input
                    type="email"
                    placeholder="admin@keepmore.finance"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') handleSendOtp()
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send verification code'}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="00000000"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 8))}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') handleVerifyOtp()
                    }}
                    maxLength={8}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify code'}
                  </button>
                  <button
                    onClick={handleBackToEmail}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm hover:bg-slate-50 disabled:opacity-50"
                  >
                    Back to email
                  </button>
                </>
              )}
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </div>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {loading ? <p className="text-sm text-[var(--muted)]">Loading metrics...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            {metrics ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(metrics.totals).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="mt-2 font-display text-2xl">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-display text-lg">Activity</h3>
                    <ul className="mt-3 text-sm text-[var(--muted)]">
                      <li>DAU: {metrics.activity.dau}</li>
                      <li>WAU: {metrics.activity.wau}</li>
                      <li>New users (7d): {metrics.activity.newUsers7d}</li>
                      <li>New users (30d): {metrics.activity.newUsers30d}</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-display text-lg">Transaction Volume</h3>
                    <ul className="mt-3 text-sm text-[var(--muted)]">
                      <li>30d count: {metrics.volume.transactions30dCount}</li>
                      <li>30d total: {metrics.volume.transactions30dTotal.toFixed(2)}</li>
                      <li>12m count: {metrics.volume.transactions12mCount}</li>
                      <li>12m total: {metrics.volume.transactions12mTotal.toFixed(2)}</li>
                    </ul>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-display text-lg">Top Institutions</h3>
                    <ul className="mt-3 text-sm text-[var(--muted)]">
                      {metrics.topInstitutions.map((item) => (
                        <li key={item.name}>
                          {item.name}: {item.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-display text-lg">Signups (14d)</h3>
                    <ul className="mt-3 text-sm text-[var(--muted)]">
                      {metrics.trends.signupsLast14Days.map((item) => (
                        <li key={item.date}>
                          {item.date}: {item.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}