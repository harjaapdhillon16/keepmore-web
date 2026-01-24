'use client'

import Link from 'next/link'
import { Sparkles, FileText, Scale, Shield, AlertCircle } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f4_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="mx-auto max-w-7xl px-6 pb-32">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-stone-200 py-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-800 to-teal-900">
              <Sparkles className="h-5 w-5 text-amber-200" />
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
              <Scale className="h-8 w-8 text-amber-200" />
            </div>
            <h1 className="font-serif text-5xl font-light text-slate-900">Terms of Service</h1>
            <p className="mt-4 text-slate-600">Last updated: January 24, 2026</p>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <section className="rounded-2xl border border-stone-200 bg-white p-10">
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">Agreement to Terms</h2>
              <div className="space-y-4 leading-relaxed text-slate-600">
                <p>
                  Welcome to KeepMore. These Terms of Service ("Terms") govern your access to and use of the KeepMore application, website, and services (collectively, the "Services"). By creating an account or using our Services, you agree to be bound by these Terms.
                </p>
                <p>
                  <strong>If you do not agree to these Terms, do not use our Services.</strong>
                </p>
                <p>
                  Please also review our{' '}
                  <Link href="/privacy" className="font-medium text-emerald-800 underline">
                    Privacy Policy
                  </Link>
                  , which explains how we collect, use, and protect your information.
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">1. Eligibility</h2>
              <div className="space-y-4 text-slate-600">
                <p>To use KeepMore, you must:</p>
                <ul className="ml-6 space-y-2">
                  <li className="list-disc">Be at least 18 years of age</li>
                  <li className="list-disc">Have the legal capacity to enter into a binding contract</li>
                  <li className="list-disc">Not be prohibited from using our Services under applicable laws</li>
                  <li className="list-disc">Provide accurate and complete registration information</li>
                  <li className="list-disc">Maintain the security of your account credentials</li>
                </ul>
                <p>
                  By using our Services, you represent and warrant that you meet these eligibility requirements.
                </p>
              </div>
            </section>

            {/* Account Registration */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">2. Account Registration and Security</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">Creating an Account</h3>
                <p>
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Provide accurate, current, and complete information</li>
                  <li className="list-disc">Update your information to keep it accurate and current</li>
                  <li className="list-disc">Maintain the confidentiality of your password</li>
                  <li className="list-disc">Notify us immediately of any unauthorized access or security breach</li>
                  <li className="list-disc">Be responsible for all activities under your account</li>
                </ul>

                <h3 className="pt-4 font-medium text-slate-900">Account Security</h3>
                <p className="text-sm">
                  You are solely responsible for maintaining the security of your account. We recommend enabling multi-factor authentication. You agree to notify us immediately at{' '}
                  <a href="mailto:security@keepmore.app" className="font-medium text-emerald-800 underline">
                    security@keepmore.app
                  </a>{' '}
                  if you suspect any unauthorized access.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Account Termination</h3>
                <p className="text-sm">
                  We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason at our discretion. You may terminate your account at any time through your account settings.
                </p>
              </div>
            </section>

            {/* Plaid Integration */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-10">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-800" />
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-light text-slate-900">
                    3. Financial Account Connections and Plaid
                  </h2>
                  <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    <h3 className="font-medium text-slate-900">Use of Plaid Services</h3>
                    <p>
                      KeepMore uses <strong>Plaid Inc.</strong> to connect your financial accounts. When you use Plaid to link accounts:
                    </p>
                    <ul className="ml-6 space-y-2">
                      <li className="list-disc">
                        You authorize KeepMore and Plaid to access your financial account information
                      </li>
                      <li className="list-disc">
                        You agree to Plaid's{' '}
                        <a
                          href="https://plaid.com/legal"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-amber-900 underline"
                        >
                          End User Privacy Policy
                        </a>
                      </li>
                      <li className="list-disc">
                        You represent that you have the authority to connect these accounts
                      </li>
                      <li className="list-disc">
                        You are responsible for the accuracy of credentials you provide
                      </li>
                    </ul>

                    <h3 className="pt-4 font-medium text-slate-900">Your Authorization</h3>
                    <p>
                      By connecting accounts, you grant KeepMore permission to:
                    </p>
                    <ul className="ml-6 space-y-1">
                      <li className="list-disc">Access and retrieve account information, including balances, transactions, and holdings</li>
                      <li className="list-disc">Use this information to provide our Services (insights, categorization, AI assistance)</li>
                      <li className="list-disc">Store this information securely in accordance with our Privacy Policy</li>
                    </ul>

                    <h3 className="pt-4 font-medium text-slate-900">Read-Only Access</h3>
                    <p>
                      <strong>Important:</strong> KeepMore and Plaid have read-only access to your accounts. We cannot move money, make transactions, or modify your accounts in any way. We only retrieve information to display it to you and generate insights.
                    </p>

                    <h3 className="pt-4 font-medium text-slate-900">Disconnecting Accounts</h3>
                    <p>
                      You may disconnect accounts at any time through your account settings or via{' '}
                      <a
                        href="https://my.plaid.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-amber-900 underline"
                      >
                        Plaid Portal
                      </a>
                      . Disconnecting will stop new data retrieval but previously collected data may be retained as described in our Privacy Policy.
                    </p>

                    <h3 className="pt-4 font-medium text-slate-900">Account Connection Issues</h3>
                    <p>
                      We are not responsible for issues arising from:
                    </p>
                    <ul className="ml-6 space-y-1">
                      <li className="list-disc">Incorrect credentials provided by you</li>
                      <li className="list-disc">Your financial institution's system outages or changes</li>
                      <li className="list-disc">Changes to your account access or permissions</li>
                      <li className="list-disc">Third-party service interruptions (including Plaid)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* License and Restrictions */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">4. License and Restrictions</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">Limited License</h3>
                <p className="text-sm">
                  Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for your personal, non-commercial use.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Prohibited Uses</h3>
                <p className="text-sm">You agree not to:</p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Use the Services for any illegal purpose or in violation of any laws</li>
                  <li className="list-disc">Use automated systems (bots, scrapers) to access the Services</li>
                  <li className="list-disc">Reverse engineer, decompile, or attempt to extract source code</li>
                  <li className="list-disc">Interfere with or disrupt the Services or servers</li>
                  <li className="list-disc">Attempt to gain unauthorized access to any systems or data</li>
                  <li className="list-disc">Impersonate any person or entity</li>
                  <li className="list-disc">Upload viruses, malware, or malicious code</li>
                  <li className="list-disc">Use the Services to harm, threaten, or harass others</li>
                  <li className="list-disc">Collect or harvest user information without consent</li>
                  <li className="list-disc">Create derivative works or competing services</li>
                  <li className="list-disc">Remove or alter any proprietary notices or labels</li>
                  <li className="list-disc">Use the Services in any way that could damage our reputation</li>
                </ul>
              </div>
            </section>

            {/* Services Description */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">5. Our Services</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">What We Provide</h3>
                <p className="text-sm">
                  KeepMore provides AI-powered financial insights, including:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Aggregated view of your financial accounts</li>
                  <li className="list-disc">Transaction categorization and analysis</li>
                  <li className="list-disc">Investment portfolio tracking and insights</li>
                  <li className="list-disc">AI-powered conversational financial assistant</li>
                  <li className="list-disc">Spending patterns and trends</li>
                  <li className="list-disc">Financial recommendations and forecasts</li>
                </ul>

                <h3 className="pt-4 font-medium text-slate-900">Not Financial Advice</h3>
                <p className="text-sm">
                  <strong>IMPORTANT:</strong> KeepMore is an informational and analytical tool. We do not provide financial, investment, tax, or legal advice. Our AI-generated insights and recommendations are for educational and informational purposes only and should not be construed as professional advice.
                </p>
                <p className="text-sm">
                  You are solely responsible for your financial decisions. We are not:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">A registered investment advisor</li>
                  <li className="list-disc">A financial planner or broker-dealer</li>
                  <li className="list-disc">A tax advisor or accountant</li>
                  <li className="list-disc">A legal advisor</li>
                </ul>
                <p className="text-sm">
                  Always consult qualified professionals before making financial decisions.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Service Availability</h3>
                <p className="text-sm">
                  We strive for high availability but do not guarantee uninterrupted access. Services may be unavailable due to maintenance, updates, technical issues, or circumstances beyond our control. We are not liable for any losses resulting from service interruptions.
                </p>
              </div>
            </section>

            {/* AI Services */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">6. AI-Powered Features</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-sm">
                  Our AI financial assistant is powered by Claude, developed by Anthropic. When using AI features:
                </p>
                <ul className="ml-6 space-y-2 text-sm">
                  <li className="list-disc">
                    AI responses are generated based on your financial data and your questions
                  </li>
                  <li className="list-disc">
                    AI may make errors or provide incomplete information—always verify important information
                  </li>
                  <li className="list-disc">
                    AI responses do not constitute professional advice
                  </li>
                  <li className="list-disc">
                    You acknowledge that AI is a tool and should not be your sole basis for financial decisions
                  </li>
                  <li className="list-disc">
                    Your use of AI features is also subject to Anthropic's{' '}
                    <a
                      href="https://www.anthropic.com/legal/consumer-terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-800 underline"
                    >
                      Consumer Terms
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Fees and Payments */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">7. Fees and Payments</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">Free and Paid Tiers</h3>
                <p className="text-sm">
                  KeepMore offers both free and paid subscription plans. Free tier features and limitations are clearly disclosed in the app. Paid subscription pricing is displayed before you subscribe.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Subscription Terms</h3>
                <p className="text-sm">
                  By subscribing to a paid plan:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">You authorize recurring charges to your payment method</li>
                  <li className="list-disc">Subscriptions auto-renew unless canceled</li>
                  <li className="list-disc">You may cancel anytime through account settings</li>
                  <li className="list-disc">Cancellation takes effect at the end of your current billing period</li>
                  <li className="list-disc">No refunds for partial billing periods unless required by law</li>
                </ul>

                <h3 className="pt-4 font-medium text-slate-900">Price Changes</h3>
                <p className="text-sm">
                  We may change subscription prices with 30 days' notice. Continued use after notice constitutes acceptance of new prices. If you do not agree, cancel your subscription.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Payment Processing</h3>
                <p className="text-sm">
                  We use third-party payment processors. You agree to their terms and authorize them to charge your payment method. We are not responsible for payment processor errors or failures.
                </p>
              </div>
            </section>

            {/* User Content */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">8. User Content and Data</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">Your Data</h3>
                <p className="text-sm">
                  You retain ownership of your financial data and any content you provide (questions to AI, preferences, etc.). By using our Services, you grant us a license to use, process, and store this data solely to provide and improve our Services as described in our Privacy Policy.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Accuracy of Data</h3>
                <p className="text-sm">
                  While we strive for accuracy, we rely on data from your financial institutions via Plaid. We are not responsible for:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Inaccuracies in data provided by financial institutions</li>
                  <li className="list-disc">Delays in data updates</li>
                  <li className="list-disc">Incomplete or missing transaction information</li>
                  <li className="list-disc">Categorization errors (you can correct these)</li>
                </ul>

                <h3 className="pt-4 font-medium text-slate-900">Prohibited Content</h3>
                <p className="text-sm">
                  When interacting with our AI or providing any content, you agree not to submit content that:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Is illegal, harmful, threatening, abusive, or discriminatory</li>
                  <li className="list-disc">Violates intellectual property rights</li>
                  <li className="list-disc">Contains malware or malicious code</li>
                  <li className="list-disc">Impersonates others or misrepresents your identity</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">9. Intellectual Property</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-sm">
                  The Services, including all content, features, functionality, software, designs, text, graphics, logos, and trademarks, are owned by KeepMore or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-sm">
                  You may not copy, modify, distribute, sell, or lease any part of our Services without our express written permission.
                </p>
                <p className="text-sm">
                  "KeepMore" and our logo are trademarks of KeepMore Inc. Other trademarks mentioned (Plaid, Anthropic, Claude) are the property of their respective owners.
                </p>
              </div>
            </section>

            {/* Privacy and Data Protection */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">10. Privacy and Data Protection</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-sm">
                  Your privacy is important to us. Our collection, use, and sharing of your information is governed by our{' '}
                  <Link href="/privacy" className="font-medium text-emerald-800 underline">
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
                <p className="text-sm">
                  By using our Services, you consent to our data practices as described in the Privacy Policy.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Compliance with Laws</h3>
                <p className="text-sm">
                  We comply with applicable data protection and financial privacy laws, including:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Gramm-Leach-Bliley Act (GLBA)</li>
                  <li className="list-disc">California Consumer Privacy Act (CCPA)</li>
                  <li className="list-disc">General Data Protection Regulation (GDPR) for EU users</li>
                  <li className="list-disc">CFPB Section 1033 (Open Banking) requirements</li>
                </ul>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="rounded-2xl border-2 border-slate-300 bg-slate-50 p-10">
              <h2 className="mb-6 font-serif text-3xl font-light text-slate-900">
                11. Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="font-medium text-slate-900">AS-IS Basis</h3>
                <p className="text-sm uppercase">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">No Warranties</h3>
                <p className="text-sm">
                  We do not warrant that:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">The Services will be uninterrupted, timely, secure, or error-free</li>
                  <li className="list-disc">Results obtained from the Services will be accurate or reliable</li>
                  <li className="list-disc">Any errors will be corrected</li>
                  <li className="list-disc">The Services will meet your requirements</li>
                </ul>

                <h3 className="pt-4 font-medium text-slate-900">Limitation of Liability</h3>
                <p className="text-sm uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, KEEPMORE, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Your access to or use of (or inability to access or use) the Services</li>
                  <li className="list-disc">Any conduct or content of third parties on the Services</li>
                  <li className="list-disc">Unauthorized access, use, or alteration of your data</li>
                  <li className="list-disc">Financial decisions made based on our Services</li>
                  <li className="list-disc">Errors or inaccuracies in financial data</li>
                </ul>

                <p className="pt-4 text-sm uppercase">
                  IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE GREATER OF $100 OR THE AMOUNT YOU PAID US IN THE PAST TWELVE MONTHS.
                </p>

                <p className="pt-4 text-xs">
                  Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for incidental or consequential damages. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">12. Indemnification</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-sm">
                  You agree to indemnify, defend, and hold harmless KeepMore, its officers, directors, employees, agents, licensors, and suppliers from and against all claims, losses, expenses, damages, and costs, including reasonable attorneys' fees, arising out of or relating to:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Your use of the Services</li>
                  <li className="list-disc">Your violation of these Terms</li>
                  <li className="list-disc">Your violation of any rights of another</li>
                  <li className="list-disc">Your content or data</li>
                  <li className="list-disc">Your financial decisions made using our Services</li>
                </ul>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">13. Dispute Resolution and Arbitration</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">Informal Resolution</h3>
                <p className="text-sm">
                  Before filing a claim, you agree to contact us at{' '}
                  <a href="mailto:legal@keepmore.app" className="font-medium text-emerald-800 underline">
                    legal@keepmore.app
                  </a>{' '}
                  to attempt to resolve the dispute informally. We will make good faith efforts to resolve disputes.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Binding Arbitration</h3>
                <p className="text-sm">
                  If informal resolution fails, disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Arbitration will be conducted in [Your State/Location]. You waive your right to a jury trial and to participate in class action lawsuits.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Exceptions</h3>
                <p className="text-sm">
                  Either party may bring claims in small claims court if they qualify. Either party may seek injunctive relief in court for intellectual property violations.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">14. Governing Law</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-sm">
                  These Terms are governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">15. Changes to These Terms</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-sm">
                  We may modify these Terms at any time. If we make material changes, we will notify you by email or through the app at least 30 days before the changes take effect. Your continued use of the Services after changes constitutes acceptance of the updated Terms.
                </p>
                <p className="text-sm">
                  If you do not agree to the changes, you must stop using the Services and may terminate your account.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">16. Termination</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">By You</h3>
                <p className="text-sm">
                  You may terminate your account at any time through account settings. Upon termination, your right to use the Services ceases immediately.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">By Us</h3>
                <p className="text-sm">
                  We may suspend or terminate your account at any time, with or without notice, for:
                </p>
                <ul className="ml-6 space-y-1 text-sm">
                  <li className="list-disc">Violation of these Terms</li>
                  <li className="list-disc">Fraudulent, illegal, or harmful activity</li>
                  <li className="list-disc">Non-payment of fees</li>
                  <li className="list-disc">Extended inactivity</li>
                  <li className="list-disc">Any reason at our discretion</li>
                </ul>

                <h3 className="pt-4 font-medium text-slate-900">Effect of Termination</h3>
                <p className="text-sm">
                  Upon termination, your data may be deleted in accordance with our Privacy Policy. Some provisions of these Terms survive termination, including intellectual property rights, disclaimers, limitations of liability, and dispute resolution.
                </p>
              </div>
            </section>

            {/* General Provisions */}
            <section className="rounded-xl border border-stone-200 bg-white p-8">
              <h2 className="mb-6 font-serif text-2xl font-light text-slate-900">17. General Provisions</h2>
              <div className="space-y-4 text-slate-600">
                <h3 className="font-medium text-slate-900">Entire Agreement</h3>
                <p className="text-sm">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and KeepMore regarding use of the Services.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Severability</h3>
                <p className="text-sm">
                  If any provision is found unenforceable, the remaining provisions remain in full effect.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Waiver</h3>
                <p className="text-sm">
                  Our failure to enforce any right or provision does not constitute a waiver of that right or provision.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Assignment</h3>
                <p className="text-sm">
                  You may not assign or transfer these Terms. We may assign these Terms without restriction.
                </p>

                <h3 className="pt-4 font-medium text-slate-900">Force Majeure</h3>
                <p className="text-sm">
                  We are not liable for delays or failures due to circumstances beyond our reasonable control (natural disasters, war, government actions, internet failures, etc.).
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-stone-200 bg-slate-900 p-10 text-white">
              <h2 className="mb-6 font-serif text-3xl font-light">18. Contact Information</h2>
              <div className="space-y-4">
                <p>
                  If you have questions about these Terms or our Services, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:legal@keepmore.app" className="text-amber-200 underline">
                      legal@keepmore.app
                    </a>
                  </p>
                  <p>
                    <strong>Support:</strong>{' '}
                    <a href="mailto:support@keepmore.app" className="text-amber-200 underline">
                      support@keepmore.app
                    </a>
                  </p>
                  <p>
                    <strong>Mailing Address:</strong>
                    <br />
                    KeepMore Inc.
                    <br />
                    Legal Department
                    <br />
                    [Your Address]
                    <br />
                    [City, State, ZIP]
                  </p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="rounded-2xl border-2 border-emerald-800 bg-emerald-50 p-10">
              <h2 className="mb-4 font-serif text-2xl font-light text-slate-900">
                Acknowledgment
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                <strong>BY USING KEEPMORE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM.</strong> If you do not agree to these Terms, do not use our Services.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}