import './globals.css'
import Script from 'next/script'
import { IBM_Plex_Mono, Manrope, Space_Grotesk, Cormorant_Garamond } from 'next/font/google'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata = {
  title: 'KeepMore',
  description: 'Keep More of What You Earn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-PX8K1QBXY1"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PX8K1QBXY1');
          `}
        </Script>
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable} font-body`}>
        {children}
      </body>
    </html>
  )
}