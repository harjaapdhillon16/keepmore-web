'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, TrendingUp, MessageCircle, Shield, Zap, ArrowRight, CheckCircle2, ChevronDown, Brain, Wallet, PieChart, BarChart3, Search, Lock, LineChart, Mail, User, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import logo from '../../assets/icon.png'

// Initialize Supabase client
const supabase = createClient(
  'https://iimlwwmxbaeinfcpqsxp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTMyMjEsImV4cCI6MjA4NDQyOTIyMX0.fokjodWCXse7BFan_WGWg7DrUZzxU9vJVwOJ5noGzqo'
)

export default function MarketingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentWord, setCurrentWord] = useState(0)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', country: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const wordTimings = [
      { word: 0, delay: 500 },
      { word: 1, delay: 1200 },
      { word: 2, delay: 1900 },
    ]

    wordTimings.forEach(({ word, delay }) => {
      setTimeout(() => setCurrentWord(word + 1), delay)
    })

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3200)

    return () => clearTimeout(timer)
  }, [])

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            country: formData.country,
          }
        ])

      if (error) throw error

      setSubmitStatus('success')
      setFormData({ name: '', email: '', country: '' })

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowWaitlistModal(false)
        setSubmitStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const words = ['Your', 'Money,', 'Simplified']

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1b3012] shadow-2xl sm:mb-12 sm:h-20 sm:w-20"
              >
                <Image
                  src={logo}
                  alt="KeepMore logo"
                  width={40}
                  height={40}
                  className="h-8 w-8 object-cover sm:h-10 sm:w-10"
                  quality={99}
                />
              </motion.div>

              <div className="flex flex-col items-center justify-center gap-2 font-serif text-4xl font-light tracking-tight text-slate-900 sm:flex-row sm:gap-4 sm:text-6xl">
                {words.map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: currentWord > index ? 1 : 0,
                      y: currentWord > index ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {showWaitlistModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowWaitlistModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-2xl"
            >
              {submitStatus === 'success' ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-slate-900">
                    You're on the list!
                  </h3>
                  <p className="mt-2 text-slate-600">
                    We'll notify you when KeepMore launches.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <h3 className="font-serif text-3xl font-light text-slate-900">
                      Join the Waitlist
                    </h3>
                    <p className="mt-2 text-slate-600">
                      Be the first to experience KeepMore
                    </p>
                  </div>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-lg border border-stone-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-lg border border-stone-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <select
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full rounded-lg border border-stone-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">Select country</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Canada">Other</option>
                        </select>
                      </div>
                    </div>

                    {submitStatus === 'error' && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="min-h-screen bg-stone-50"
      >
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f4_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        <div className="mx-auto max-w-7xl px-6 pb-32">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-stone-200 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-800 to-teal-900">
                <Image
                  src={logo}
                  alt="KeepMore logo"
                  width={20}
                  height={20}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-light tracking-tight text-slate-900">
                KeepMore
              </span>
            </div>
            <nav className="hidden items-center gap-10 text-sm text-slate-700 md:flex">
              <Link className="font-medium transition hover:text-slate-900" href="#features">
                Features
              </Link>
              <Link className="font-medium transition hover:text-slate-900" href="#how-it-works">
                How it works
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span className="text-xs font-medium text-amber-900">Launching Soon</span>
              </div>
            </nav>
          </header>

          {/* Hero Section */}
          <main className="mt-24 grid items-center gap-20 lg:mt-32 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Launching Q1 2026</span>
                </div>

                <h1 className="font-serif text-6xl font-light leading-[1.1] tracking-tight text-slate-900 lg:text-7xl">
                  Talk to your money.{' '}
                  <span className="block text-emerald-800">
                    Understand everything.
                  </span>
                </h1>

                <p className="max-w-xl text-xl leading-relaxed text-slate-600">
                  The only app where AI understands both your spending and investments.
                  Be among the first to experience the future of personal finance.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowWaitlistModal(true)}
                  className="group flex items-center gap-2 rounded-lg bg-slate-900 px-8 py-4 font-medium text-white transition hover:bg-slate-800"
                >
                  Join Waitlist
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 border-t border-stone-200 pt-10">
                {[
                  { value: '12,000+', label: 'Institutions supported' },
                  { value: 'Bank-level', label: 'Security encryption' },
                  { value: '24/7', label: 'AI assistance' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-3xl font-light text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Preview */}
            <div className="relative">
              <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xl">
                {/* Chat Header */}
                <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                    <MessageCircle className="h-5 w-5 text-amber-200" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Financial Copilot</p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="text-sm text-slate-500">Always available</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-slate-900 px-5 py-3">
                      <p className="text-sm text-white">
                        Why didn't I save more last month?
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-stone-200 bg-stone-50 px-5 py-4">
                      <div className="flex items-start gap-3">
                        <Brain className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-800" />
                        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                          <p>Three factors contributed:</p>
                          <p className="font-medium text-slate-900">
                            1. Dining increased 35% ($280)
                          </p>
                          <p>2. Unexpected car repair ($450)</p>
                          <p>3. Investment contribution pending ($500)</p>
                          <p className="text-slate-600">
                            Should we adjust dining or defer this month's investment?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2 pt-2">
                    <button className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-stone-300">
                      View details
                    </button>
                    <button className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-stone-300">
                      Investment options
                    </button>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-6 flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3">
                  <MessageCircle className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ask anything about your finances..."
                    disabled
                    className="flex-1 bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
                  />
                  <div className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                    Send
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Problem Statement */}
          <section className="mt-40">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-5xl font-light leading-tight text-slate-900">
                Most apps show you <span className="italic text-slate-400">what</span> you spent.
              </h2>
              <p className="mt-8 text-xl leading-relaxed text-slate-600">
                We reveal <span className="font-medium text-emerald-800">why</span>,
                predict what's ahead, and connect your spending to wealth building.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="mt-40">
            <div className="mb-20 text-center">
              <p className="font-medium uppercase tracking-wider text-slate-500">
                Core Capabilities
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light text-slate-900">
                Intelligence meets simplicity
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {[
                {
                  icon: MessageCircle,
                  title: 'AI Financial Assistant',
                  description: 'Natural conversation about your money. Ask anything, from affordability to savings strategy, and receive personalized insights.',
                },
                {
                  icon: Wallet,
                  title: 'Expense Intelligence',
                  description: 'Automatically categorized transactions with pattern recognition. Understand your spending habits without manual tracking.',
                },
                {
                  icon: LineChart,
                  title: 'Investment Insights',
                  description: 'Unified portfolio view with performance analytics, allocation tracking, and strategic recommendations.',
                },
              ].map((feature) => (
                <div key={feature.title} className="group">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                    <feature.icon className="h-6 w-6 text-amber-200" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-Pillar Section */}
          <section className="mt-40">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
              <div className="grid lg:grid-cols-2">
                {/* Left side */}
                <div className="p-16">
                  <div className="mb-6 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
                    <span className="text-sm font-medium text-amber-900">
                      Unique Advantage
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl font-light leading-tight text-slate-900">
                    Connecting spending to wealth creation
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    Traditional apps show expenses or investments in isolation. We reveal the relationship between them.
                  </p>

                  <div className="mt-12 space-y-8">
                    {[
                      {
                        q: 'Should I invest more this month?',
                        a: 'Your spending increased $420 due to renovations. Maintain your $500 investment this month, then catch up next month.',
                      },
                      {
                        q: 'Can I afford a $3,000 vacation?',
                        a: 'Yes, by June. Reducing discretionary spending by $200 monthly keeps your emergency fund goal on track.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 border-emerald-800 pl-6">
                        <p className="font-medium text-slate-900">{item.q}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side - Visual */}
                <div className="bg-stone-50 p-16">
                  <div className="space-y-6">
                    {/* Spending card */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">Monthly Spending</span>
                        </div>
                        <span className="font-serif text-2xl font-light text-slate-900">$3,420</span>
                      </div>
                      <div className="mt-4 flex gap-1">
                        {[6, 9, 4, 8, 10, 7, 5].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm bg-slate-200"
                            style={{ height: `${height * 5}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Connection */}
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2">
                        <Brain className="h-3 w-3 text-emerald-800" />
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-700">
                          AI Connects
                        </span>
                      </div>
                    </div>

                    {/* Investments card */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">Total Invested</span>
                        </div>
                        <span className="font-serif text-2xl font-light text-slate-900">$52,100</span>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-stone-100">
                          <div className="h-2 w-3/4 rounded-full bg-emerald-800" />
                        </div>
                        <span className="text-sm font-medium text-emerald-800">↑ 2.3%</span>
                      </div>
                    </div>

                    {/* Insight */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-5 w-5 text-amber-600" />
                        <div className="flex-1">
                          <p className="font-medium text-amber-900">
                            Strategic Insight
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-amber-800">
                            Reducing dining by 30% enables an additional $135 monthly investment.
                            At 7% annual returns, that's $1,700 in year one.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="mt-40">
            <div className="mb-20 text-center">
              <p className="font-medium uppercase tracking-wider text-slate-500">
                Getting Started
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light text-slate-900">
                Simple by design
              </h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-3">
              {[
                {
                  number: '01',
                  title: 'Connect accounts',
                  description: 'Secure Plaid integration with 12,000+ institutions. We read data only—never move money.',
                  icon: Shield,
                },
                {
                  number: '02',
                  title: 'AI learns patterns',
                  description: 'Automated categorization and analysis. Your financial profile evolves with your behavior.',
                  icon: Brain,
                },
                {
                  number: '03',
                  title: 'Conversational insights',
                  description: 'Natural language queries receive personalized, data-driven responses.',
                  icon: MessageCircle,
                },
              ].map((item) => (
                <div key={item.number}>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900">
                    <item.icon className="h-6 w-6 text-amber-200" />
                  </div>
                  <div className="mb-4 font-serif text-sm text-slate-400">
                    {item.number}
                  </div>
                  <h3 className="font-serif text-2xl font-light text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          <section className="mt-40">
            <div className="rounded-2xl border border-stone-200 bg-white p-16 text-center shadow-xl">
              <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="h-5 w-5 text-amber-400" />
                  ))}
                </div>
                <blockquote className="font-serif text-3xl font-light italic leading-relaxed text-slate-900">
                  "Finally, clarity about where my money goes. The AI surfaces insights
                  I didn't know to look for."
                </blockquote>
                <div className="mt-10 flex items-center justify-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-800 to-teal-900" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Sarah Chen</p>
                    <p className="text-sm text-slate-600">Designer, San Francisco</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-40">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-16 text-center font-serif text-4xl font-light text-slate-900">
                Common questions
              </h2>
              <div className="space-y-6">
                {[
                  {
                    q: 'When will KeepMore launch?',
                    a: 'We\'re targeting Q1 2026 for our initial launch to iOS users in the US and Canada. Join the waitlist to be notified as soon as we\'re ready!',
                  },
                  {
                    q: 'How is my data protected?',
                    a: 'Bank-level encryption throughout. Plaid handles connections—we never store credentials. Access tokens encrypted at rest. SOC 2 compliant infrastructure.',
                  },
                  {
                    q: 'What powers the AI?',
                    a: 'Deepseek apis, trained on your actual transaction and investment data. Pattern recognition, cash flow prediction, and contextual advice based on your unique financial situation.',
                  },
                  {
                    q: 'Which institutions are supported?',
                    a: '12,000+ banks, credit unions, and brokerages across the US and Canada via Plaid. If it connects to Plaid, it works with KeepMore.',
                  },
                ].map((item, i) => (
                  <details
                    key={i}
                    className="group rounded-lg border border-stone-200 bg-white p-6"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-medium text-slate-900">
                      {item.q}
                      <ChevronDown className="h-5 w-5 text-slate-400 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 leading-relaxed text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-40">
            <div className="rounded-2xl border border-stone-200 bg-slate-900 p-16 text-center shadow-2xl lg:p-20">
              <div className="mx-auto max-w-2xl">
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-[#1b3012]">
                  <Image
                    src={logo}
                    alt="KeepMore logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <h2 className="font-serif text-5xl font-light text-white">
                  Be first in line.
                </h2>
                <p className="mt-6 text-lg text-slate-300">
                  Join thousands on the waitlist for exclusive early access to KeepMore.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    onClick={() => setShowWaitlistModal(true)}
                    className="rounded-lg bg-white px-8 py-4 font-medium text-slate-900 transition hover:bg-stone-100"
                  >
                    Join Waitlist
                  </button>
                </div>

                <p className="mt-8 text-sm text-slate-400">
                  Launching Q1 2026 • iOS • US & Canada
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-32 border-t border-stone-200 pt-16">
            <div className="grid gap-12 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1b3012]">
                    <Image
                      src={logo}
                      alt="KeepMore logo"
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                  <span className="font-serif text-2xl font-light text-slate-900">
                    KeepMore
                  </span>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate-600">
                  AI-powered financial clarity. Connect spending to wealth building with conversational intelligence.
                </p>
              </div>

              <div>
                <h4 className="mb-6 text-sm font-medium uppercase tracking-wider text-slate-900">Product</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><Link href="#features" className="transition hover:text-slate-900">Features</Link></li>
                  <li><Link href="#how-it-works" className="transition hover:text-slate-900">How it works</Link></li>
                  <li><button onClick={() => setShowWaitlistModal(true)} className="transition hover:text-slate-900">Join Waitlist</button></li>
                </ul>
              </div>


              <div>
                <h4 className="mb-6 text-sm font-medium uppercase tracking-wider text-slate-900">Legal</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><Link href="/privacy" className="transition hover:text-slate-900">Privacy</Link></li>
                  <li><Link href="/terms" className="transition hover:text-slate-900">Terms</Link></li>
                  <li><Link href="/security" className="transition hover:text-slate-900">Security</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-16 border-t border-stone-200 pt-8 text-center text-sm text-slate-500">
              <p>© 2026 KeepMore. All rights reserved.</p>
              <p className="mt-2">Plaid-secured connections. Bank-level encryption. Your data remains private.</p>
            </div>
          </footer>
        </div>
      </motion.div>
    </>
  )
}