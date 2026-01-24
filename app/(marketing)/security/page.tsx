'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Database, Eye, Lock, Shield } from 'lucide-react'
import logo from '../../../assets/icon.png'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f4_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="mx-auto max-w-7xl px-6 pb-32">
        <header className="flex items-center justify-between border-b border-stone-200 py-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-800 to-teal-900">
              <Image
                src={logo}
                alt="KeepMore logo"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
                priority
              />
            </div>
            <span className="font-serif text-2xl font-light tracking-tight text-slate-900">
              KeepMore
            </span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            ← Back to Home
          </Link>
        </header>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900">
              <Shield className="h-8 w-8 text-amber-200" />
            </div>
            <h1 className="font-serif text-5xl font-light text-slate-900">Security</h1>
            <p className="mt-4 text-slate-600">Last updated: January 24, 2026</p>
          </div>

          <div className="space-y-12">
            <section className="rounded-2xl border border-stone-200 bg-white p-10">
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">Our Security Promise</h2>
              <div className="space-y-4 leading-relaxed text-slate-600">
                <p>
                  KeepMore is built to protect your financial data at every layer. We combine strong encryption, rigorous access controls, and continuous monitoring to keep your information safe.
                </p>
                <p>
                  Our security program is reviewed regularly and evolves with new threats and industry best practices.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-8 font-serif text-3xl font-light text-slate-900">Core Protections</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {[
                  {
                    icon: Lock,
                    title: 'Encryption in transit and at rest',
                    description: 'All data is encrypted in transit with TLS and encrypted at rest using AES-256 with regular key rotation.',
                  },
                  {
                    icon: Shield,
                    title: 'Access controls and audit logs',
                    description: 'Role-based access, multi-factor authentication, and detailed audit logs protect sensitive systems.',
                  },
                  {
                    icon: Database,
                    title: 'Secure infrastructure',
                    description: 'Isolated environments, automated backups, and disaster recovery plans protect availability.',
                  },
                  {
                    icon: Eye,
                    title: 'Continuous monitoring',
                    description: '24/7 monitoring, anomaly detection, and automated alerts help us respond quickly.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-stone-200 bg-white p-6"
                  >
                    <item.icon className="mb-4 h-6 w-6 text-emerald-800" />
                    <h3 className="mb-2 font-medium text-slate-900">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">Account Protection</h2>
              <div className="space-y-4 text-slate-600">
                <p>We help you keep your account safe with:</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Multi-factor authentication and session management</li>
                  <li className="list-disc">Encrypted credentials and tokenized connections</li>
                  <li className="list-disc">Automatic logout for inactive sessions</li>
                  <li className="list-disc">Suspicious activity detection and user alerts</li>
                </ul>
              </div>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-10">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-800" />
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-light text-slate-900">Incident Response</h2>
                  <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    <p>
                      If we detect suspicious activity, we investigate immediately, contain the issue, and notify affected users as quickly as possible. We also partner with security experts to review and strengthen our defenses.
                    </p>
                    <p>
                      While no system is 100% secure, we are committed to continuous improvement and transparent communication.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-slate-900 p-10 text-white">
              <h2 className="mb-6 font-serif text-3xl font-light">Report a Vulnerability</h2>
              <div className="space-y-4 text-sm text-slate-200">
                <p>
                  If you believe you have found a security vulnerability, please contact us immediately. We investigate all reports and appreciate responsible disclosure.
                </p>
                <p>
                  Email:{' '}
                  <a href="mailto:security@keepmore.app" className="text-amber-200 underline">
                    security@keepmore.app
                  </a>
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-amber-200" />
                  We aim to respond within 48 hours.
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
