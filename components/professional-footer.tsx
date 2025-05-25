"use client"

import Link from "next/link"
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveFlex,
  ResponsiveTypography,
  ResponsiveButton,
} from "@/components/ui/responsive-design-system"
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
  ArrowUp,
} from "lucide-react"
import { motion } from "framer-motion"

export function ProfessionalFooter() {
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
    { name: "Facebook", href: "https://facebook.com/djigaflow", icon: <Facebook className="h-5 w-5" /> },
    { name: "Instagram", href: "https://instagram.com/djigaflow", icon: <Instagram className="h-5 w-5" /> },
    { name: "Twitter", href: "https://twitter.com/djigaflow", icon: <Twitter className="h-5 w-5" /> },
    { name: "YouTube", href: "https://youtube.com/djigaflow", icon: <Youtube className="h-5 w-5" /> },
    { name: "LinkedIn", href: "https://linkedin.com/company/djigaflow", icon: <Linkedin className="h-5 w-5" /> },
  ]

  const paymentMethods = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Klarna"]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-700">
        <ResponsiveContainer spacing="lg">
          <ResponsiveGrid cols={4}>
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
                <div className="min-w-0">
                  <ResponsiveTypography variant="body" className="font-semibold text-white">
                    {feature.title}
                  </ResponsiveTypography>
                  <ResponsiveTypography variant="caption" className="text-gray-300">
                    {feature.description}
                  </ResponsiveTypography>
                </div>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </div>

      {/* Main Footer Content */}
      <ResponsiveContainer spacing="xl">
        <ResponsiveGrid cols={6} className="lg:grid-cols-6">
          {/* Brand Section */}
          <div className="col-span-full lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <div>
                  <ResponsiveTypography variant="h5" className="text-white font-bold">
                    DjigaFlow
                  </ResponsiveTypography>
                  <ResponsiveTypography variant="caption" className="text-gray-400">
                    Votre boutique tendance
                  </ResponsiveTypography>
                </div>
              </Link>

              <ResponsiveTypography variant="body" className="text-gray-300 mb-6 leading-relaxed">
                Découvrez notre sélection de produits tendance à prix compétitifs. Livraison rapide, service client
                exceptionnel et satisfaction garantie.
              </ResponsiveTypography>

              {/* Newsletter */}
              <div className="space-y-4">
                <ResponsiveTypography variant="h6" className="text-white">
                  Newsletter
                </ResponsiveTypography>
                <ResponsiveTypography variant="body-sm" className="text-gray-400">
                  Recevez nos offres exclusives et nouveautés
                </ResponsiveTypography>
                <ResponsiveFlex gap="sm">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 flex-1"
                  />
                  <ResponsiveButton variant="gradient" size="md">
                    <Mail className="h-4 w-4" />
                  </ResponsiveButton>
                </ResponsiveFlex>
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
            <ResponsiveTypography variant="h6" className="text-white mb-6">
              Liens rapides
            </ResponsiveTypography>
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
            <ResponsiveTypography variant="h6" className="text-white mb-6">
              Service client
            </ResponsiveTypography>
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
            <ResponsiveTypography variant="h6" className="text-white mb-6">
              Entreprise
            </ResponsiveTypography>
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
            <ResponsiveTypography variant="h6" className="text-white mb-6">
              Contact
            </ResponsiveTypography>
            <div className="space-y-4 mb-6">
              <Link
                href="/contact"
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                +33 1 23 45 67 89
              </Link>
              <Link
                href="/contact"
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                contact@djigaflow.com
              </Link>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />
                <span>
                  123 Rue du Commerce
                  <br />
                  75001 Paris, France
                </span>
              </div>
            </div>

            <ResponsiveTypography variant="body-sm" className="text-white font-semibold mb-3">
              Légal
            </ResponsiveTypography>
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
        </ResponsiveGrid>
      </ResponsiveContainer>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <ResponsiveContainer spacing="lg">
          <ResponsiveFlex direction="responsive-row" justify="between" align="center" gap="lg">
            {/* Copyright */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ResponsiveTypography variant="body-sm" className="text-gray-400">
                &copy; {currentYear} DjigaFlow. Tous droits réservés.
              </ResponsiveTypography>
              <ResponsiveTypography variant="caption" className="text-gray-500 mt-1">
                Plateforme de dropshipping professionnelle
              </ResponsiveTypography>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <ResponsiveFlex gap="sm">
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
              </ResponsiveFlex>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              className="flex flex-col items-center lg:items-end"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ResponsiveTypography variant="caption" className="text-gray-400 mb-3">
                Paiements sécurisés :
              </ResponsiveTypography>
              <ResponsiveFlex gap="xs" className="flex-wrap justify-center lg:justify-end">
                {paymentMethods.map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-white/10 rounded text-xs text-gray-300 border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    {method}
                  </div>
                ))}
              </ResponsiveFlex>
            </motion.div>
          </ResponsiveFlex>

          {/* Scroll to Top Button */}
          <div className="flex justify-center mt-8">
            <ResponsiveButton
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Retour en haut
            </ResponsiveButton>
          </div>
        </ResponsiveContainer>
      </div>
    </footer>
  )
}
