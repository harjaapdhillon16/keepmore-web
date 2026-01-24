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
            <h1 className="font-serif text-5xl font-light text-slate-900">Plaid</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
