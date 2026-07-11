import type { Metadata } from 'next'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  // ⚠️  DOMAIN CHECK: canonical & OG URL are set to https://buildhive.studio
  // If the domain is not yet live, social sharing previews will 404.
  // Verify the domain is pointed and SSL is provisioned before shipping to production.
  metadataBase: new URL('https://buildhive.studio'),
  title: 'BuildHive — Premium 3D Web Studio | Digital Products & Brand Experiences',
  description:
    'BuildHive is a premium freelance studio specializing in 3D websites, digital products, data analytics, and brand experiences. Built for founders, CTOs, and brand directors who refuse mediocrity.',
  keywords: [
    'WebGL studio',
    '3D websites',
    'Next.js development',
    'digital products',
    'brand experiences',
    'data analytics',
    'Vijayawada',
    'freelance web studio',
    'premium web design',
  ],
  openGraph: {
    title: 'BuildHive — Premium 3D Web Studio',
    description: 'Sharp. Adaptive. Relentless. Digital experiences that make your competitors uncomfortable.',
    type: 'website',
    locale: 'en_US',
    url: 'https://buildhive.studio',
    siteName: 'BuildHive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildHive — Premium 3D Web Studio',
    description: 'Sharp. Adaptive. Relentless.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://buildhive.studio',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="font-body theme-dark-bg text-white/95 overflow-x-hidden w-full max-w-[100vw]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
