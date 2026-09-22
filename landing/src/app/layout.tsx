import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { Inter, Instrument_Serif } from 'next/font/google';
import Providers from './providers';
import '../index.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://himalayancode.vercel.app';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HimalayanCode - PahadiScript Web Interpreter | Code in Hindi',
    template: '%s | HimalayanCode',
  },
  description:
    'HimalayanCode (PahadiScript) is an open-source, beginner-friendly programming language using intuitive Hindi keywords like agar, bol, and phir. Write, run, and learn coding concepts in your native language.',
  applicationName: 'HimalayanCode',
  authors: [{ name: 'HimalayanCode Team', url: 'https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter' }],
  generator: 'Next.js',
  keywords: [
    'HimalayanCode',
    'PahadiScript',
    'Hindi programming language',
    'Code in Hindi',
    'Hindi code editor',
    'Hindi coding interpreter',
    'Learn programming in Hindi',
    'Indian programming language',
    'Pahadi language compiler',
    'Online code editor Hindi',
    'Engineering first year coding',
    'Himalayan coding platform',
    'bol agar warna syntax',
    'Beginner friendly programming language India',
    'Compiler design PLY Python',
  ],
  creator: 'HimalayanCode Community',
  publisher: 'HimalayanCode',
  category: 'education',
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'hi-IN': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['hi_IN'],
    url: siteUrl,
    title: 'HimalayanCode - PahadiScript Web Interpreter | Code in Hindi',
    description:
      'Code in the language of the mountains. Write, execute, and learn programming with intuitive Hindi syntax. Built for Indian students and beginners.',
    siteName: 'HimalayanCode',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HimalayanCode - PahadiScript Online Web Interpreter',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HimalayanCode - PahadiScript Web Interpreter | Code in Hindi',
    description:
      'Code in the language of the mountains. Write, run, and master programming concepts in Hindi.',
    images: ['/og-image.png'],
    creator: '@HimalayanCode',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: 'HimalayanCode - PahadiScript Web Interpreter',
      url: siteUrl,
      applicationCategory: 'EducationalApplication, DeveloperApplication',
      operatingSystem: 'All modern web browsers',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      description:
        'An interactive web IDE and interpreter for PahadiScript — a beginner-friendly programming language using Hindi keywords to help engineering students learn coding concepts intuitively.',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '340',
        bestRating: '5',
      },
      featureList: [
        'Native Hindi keywords (agar, bol, warna, jabtak, phir)',
        'Real-time online code execution with Python PLY engine',
        'Syntax highlighting and online code editor',
        'Execution history and compile metrics dashboard',
        'Instant code sharing links',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'HimalayanCode',
      description: 'Code in the language of the mountains — PahadiScript Online Web Interpreter',
      inLanguage: ['en-IN', 'hi-IN'],
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'HimalayanCode',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
      sameAs: [
        'https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is HimalayanCode and PahadiScript?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'HimalayanCode is an educational programming platform powered by PahadiScript — a programming language created with Hindi-based keywords (such as bol, agar, warna, jabtak) designed to eliminate English syntax barriers for beginner engineering students.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does PahadiScript help first-year engineering students?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Many students enter engineering without prior computer science education in high school. PahadiScript allows students to focus on algorithmic logic, variables, conditionals, and loops using intuitive Hindi keywords before transitioning to C, C++, or Python.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the common keywords used in PahadiScript?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PahadiScript features 20 intuitive keywords mapping to standard C/Python constructs: shuru (main), bol (printf/print), sun (scanf/input), agar (if), magar (else), phir (for loop), jabtak (while loop), kaam (function), paucha (return), sahi (true), and galat (false).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is HimalayanCode free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, HimalayanCode is completely free, open-source, and accessible directly in any web browser without needing to install compilers or libraries locally.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I execute and share PahadiScript code online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, the HimalayanCode web interpreter executes your PahadiScript code in real-time, displays stdout and stderr output, and lets you generate instant shareable links for your code snippets.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="antialiased font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
