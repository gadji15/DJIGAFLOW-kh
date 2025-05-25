import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./high-contrast.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/sonner"
import { NotificationProvider } from "@/components/ui/notification"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
})

export const metadata: Metadata = {
  title: "DjigaFlow - Votre boutique de dropshipping",
  description: "Découvrez notre sélection de produits tendance à prix compétitifs",
  keywords: "e-commerce, dropshipping, produits tendance, achats en ligne, boutique en ligne",
  authors: [{ name: "DjigaFlow Team" }],
  creator: "DjigaFlow",
  publisher: "DjigaFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://djigaflow.com",
    title: "DjigaFlow - Votre boutique de dropshipping",
    description: "Découvrez notre sélection de produits tendance à prix compétitifs",
    siteName: "DjigaFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "DjigaFlow - Votre boutique de dropshipping",
    description: "Découvrez notre sélection de produits tendance à prix compétitifs",
    creator: "@djigaflow",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NotificationProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toaster position="top-right" richColors />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
