'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, TrendingUp, MessageCircle, Shield, ArrowRight, CheckCircle2, ChevronDown, Brain, Wallet, LineChart, Mail, User, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import logo from '../../assets/icon.png'

// Initialize Supabase client
const supabase = createClient(
  'https://iimlwwmxbaeinfcpqsxp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbWx3d214YmFlaW5mY3Bxc3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTMyMjEsImV4cCI6MjA4NDQyOTIyMX0.fokjodWCXse7BFan_WGWg7DrUZzxU9vJVwOJ5noGzqo'
)

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <div className="h-px w-12 bg-[#C9A84C]" />
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8C8278]">{children}</p>
      <div className="h-px w-12 bg-[#C9A84C]" />
    </div>
  )
}

export default function MarketingPage() {
  const APP_STORE_URL = 'https://apps.apple.com/us/app/keepmore-finance/id6758236819'
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
      const { error } = await supabase
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] px-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-xl bg-[#14231A] shadow-2xl sm:mb-14 sm:h-20 sm:w-20"
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

              <div className="flex flex-col items-center justify-center gap-2 font-serif text-4xl font-light tracking-tight text-[#1A1510] sm:flex-row sm:gap-4 sm:text-6xl">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1510]/60 p-4"
            onClick={() => setShowWaitlistModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-none border border-[#E2DDD4] bg-[#FAF7F2] p-10 shadow-2xl"
            >
              {submitStatus === 'success' ? (
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF0E6]">
                    <CheckCircle2 className="h-8 w-8 text-[#2A5C2A]" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#1A1510]">
                    You're on the list.
                  </h3>
                  <p className="mt-2 text-[#6B6358]">
                    We'll notify you when KeepMore launches.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h3 className="font-serif text-3xl font-light text-[#1A1510]">
                      Join the Waitlist
                    </h3>
                    <p className="mt-2 text-sm text-[#8C8278]">
                      Be the first to experience KeepMore
                    </p>
                  </div>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#6B6358]">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9E9A94]" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-[#E2DDD4] bg-[#FEFCF8] py-3 pl-10 pr-4 text-[#1A1510] outline-none transition focus:border-[#A8832A] focus:ring-1 focus:ring-[#C9A84C]/30"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#6B6358]">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9E9A94]" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-[#E2DDD4] bg-[#FEFCF8] py-3 pl-10 pr-4 text-[#1A1510] outline-none transition focus:border-[#A8832A] focus:ring-1 focus:ring-[#C9A84C]/30"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#6B6358]">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9E9A94]" />
                        <select
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full border border-[#E2DDD4] bg-[#FEFCF8] py-3 pl-10 pr-4 text-[#1A1510] outline-none transition focus:border-[#A8832A] focus:ring-1 focus:ring-[#C9A84C]/30"
                        >
                          <option value="">Select country</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {submitStatus === 'error' && (
                      <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#14231A] py-3.5 text-sm font-medium uppercase tracking-wider text-[#F5F0E6] transition hover:bg-[#1A2E20] disabled:opacity-50"
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
        className="min-h-screen bg-[#FAF7F2]"
      >
        {/* Subtle Background Texture */}
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#E8E3D8_1px,transparent_1px),linear-gradient(to_bottom,#E8E3D8_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        <div className="mx-auto max-w-7xl px-6 pb-32">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#E2DDD4] py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-[#14231A]">
                <Image
                  src={logo}
                  alt="KeepMore logo"
                  width={20}
                  height={20}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-light tracking-wide text-[#1A1510]">
                KeepMore
              </span>
            </div>
            <nav className="hidden items-center gap-10 text-sm text-[#6B6358] md:flex">
              <Link className="font-medium tracking-wide transition hover:text-[#1A1510]" href="#features">
                Features
              </Link>
              <Link className="font-medium tracking-wide transition hover:text-[#1A1510]" href="#how-it-works">
                How it works
              </Link>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#C9A84C] bg-[#FDF6E3] px-4 py-1.5 transition hover:bg-[#FAF0D0]"
              >
                <Sparkles className="h-3 w-3 text-[#A8832A]" />
                <span className="text-xs font-medium uppercase tracking-wider text-[#7A5C1A]">Download on iOS</span>
              </a>
            </nav>
          </header>

          {/* Hero Section */}
          <main className="mt-24 grid items-center gap-20 lg:mt-36 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2.5 border border-[#B8CEAF] bg-[#F0F5ED] px-4 py-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2A5C2A]" />
                  <span className="text-xs font-medium uppercase tracking-wider text-[#1D4A1D]">Now on iOS</span>
                </div>

                <h1 className="font-serif text-6xl font-light leading-[1.08] tracking-tight text-[#1A1510] lg:text-[5.5rem]">
                  Talk to your money.{' '}
                  <span className="block italic text-[#1D4A1D]">
                    Understand everything.
                  </span>
                </h1>

                <p className="max-w-xl text-lg leading-relaxed text-[#6B6358]">
                  The only app where AI understands both your spending and investments.
                  Download KeepMore on the App Store and start getting financial clarity today.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-[#14231A] px-8 py-4 text-sm font-medium uppercase tracking-wider text-[#F5F0E6] transition hover:bg-[#1A2E20]"
                >
                  Download on iOS
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 border-t border-[#E2DDD4] pt-10">
                {[
                  { value: '12,000+', label: 'Institutions supported' },
                  { value: 'Bank-level', label: 'Security encryption' },
                  { value: '24/7', label: 'AI assistance' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="mb-3 h-px w-8 bg-[#C9A84C]" />
                    <p className="font-serif text-3xl font-light text-[#1A1510]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-[#8C8278]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Preview */}
            <div className="relative">
              <div className="border border-[#E2DDD4] bg-[#FEFCF8] shadow-[0_8px_40px_rgba(20,35,26,0.08)]">
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-[#E2DDD4] bg-[#14231A] px-6 py-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D4A1D]">
                    <MessageCircle className="h-4 w-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F0E6]">Financial Copilot</p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6DBF6D]" />
                      <p className="text-xs text-[#A8B8A4]">Always available</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 p-6">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-[#14231A] px-5 py-3">
                      <p className="text-sm text-[#F5F0E6]">
                        Why didn't I save more last month?
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] border border-[#E2DDD4] bg-[#FAF7F2] px-5 py-4">
                      <div className="flex items-start gap-3">
                        <Brain className="mt-1 h-4 w-4 flex-shrink-0 text-[#1D4A1D]" />
                        <div className="space-y-2.5 text-sm leading-relaxed text-[#4A4540]">
                          <p>Three factors contributed:</p>
                          <p className="font-medium text-[#1A1510]">
                            1. Dining increased 35% ($280)
                          </p>
                          <p>2. Unexpected car repair ($450)</p>
                          <p>3. Investment contribution pending ($500)</p>
                          <p className="text-[#6B6358]">
                            Should we adjust dining or defer this month's investment?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2 pt-1">
                    <button className="border border-[#E2DDD4] bg-[#FEFCF8] px-4 py-2 text-xs font-medium text-[#6B6358] transition hover:border-[#C9A84C] hover:text-[#1A1510]">
                      View details
                    </button>
                    <button className="border border-[#E2DDD4] bg-[#FEFCF8] px-4 py-2 text-xs font-medium text-[#6B6358] transition hover:border-[#C9A84C] hover:text-[#1A1510]">
                      Investment options
                    </button>
                  </div>
                </div>

                {/* Input */}
                <div className="mx-6 mb-6 flex items-center gap-3 border border-[#E2DDD4] bg-[#FAF7F2] px-4 py-3">
                  <MessageCircle className="h-4 w-4 text-[#9E9A94]" />
                  <input
                    type="text"
                    placeholder="Ask anything about your finances..."
                    disabled
                    className="flex-1 bg-transparent text-sm text-[#6B6358] outline-none placeholder:text-[#9E9A94]"
                  />
                  <div className="bg-[#14231A] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#F5F0E6]">
                    Send
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Problem Statement */}
          <section className="mt-44">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-5xl font-light leading-tight text-[#1A1510]">
                Most apps show you <span className="italic text-[#9E9A94]">what</span> you spent.
              </h2>
              <div className="mx-auto my-8 h-px w-16 bg-[#C9A84C]" />
              <p className="text-xl leading-relaxed text-[#6B6358]">
                We reveal <span className="font-medium text-[#1D4A1D]">why</span>,
                predict what's ahead, and connect your spending to wealth building.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="mt-44">
            <div className="mb-20 text-center">
              <SectionLabel>Core Capabilities</SectionLabel>
              <h2 className="mt-6 font-serif text-4xl font-light text-[#1A1510]">
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
                <div key={feature.title} className="group border-t border-[#E2DDD4] pt-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#14231A]">
                    <feature.icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#1A1510]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[#6B6358]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-Pillar Section */}
          <section className="mt-44">
            <div className="border border-[#E2DDD4] bg-[#FEFCF8] shadow-[0_8px_40px_rgba(20,35,26,0.06)]">
              <div className="grid lg:grid-cols-2">
                {/* Left side */}
                <div className="border-r border-[#E2DDD4] p-16">
                  <div className="mb-6 inline-block border border-[#C9A84C] bg-[#FDF6E3] px-4 py-1.5">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#7A5C1A]">
                      Unique Advantage
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl font-light leading-tight text-[#1A1510]">
                    Connecting spending to wealth creation
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-[#6B6358]">
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
                      <div key={i} className="border-l-2 border-[#C9A84C] pl-6">
                        <p className="font-medium text-[#1A1510]">{item.q}</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#6B6358]">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side - Visual */}
                <div className="bg-[#FAF7F2] p-16">
                  <div className="space-y-6">
                    {/* Spending card */}
                    <div className="border border-[#E2DDD4] bg-[#FEFCF8] p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-[#6B6358]" />
                          <span className="text-xs font-medium uppercase tracking-wider text-[#6B6358]">Monthly Spending</span>
                        </div>
                        <span className="font-serif text-2xl font-light text-[#1A1510]">$3,420</span>
                      </div>
                      <div className="mt-4 flex gap-1">
                        {[6, 9, 4, 8, 10, 7, 5].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm bg-[#DDD8CE]"
                            style={{ height: `${height * 5}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Connection */}
                    <div className="flex items-center justify-center py-3">
                      <div className="flex items-center gap-2 border border-[#E2DDD4] bg-[#FEFCF8] px-4 py-2">
                        <Brain className="h-3 w-3 text-[#1D4A1D]" />
                        <span className="text-xs font-medium uppercase tracking-wider text-[#6B6358]">
                          AI Connects
                        </span>
                      </div>
                    </div>

                    {/* Investments card */}
                    <div className="border border-[#E2DDD4] bg-[#FEFCF8] p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#6B6358]" />
                          <span className="text-xs font-medium uppercase tracking-wider text-[#6B6358]">Total Invested</span>
                        </div>
                        <span className="font-serif text-2xl font-light text-[#1A1510]">$52,100</span>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 rounded-full bg-[#E2DDD4]">
                          <div className="h-1.5 w-3/4 rounded-full bg-[#1D4A1D]" />
                        </div>
                        <span className="text-sm font-medium text-[#1D4A1D]">↑ 2.3%</span>
                      </div>
                    </div>

                    {/* Insight */}
                    <div className="border border-[#C9A84C] bg-[#FDF6E3] p-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-[#A8832A]" />
                        <div className="flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-[#7A5C1A]">
                            Strategic Insight
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[#6B4F1A]">
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
          <section id="how-it-works" className="mt-44">
            <div className="mb-20 text-center">
              <SectionLabel>Getting Started</SectionLabel>
              <h2 className="mt-6 font-serif text-4xl font-light text-[#1A1510]">
                Simple by design
              </h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-3">
              {[
                {
                  number: 'I',
                  title: 'Connect accounts',
                  description: 'Secure Plaid integration with 12,000+ institutions. We read data only—never move money.',
                  icon: Shield,
                },
                {
                  number: 'II',
                  title: 'AI learns patterns',
                  description: 'Automated categorization and analysis. Your financial profile evolves with your behavior.',
                  icon: Brain,
                },
                {
                  number: 'III',
                  title: 'Conversational insights',
                  description: 'Natural language queries receive personalized, data-driven responses.',
                  icon: MessageCircle,
                },
              ].map((item) => (
                <div key={item.number} className="border-t border-[#E2DDD4] pt-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#14231A]">
                    <item.icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="mb-3 font-serif text-xl italic text-[#C9A84C]">
                    {item.number}
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#1A1510]">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[#6B6358]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          <section className="mt-44">
            <div className="border border-[#E2DDD4] bg-[#FEFCF8] p-16 text-center shadow-[0_8px_40px_rgba(20,35,26,0.06)]">
              <div className="mx-auto max-w-3xl">
                <div className="mb-2 font-serif text-[120px] leading-none text-[#C9A84C] opacity-40">&ldquo;</div>
                <blockquote className="-mt-8 font-serif text-3xl font-light italic leading-relaxed text-[#1A1510]">
                  Finally, clarity about where my money goes. The AI surfaces insights
                  I didn't know to look for.
                </blockquote>
                <div className="mx-auto my-8 h-px w-12 bg-[#C9A84C]" />
                <div className="flex items-center justify-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-[#14231A]" />
                  <div className="text-left">
                    <p className="font-medium text-[#1A1510]">Sarah Chen</p>
                    <p className="text-sm text-[#8C8278]">Designer, San Francisco</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-44">
            <div className="mx-auto max-w-3xl">
              <SectionLabel>Common Questions</SectionLabel>
              <h2 className="mb-16 mt-6 text-center font-serif text-4xl font-light text-[#1A1510]">
                What you need to know
              </h2>
              <div className="divide-y divide-[#E2DDD4] border border-[#E2DDD4]">
                {[
                  {
                    q: 'Is KeepMore available now?',
                    a: 'Yes, KeepMore is now live on iOS in the US App Store.',
                  },
                  {
                    q: 'How is my data protected?',
                    a: 'Bank-level encryption throughout. Plaid handles connections—we never store credentials. Access tokens encrypted at rest. SOC 2 compliant infrastructure.',
                  },
                  {
                    q: 'What powers the AI?',
                    a: 'Advanced LLM, trained on your actual transaction and investment data. Pattern recognition, cash flow prediction, and contextual advice based on your unique financial situation.',
                  },
                  {
                    q: 'Which institutions are supported?',
                    a: '12,000+ banks, credit unions, and brokerages across the US and Canada via Plaid. If it connects to Plaid, it works with KeepMore.',
                  },
                ].map((item, i) => (
                  <details
                    key={i}
                    className="group bg-[#FEFCF8] px-8 py-6"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-medium text-[#1A1510] marker:content-none">
                      {item.q}
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#9E9A94] transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 leading-relaxed text-[#6B6358]">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-44">
            <div className="bg-[#14231A] p-16 text-center shadow-2xl lg:p-24">
              <div className="mx-auto max-w-2xl">
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border border-[#2A5C2A] bg-[#1A2E20]">
                  <Image
                    src={logo}
                    alt="KeepMore logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div className="mx-auto mb-8 flex items-center justify-center gap-5">
                  <div className="h-px w-12 bg-[#C9A84C] opacity-60" />
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8C9E8C]">Now Available</p>
                  <div className="h-px w-12 bg-[#C9A84C] opacity-60" />
                </div>

                <h2 className="font-serif text-5xl font-light text-[#F5F0E6]">
                  Download KeepMore today.
                </h2>
                <p className="mt-6 text-lg text-[#8C9E8C]">
                  KeepMore is now available on iOS in the US App Store.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F5F0E6] px-10 py-4 text-sm font-medium uppercase tracking-wider text-[#14231A] transition hover:bg-white"
                  >
                    Download on iOS
                  </a>
                </div>

                <p className="mt-10 text-xs uppercase tracking-widest text-[#6B8C6B]">
                  iOS · US App Store
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-32 border-t border-[#E2DDD4] pt-16">
            <div className="grid gap-12 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#14231A]">
                    <Image
                      src={logo}
                      alt="KeepMore logo"
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                  <span className="font-serif text-2xl font-light tracking-wide text-[#1A1510]">
                    KeepMore
                  </span>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-[#8C8278]">
                  AI-powered financial clarity. Connect spending to wealth building with conversational intelligence.
                </p>
              </div>

              <div>
                <h4 className="mb-6 text-xs font-medium uppercase tracking-wider text-[#1A1510]">Product</h4>
                <ul className="space-y-3 text-sm text-[#6B6358]">
                  <li><Link href="#features" className="transition hover:text-[#1A1510]">Features</Link></li>
                  <li><Link href="#how-it-works" className="transition hover:text-[#1A1510]">How it works</Link></li>
                  <li>
                    <a
                      href={APP_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-[#1A1510]"
                    >
                      Download iOS App
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-6 text-xs font-medium uppercase tracking-wider text-[#1A1510]">Legal</h4>
                <ul className="space-y-3 text-sm text-[#6B6358]">
                  <li><Link href="/privacy" className="transition hover:text-[#1A1510]">Privacy</Link></li>
                  <li><Link href="/terms" className="transition hover:text-[#1A1510]">Terms</Link></li>
                  <li><Link href="/security" className="transition hover:text-[#1A1510]">Security</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-16 border-t border-[#E2DDD4] pt-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-5">
                <div className="h-px w-8 bg-[#C9A84C] opacity-50" />
                <p className="text-xs text-[#9E9A94]">© 2026 KeepMore. All rights reserved.</p>
                <div className="h-px w-8 bg-[#C9A84C] opacity-50" />
              </div>
              <p className="text-xs text-[#B0A898]">Plaid-secured connections · Bank-level encryption · Your data remains private.</p>
            </div>
          </footer>
        </div>
      </motion.div>
    </>
  )
}
