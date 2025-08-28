"use client"

import Link from "next/link"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Award,
} from "lucide-react"
import { siteConfig } from "@/lib/site-config"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EnhancedNewsletterForm } from "@/components/forms/enhanced-newsletter-form"

const footerLinks = {
  company: {
    title: "Entreprise",
    links: [
      { name: "À propos", href: "/a-propos" },
      { name: "Nos valeurs", href: "/valeurs" },
      { name: "Carrières", href: "/carrieres" },
      { name: "Presse", href: "/presse" },
      { name: "Partenaires", href: "/partenaires" },
    ],
  },
  customer: {
    title: "Service Client",
    links: [
      { name: "Centre d'aide", href: "/aide" },
      { name: "Contact", href: "/contact" },
      { name: "Livraison", href: "/livraison" },
      { name: "Retours", href: "/retours" },
      { name: "Garanties", href: "/garanties" },
    ],
  },
  legal: {
    title: "Légal",
    links: [
      { name: "Conditions d'utilisation", href: "/conditions" },
      { name: "Politique de confidentialité", href: "/confidentialite" },
      { name: "Mentions légales", href: "/mentions-legales" },
      { name: "Cookies", href: "/cookies" },
      { name: "RGPD", href: "/rgpd" },
    ],
  },
  categories: {
    title: "Catégories",
    links: [
      { name: "Électronique", href: "/catalogue/electronique" },
      { name: "Mode", href: "/catalogue/mode" },
      { name: "Maison", href: "/catalogue/maison" },
      { name: "Sport", href: "/catalogue/sport" },
      { name: "Beauté", href: "/catalogue/beaute" },
    ],
  },
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: siteConfig.social.facebook },
  { name: "Twitter", icon: Twitter, href: siteConfig.social.twitter },
  { name: "Instagram", icon: Instagram, href: siteConfig.social.instagram },
  { name: "TikTok", icon: Instagram, href: siteConfig.social.tiktok },
  { name: "YouTube", icon: Youtube, href: siteConfig.social.youtube },
].filter((s) =&gt; !!s.href)

const trustBadges = [
  { icon: Shield, text: "Paiement sécurisé" },
  { icon: Truck, text: "Livraison rapide" },
  { icon: Award, text: "Qualité garantie" },
  { icon: CreditCard, text: "Paiement en 3x" },
]

export function ProfessionalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <EnhancedNewsletterForm variant="compact" showBenefits={false} />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DJ</span>
              </div>
              <span className="font-bold text-xl">JammShop</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Votre marketplace de confiance pour tous vos achats en ligne. Qualité, rapidité et service client
              exceptionnel.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{siteConfig.address.line1}, {siteConfig.address.postalCode} {siteConfig.address.city}</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{badge.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social Links & Payment Methods */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Suivez-nous :</span>
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Button key={social.name} variant="ghost" size="sm" asChild>
                      <Link href={social.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4" />
                        <span className="sr-only">{social.name}</span>
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Paiement sécurisé :</span>
              <div className="flex gap-2">
                {["visa", "mastercard", "paypal", "apple-pay"].map((method) => (
                  <div key={method} className="w-8 h-6 bg-muted rounded border flex items-center justify-center">
                    <span className="text-xs font-bold uppercase">{method.slice(0, 2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <p>&copy; {currentYear} JammShop. Tous droits réservés.</p>
            <span className="hidden md:inline">•</span>
            <p>Fait avec ❤️ en France</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/plan-du-site" className="hover:text-foreground transition-colors">
              Plan du site
            </Link>
            <Link href="/accessibilite" className="hover:text-foreground transition-colors">
              Accessibilité
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Gestion des cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
