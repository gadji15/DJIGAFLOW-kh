import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/sonner"
import { ToastProvider } from "@/components/ui/toast-system"
import { UnifiedHeader } from "@/components/unified-header"
import { ProfessionalFooter } from "@/components/professional-footer"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { PerformanceMonitor } from "@/components/ui/performance-monitor"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "DjigaFlow - Marketplace Professionnel",
    template: "%s | DjigaFlow",
  },
  description:
    "DjigaFlow est votre marketplace professionnel de confiance. Découvrez des milliers de produits de qualité avec livraison rapide et service client exceptionnel.",
  keywords: ["marketplace", "e-commerce", "dropshipping", "produits", "livraison", "qualité", "professionnel"],
  authors: [{ name: "DjigaFlow Team", url: "https://djigaflow.com" }],
  creator: "DjigaFlow",
  publisher: "DjigaFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://djigaflow.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/fr",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "DjigaFlow",
    title: "DjigaFlow - Marketplace Professionnel",
    description: "Votre marketplace de confiance pour tous vos achats en ligne.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DjigaFlow - Marketplace Professionnel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DjigaFlow - Marketplace Professionnel",
    description: "Votre marketplace de confiance pour tous vos achats en ligne.",
    images: ["/images/og-image.jpg"],
    creator: "@djigaflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
  category: "technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
                  <UnifiedHeader />
                  <main className="flex-1 relative">{children}</main>
                  <ProfessionalFooter />
                </div>
                <Toaster />
                <ServiceWorkerRegister />
                <PerformanceMonitor />
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
