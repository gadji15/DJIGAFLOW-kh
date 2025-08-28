"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { TikTokIcon } from "@/components/ui/icons/tiktok"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

export function MobileOptimizedFooter() {
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const footerSections = [
    {
      id: "shop",
      title: "Boutique",
      links: [
        { href: "/catalogue", label: "Catalogue" },
        { href: "/nouveautes", label: "Nouveautés" },
        { href: "/promotions", label: "Promotions" },
        { href: "/marques", label: "Marques" },
      ],
    },
    {
      id: "help",
      title: "Aide & Support",
      links: [
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
        { href: "/livraison", label: "Livraison" },
        { href: "/guide-tailles", label: "Guide des tailles" },
      ],
    },
    {
      id: "company",
      title: "Entreprise",
      links: [
        { href: "/a-propos", label: "À propos" },
        { href: "/mentions-legales", label: "Mentions légales" },
        { href: "/politique-confidentialite", label: "Confidentialité" },
        { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
      ],
    },
  ]

  const socialLinks = [
    { href: siteConfig.social.facebook, icon: Facebook, label: "Facebook" },
    { href: siteConfig.social.twitter, icon: Twitter, label: "Twitter" },
    { href: siteConfig.social.instagram, icon: Instagram, label: "Instagram" },
    { href: siteConfig.social.tiktok, icon: TikTokIcon, label: "TikTok" },
    { href: siteConfig.social.youtube, icon: Youtube, label: "YouTube" },
    { href: siteConfig.social.linkedin, icon: Instagram, label: "LinkedIn" },
  ].filter((s) => !!s.href)

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-6 sm:py-8 border-b border-border/40">
          <div className="text-center space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold">Restez informé</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Recevez nos dernières offres et nouveautés directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Votre adresse email" className="flex-1 h-9" />
              <Button size="sm" className="h-9 px-4">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-6 sm:py-8">
          {/* Mobile Collapsible Sections */}
          <div className="lg:hidden space-y-1">
            {footerSections.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between h-12 px-0 font-medium">
                    {section.title}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openSections.includes(section.id) && "rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-4">
                  <div className="space-y-2 pl-0">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
            {footerSections.map((section) => (
              <div key={section.id}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{siteConfig.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{siteConfig.contact.email}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{siteConfig.address.line1}, {siteConfig.address.postalCode} {siteConfig.address.city}, {siteConfig.address.country}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Contact Info */}
          <div className="lg:hidden mt-6 pt-6 border-t border-border/40">
            <h3 className="font-semibold mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-4 sm:py-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
