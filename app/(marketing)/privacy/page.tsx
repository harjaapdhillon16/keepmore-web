'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react'
import logo from '../../../assets/icon.png'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f4_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="mx-auto max-w-7xl px-6 pb-32">
        {/* Header */}
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

        {/* Content */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900">
              <Shield className="h-8 w-8 text-amber-200" />
            </div>
            <h1 className="font-serif text-5xl font-light text-slate-900">Privacy Policy</h1>
            <p className="mt-4 text-slate-600">Last updated: January 24, 2026</p>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <section className="rounded-2xl border border-stone-200 bg-white p-10">
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">Our Commitment to Your Privacy</h2>
              <div className="space-y-4 leading-relaxed text-slate-600">
                <p>
                  At KeepMore, we believe your financial data is deeply personal. This Privacy Policy explains how we collect, use, protect, and share your information when you use our services. We are committed to transparency and giving you control over your data.
                </p>
                <p>
                  By using KeepMore, you agree to the practices described in this policy. If you do not agree, please discontinue use of our services.
                </p>
              </div>
            </section>

            {/* Key Points */}
            <section>
              <h2 className="mb-8 font-serif text-3xl font-light text-slate-900">Key Points</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {[
                  {
                    icon: Lock,
                    title: 'We never sell your data',
                    description: 'Your financial information is never sold, rented, or shared with third parties for marketing purposes.',
                  },
                  {
                    icon: Shield,
                    title: 'Bank-level security',
                    description: 'We use AES-256 encryption, TLS protocols, and industry-standard security practices to protect your data.',
                  },
                  {
                    icon: UserCheck,
                    title: 'You control your data',
                    description: 'Access, export, or delete your data at any time. Disconnect accounts whenever you choose.',
                  },
                  {
                    icon: Eye,
                    title: 'Transparent practices',
                    description: 'We clearly explain what data we collect, why we need it, and how we use it.',
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

            {/* Plaid Disclosure */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-10">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-800" />
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-light text-slate-900">
                    We Use Plaid to Connect Your Accounts
                  </h2>
                  <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    <p>
                      To connect your financial accounts, we use <strong>Plaid Inc.</strong>, a trusted third-party service that securely links your bank accounts, credit cards, and investment accounts to KeepMore. Plaid is used by millions of people and thousands of apps, including Venmo, Robinhood, and Betterment.
                    </p>
                    <p>
                      <strong>What Plaid does:</strong> Plaid retrieves your account information (transactions, balances, account details) from your financial institutions and shares it with us so we can provide you with AI-powered insights and analysis.
                    </p>
                    <p>
                      <strong>Plaid's role:</strong> Plaid acts as an intermediary between your financial institution and KeepMore. When you connect an account, you'll see Plaid's interface asking for your credentials. KeepMore never stores your bank username or password—only Plaid handles this information.
                    </p>
                    <p>
                      <strong>Security:</strong> Plaid uses bank-level encryption (AES-256 and TLS) and is certified under ISO 27001, ISO 27701, and SOC 2 compliance standards. Plaid does not sell or rent your financial data to third parties.
                    </p>
                    <p className="pt-2">
                      <strong>Learn more about Plaid:</strong>
                    </p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>
                        <a
                          href="https://plaid.com/legal"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-amber-900 underline hover:text-amber-800"
                        >
                          Plaid's Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://plaid.com/how-we-handle-data"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-amber-900 underline hover:text-amber-800"
                        >
                          How Plaid Handles Your Data
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://my.plaid.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-amber-900 underline hover:text-amber-800"
                        >
                          Plaid Portal
                        </a>{' '}
                        (view and manage your Plaid connections)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">Information We Collect</h2>
              
              <div className="space-y-8">
                <div className="rounded-xl border border-stone-200 bg-white p-8">
                  <h3 className="mb-4 text-xl font-medium text-slate-900">1. Financial Account Information</h3>
                  <p className="mb-4 text-slate-600">
                    When you connect your accounts through Plaid, we collect:
                  </p>
                  <ul className="ml-6 space-y-2 text-slate-600">
                    <li className="list-disc">
                      <strong>Account details:</strong> Account numbers, institution names, account types (checking, savings, investment, credit card), balances
                    </li>
                    <li className="list-disc">
                      <strong>Transaction data:</strong> Transaction history, merchant names, amounts, dates, categories, descriptions
                    </li>
                    <li className="list-disc">
                      <strong>Investment data:</strong> Holdings, quantities, ticker symbols, cost basis, market values, performance metrics
                    </li>
                    <li className="list-disc">
                      <strong>Identity information:</strong> Account holder names, addresses, phone numbers associated with your financial accounts
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-8">
                  <h3 className="mb-4 text-xl font-medium text-slate-900">2. Account Registration Information</h3>
                  <p className="mb-4 text-slate-600">When you create an account, we collect:</p>
                  <ul className="ml-6 space-y-2 text-slate-600">
                    <li className="list-disc">Name, email address, password (encrypted)</li>
                    <li className="list-disc">Profile information you provide (income, financial goals, preferences)</li>
                    <li className="list-disc">Communication preferences</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-8">
                  <h3 className="mb-4 text-xl font-medium text-slate-900">3. Usage and Analytics Data</h3>
                  <p className="mb-4 text-slate-600">We automatically collect:</p>
                  <ul className="ml-6 space-y-2 text-slate-600">
                    <li className="list-disc">Device information (device type, operating system, browser)</li>
                    <li className="list-disc">IP address and general location (city/state level)</li>
                    <li className="list-disc">Usage data (features used, time spent, clicks, navigation patterns)</li>
                    <li className="list-disc">Log data (timestamps, errors, system activity)</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-8">
                  <h3 className="mb-4 text-xl font-medium text-slate-900">4. AI Conversation Data</h3>
                  <p className="mb-4 text-slate-600">
                    When you use our AI financial assistant (powered by Anthropic's Claude), we collect:
                  </p>
                  <ul className="ml-6 space-y-2 text-slate-600">
                    <li className="list-disc">Your questions and messages to the AI</li>
                    <li className="list-disc">AI responses and recommendations</li>
                    <li className="list-disc">Conversation history and context</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">How We Use Your Information</h2>
              
              <div className="space-y-6 rounded-xl border border-stone-200 bg-white p-8">
                <p className="text-slate-600">We use your information to:</p>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Provide Our Services</h4>
                    <ul className="ml-4 space-y-1 text-sm text-slate-600">
                      <li className="list-disc">Display your account balances, transactions, and investment holdings</li>
                      <li className="list-disc">Categorize and analyze your spending patterns</li>
                      <li className="list-disc">Generate AI-powered financial insights and recommendations</li>
                      <li className="list-disc">Answer your questions about your finances through our AI assistant</li>
                      <li className="list-disc">Track your financial goals and progress</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Improve and Personalize</h4>
                    <ul className="ml-4 space-y-1 text-sm text-slate-600">
                      <li className="list-disc">Personalize your experience based on your financial situation</li>
                      <li className="list-disc">Improve our AI models and recommendation algorithms</li>
                      <li className="list-disc">Develop new features and services</li>
                      <li className="list-disc">Conduct research and analytics (in aggregate, de-identified form)</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Security and Fraud Prevention</h4>
                    <ul className="ml-4 space-y-1 text-sm text-slate-600">
                      <li className="list-disc">Detect and prevent fraudulent activity</li>
                      <li className="list-disc">Verify your identity and account ownership</li>
                      <li className="list-disc">Monitor for security threats and suspicious behavior</li>
                      <li className="list-disc">Protect against unauthorized access</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Communication</h4>
                    <ul className="ml-4 space-y-1 text-sm text-slate-600">
                      <li className="list-disc">Send you service updates, alerts, and notifications</li>
                      <li className="list-disc">Respond to your questions and support requests</li>
                      <li className="list-disc">Send marketing communications (you can opt out anytime)</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Legal Compliance</h4>
                    <ul className="ml-4 space-y-1 text-sm text-slate-600">
                      <li className="list-disc">Comply with laws, regulations, and legal processes</li>
                      <li className="list-disc">Enforce our Terms of Service</li>
                      <li className="list-disc">Respond to government requests when legally required</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* AI and Anthropic */}
            <section className="rounded-2xl border border-stone-200 bg-white p-10">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">
                AI-Powered Insights (Anthropic's Claude)
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Our AI financial assistant is powered by <strong>Claude</strong>, developed by Anthropic. When you interact with our AI:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">
                    Your financial data and questions are sent to Anthropic's API to generate personalized responses
                  </li>
                  <li className="list-disc">
                    Anthropic processes your data solely to provide AI services and does not use your data to train their models without explicit consent
                  </li>
                  <li className="list-disc">
                    Your conversations are encrypted in transit and at rest
                  </li>
                  <li className="list-disc">
                    Anthropic's privacy practices are governed by their{' '}
                    <a
                      href="https://www.anthropic.com/legal/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-800 underline"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Share Information */}
            <section>
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">How We Share Your Information</h2>
              
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-200 bg-white p-8">
                  <h3 className="mb-4 text-xl font-medium text-slate-900">We Do NOT Sell Your Data</h3>
                  <p className="text-slate-600">
                    We do not and will never sell, rent, or trade your personal or financial information to third parties for marketing purposes. Your data is yours.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-8">
                  <h3 className="mb-4 text-xl font-medium text-slate-900">We Share With:</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-medium text-slate-900">Service Providers</h4>
                      <p className="text-sm text-slate-600">
                        We share data with trusted partners who help us operate our services:
                      </p>
                      <ul className="ml-4 mt-2 space-y-1 text-sm text-slate-600">
                        <li className="list-disc"><strong>Plaid</strong> - Financial data aggregation and account connectivity</li>
                        <li className="list-disc"><strong>Anthropic</strong> - AI-powered insights and conversation</li>
                        <li className="list-disc"><strong>Cloud hosting providers</strong> - Secure data storage and infrastructure</li>
                        <li className="list-disc"><strong>Analytics providers</strong> - App performance and usage analytics (anonymized)</li>
                        <li className="list-disc"><strong>Payment processors</strong> - Subscription billing (if applicable)</li>
                      </ul>
                      <p className="mt-2 text-sm text-slate-600">
                        All service providers are contractually bound to protect your data and use it only for the services they provide to us.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium text-slate-900">Legal Requirements</h4>
                      <p className="text-sm text-slate-600">
                        We may disclose information if required by law, court order, subpoena, or government request. We will notify you unless prohibited by law.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium text-slate-900">Business Transfers</h4>
                      <p className="text-sm text-slate-600">
                        If KeepMore is acquired, merged, or sells assets, your information may be transferred. We will notify you and ensure the new entity honors this Privacy Policy.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium text-slate-900">With Your Consent</h4>
                      <p className="text-sm text-slate-600">
                        We may share information with other parties when you explicitly consent or direct us to do so.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="rounded-2xl border border-stone-200 bg-white p-10">
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">Data Security</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  We take security seriously and implement industry-standard practices to protect your information:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">
                    <strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
                  </li>
                  <li className="list-disc">
                    <strong>Access controls:</strong> Plaid access tokens and sensitive data are encrypted at application level with additional access controls
                  </li>
                  <li className="list-disc">
                    <strong>Authentication:</strong> Multi-factor authentication available for your account
                  </li>
                  <li className="list-disc">
                    <strong>Infrastructure:</strong> Secure cloud infrastructure with regular security audits
                  </li>
                  <li className="list-disc">
                    <strong>Monitoring:</strong> 24/7 system monitoring for suspicious activity
                  </li>
                  <li className="list-disc">
                    <strong>Access limitations:</strong> Employee access to data is strictly limited and logged
                  </li>
                </ul>
                <p className="pt-4 text-sm">
                  While we implement strong security measures, no system is 100% secure. We cannot guarantee absolute security but are committed to protecting your data using industry best practices.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">Data Retention</h2>
              <div className="space-y-4 text-slate-600">
                <p>We retain your information for as long as:</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Your account is active</li>
                  <li className="list-disc">Needed to provide you services</li>
                  <li className="list-disc">Required by law (tax records, compliance)</li>
                  <li className="list-disc">Necessary for legitimate business purposes (fraud prevention, resolving disputes)</li>
                </ul>
                <p>
                  When you delete your account, we will delete your personal information within 90 days, except where we must retain it for legal compliance.
                </p>
              </div>
            </section>

            {/* Your Rights and Choices */}
            <section>
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">Your Rights and Choices</h2>
              
              <div className="space-y-6 rounded-xl border border-stone-200 bg-white p-8">
                <p className="text-slate-600">You have the following rights:</p>
                
                <div className="space-y-4">
                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Access Your Data</h4>
                    <p className="text-sm text-slate-600">
                      Request a copy of the personal information we have about you.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Correct Your Data</h4>
                    <p className="text-sm text-slate-600">
                      Update or correct inaccurate information in your account settings.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Delete Your Data</h4>
                    <p className="text-sm text-slate-600">
                      Request deletion of your account and associated data. You can do this in account settings or by contacting us at{' '}
                      <a href="mailto:privacy@keepmore.app" className="font-medium text-emerald-800 underline">
                        privacy@keepmore.app
                      </a>
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Export Your Data</h4>
                    <p className="text-sm text-slate-600">
                      Request a portable copy of your data in machine-readable format.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Disconnect Accounts</h4>
                    <p className="text-sm text-slate-600">
                      Remove connected bank and investment accounts at any time in your account settings. You can also manage connections via{' '}
                      <a
                        href="https://my.plaid.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-800 underline"
                      >
                        Plaid Portal
                      </a>
                      .
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Opt Out of Marketing</h4>
                    <p className="text-sm text-slate-600">
                      Unsubscribe from marketing emails by clicking the unsubscribe link in any email or updating your communication preferences.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-800 pl-4">
                    <h4 className="mb-2 font-medium text-slate-900">Object to Processing</h4>
                    <p className="text-sm text-slate-600">
                      In certain circumstances, you may object to our processing of your data or request that we restrict processing.
                    </p>
                  </div>
                </div>

                <p className="pt-4 text-sm text-slate-600">
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:privacy@keepmore.app" className="font-medium text-emerald-800 underline">
                    privacy@keepmore.app
                  </a>
                  . We will respond within 30 days.
                </p>
              </div>
            </section>

            {/* State-Specific Rights */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">
                State-Specific Privacy Rights
              </h2>
              <div className="space-y-6 text-slate-600">
                <div>
                  <h3 className="mb-2 font-medium text-slate-900">California Residents (CCPA/CPRA)</h3>
                  <p className="mb-2 text-sm">
                    Under the California Consumer Privacy Act and California Privacy Rights Act, you have additional rights:
                  </p>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li className="list-disc">Right to know what personal information we collect and how it's used</li>
                    <li className="list-disc">Right to delete personal information</li>
                    <li className="list-disc">Right to opt-out of sale of personal information (we don't sell data)</li>
                    <li className="list-disc">Right to non-discrimination for exercising your rights</li>
                    <li className="list-disc">Right to correct inaccurate information</li>
                    <li className="list-disc">Right to limit use of sensitive personal information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-slate-900">Virginia, Colorado, Connecticut, Utah Residents</h3>
                  <p className="text-sm">
                    Similar rights apply under your state's privacy laws, including rights to access, delete, correct, and obtain a copy of your data.
                  </p>
                </div>

                <p className="text-sm">
                  To exercise these rights, email{' '}
                  <a href="mailto:privacy@keepmore.app" className="font-medium text-emerald-800 underline">
                    privacy@keepmore.app
                  </a>
                </p>
              </div>
            </section>

            {/* International Users */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">
                International Users (GDPR)
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  If you are in the European Economic Area, UK, or Switzerland, you have rights under the General Data Protection Regulation (GDPR):
                </p>
                <ul className="ml-6 space-y-2 text-sm">
                  <li className="list-disc">Right to access, rectify, erase, restrict, and object to processing</li>
                  <li className="list-disc">Right to data portability</li>
                  <li className="list-disc">Right to withdraw consent</li>
                  <li className="list-disc">Right to lodge a complaint with your local data protection authority</li>
                </ul>
                <p className="text-sm">
                  <strong>Legal basis for processing:</strong> We process your data based on your consent, to perform our contract with you, for our legitimate business interests, or to comply with legal obligations.
                </p>
                <p className="text-sm">
                  <strong>Data transfers:</strong> Your data may be transferred to and processed in the United States. We ensure appropriate safeguards are in place through standard contractual clauses approved by the European Commission.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">
                Children's Privacy
              </h2>
              <p className="text-slate-600">
                KeepMore is not intended for use by individuals under 18 years of age. We do not knowingly collect information from children. If we discover we have collected information from a child under 18, we will delete it promptly. If you believe we have collected information from a child, contact us at{' '}
                <a href="mailto:privacy@keepmore.app" className="font-medium text-emerald-800 underline">
                  privacy@keepmore.app
                </a>
                .
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">
                Changes to This Policy
              </h2>
              <p className="text-slate-600">
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through the app at least 30 days before the changes take effect. Continued use of KeepMore after changes constitutes acceptance of the updated policy. The "Last updated" date at the top reflects the most recent version.
              </p>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-stone-200 bg-slate-900 p-10 text-white">
              <h2 className="mb-6 font-serif text-3xl font-light">Contact Us</h2>
              <div className="space-y-4">
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@keepmore.app" className="text-amber-200 underline">
                      privacy@keepmore.app
                    </a>
                  </p>
                  <p>
                    <strong>Mailing Address:</strong>
                    <br />
                    KeepMore Inc.
                    <br />
                    Privacy Team
                    <br />
                    [Your Address]
                    <br />
                    [City, State, ZIP]
                  </p>
                </div>
                <p className="pt-4 text-sm text-slate-300">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
