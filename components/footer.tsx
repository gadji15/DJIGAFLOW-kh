"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Truck,
  Shield,
  RotateCcw,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"
import { siteConfig } from "@/lib/site-config"
import { TikTokIcon } from "@/components/ui/icons/tiktok"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Catalogue", href: "/catalogue" },
    { name: "Nouveautés", href: "/nouveautes", badge: "New" },
    { name: "Promotions", href: "/promotions", badge: "Hot" },
    { name: "Marques", href: "/marques" },
    { name: "Guide des tailles", href: "/guide-tailles" },
  ]

  const customerService = [
    { name: "Mon compte", href: "/compte" },
    { name: "Mes commandes", href: "/commandes" },
    { name: "Livraison & Retours", href: "/livraison" },
    { name: "FAQ", href: "/faq" },
    { name: "Service client", href: "/contact" },
  ]

  const company = [
    { name: "À propos", href: "/a-propos" },
    { name: "Notre histoire", href: "/notre-histoire" },
    { name: "Carrières", href: "/carrieres" },
    { name: "Presse", href: "/presse" },
    { name: "Partenaires", href: "/partenaires" },
  ]

  const legal = [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Conditions générales", href: "/conditions-generales" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
    { name: "Cookies", href: "/cookies" },
    { name: "RGPD", href: "/rgpd" },
  ]

  const features = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Livraison gratuite",
      description: "Dès 50€ d'achat",
    },
    {
      icon: <RotateCcw className="h-5 w-5" />,
      title: "Retours gratuits",
      description: "30 jours pour changer d'avis",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Paiement sécurisé",
      description: "SSL & 3D Secure",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Support 24/7",
      description: "Assistance en continu",
    },
  ]

  const socialLinks = [
    { name: "Facebook", href: siteConfig.social.facebook, icon: <Facebook className="h-5 w-5" /> },
    { name: "Instagram", href: siteConfig.social.instagram, icon: <Instagram className="h-5 w-5" /> },
    { name: "Twitter", href: siteConfig.social.twitter, icon: <Twitter className="h-5 w-5" /> },
    { name: "TikTok", href: siteConfig.social.tiktok, icon: <TikTokIcon className="h-5 w-5" /> },
    { name: "YouTube", href: siteConfig.social.youtube, icon: <Youtube className="h-5 w-5" /> },
    { name: "LinkedIn", href: siteConfig.social.linkedin, icon: <Linkedin className="h-5 w-5" /> },
  ].filter((s) => !!s.href)

  const paymentMethods = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Klarna"]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {siteConfig.name}
                  </span>
                  <div className="text-xs text-gray-400">{siteConfig.tagline}</div>
                </div>
              </Link>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Découvrez notre sélection de produits tendance à prix compétitifs. Livraison rapide, service client
                exceptionnel et satisfaction garantie.
              </p>

              {/* Newsletter */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Newsletter</h3>
                <p className="text-sm text-gray-400">Recevez nos offres exclusives et nouveautés</p>
                <form className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Mail className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Service client</h3>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Entreprise</h3>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-4 mb-6">
              <Link
                href="/contact"
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                {siteConfig.contact.phone}
              </Link>
              <Link
                href="/contact"
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                {siteConfig.contact.email}
              </Link>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />
                <span>
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.postalCode} {siteConfig.address.city}, {siteConfig.address.country}
                </span>
              </div>
            </div>

            <h4 className="text-sm font-semibold mb-3">Légal</h4>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 text-sm">&copy; {currentYear} {siteConfig.name}. Tous droits réservés.</p>
              <p className="text-xs text-gray-500 mt-1">Plateforme de dropshipping professionnelle</p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              className="flex flex-col items-center lg:items-end"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 text-xs mb-3">Paiements sécurisés :</p>
              <div className="flex flex-wrap justify-center lg:justify-end gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-white/10 rounded text-xs text-gray-300 border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
