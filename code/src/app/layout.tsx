/**
 * TestNauti - Real Exam Practice Platform
 * 
 * A complete, production-ready exam practice platform helping students
 * prepare with confidence using authentic past exam papers.
 * 
 * 🎉 Phase 7 Complete - Ready to help students succeed!
 * 
 * Features:
 * - Interactive quiz engine with realistic exam conditions
 * - Optional timer with auto-submit
 * - Comprehensive progress tracking and dashboard
 * - Mobile-responsive design
 * - Secure authentication with Clerk
 * - PostgreSQL database for persistent progress
 * 
 * Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and ❤️
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://testnauti.co'),
  title: {
    default: "TestNauti - Practica para tu examen PER",
    template: "%s | TestNauti",
  },
  description: "Practica con exámenes reales del PER. Mejora tu confianza con tests auténticos, cronómetro, seguimiento de progreso y revisión detallada de resultados. Encuentra tu escuela náutica ideal.",
  keywords: [
    'examen PER',
    'patrón embarcaciones recreo',
    'test náutico',
    'escuelas náuticas España',
    'preparación PER',
    'exámenes náuticos',
    'titulación náutica',
    'práctica PER',
  ],
  authors: [{ name: 'TestNauti' }],
  creator: 'TestNauti',
  publisher: 'TestNauti',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://testnauti.co',
    siteName: 'TestNauti',
    title: 'TestNauti - Practica para tu examen PER',
    description: 'Practica con exámenes reales del PER. Mejora tu confianza con tests auténticos y encuentra tu escuela náutica ideal.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestNauti - Practica para tu examen PER',
    description: 'Practica con exámenes reales del PER. Mejora tu confianza con tests auténticos.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
