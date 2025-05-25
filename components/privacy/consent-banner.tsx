"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings, X } from "lucide-react"
import { GDPRService } from "@/lib/privacy/gdpr-service"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

export function ConsentBanner() {
  const { user } = useAuth()
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consents, setConsents] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  const gdprService = new GDPRService()

  useEffect(() => {
    checkConsentStatus()
  }, [user])

  const checkConsentStatus = async () => {
    const hasConsent = localStorage.getItem("gdpr-consent")
    if (!hasConsent) {
      setShowBanner(true)
    }

    if (user) {
      try {
        const userConsents = await gdprService.getUserConsents(user.id)
        setConsents((prev) => ({ ...prev, ...userConsents }))
      } catch (error) {
        console.error("Erreur lors de la récupération des consentements:", error)
      }
    }
  }

  const handleAcceptAll = async () => {
    const allConsents = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }

    await saveConsents(allConsents)
  }

  const handleAcceptSelected = async () => {
    await saveConsents(consents)
  }

  const handleRejectAll = async () => {
    const minimalConsents = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }

    await saveConsents(minimalConsents)
  }

  const saveConsents = async (consentData: typeof consents) => {
    try {
      localStorage.setItem("gdpr-consent", JSON.stringify(consentData))

      if (user) {
        await gdprService.recordConsent(user.id, consentData, await getClientIP(), navigator.userAgent)
      }

      setShowBanner(false)

      // Appliquer les consentements
      applyConsents(consentData)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des consentements:", error)
    }
  }

  const applyConsents = (consentData: typeof consents) => {
    // Analytics
    if (consentData.analytics) {
      // Activer Google Analytics, etc.
      console.log("Analytics activé")
    }

    // Marketing
    if (consentData.marketing) {
      // Activer les pixels de tracking, etc.
      console.log("Marketing activé")
    }

    // Functional
    if (consentData.functional) {
      // Activer les fonctionnalités avancées
      console.log("Fonctionnalités activées")
    }
  }

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch("/api/client-ip")
      const data = await response.json()
      return data.ip || "unknown"
    } catch {
      return "unknown"
    }
  }

  const consentDescriptions = {
    necessary: "Cookies essentiels au fonctionnement du site (connexion, panier, etc.)",
    functional: "Cookies pour améliorer votre expérience (préférences, langue, etc.)",
    analytics: "Cookies pour analyser l'utilisation du site et améliorer nos services",
    marketing: "Cookies pour personnaliser les publicités et mesurer leur efficacité",
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <Card className="max-w-4xl mx-auto shadow-2xl border-2">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Protection de vos données</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowBanner(false)} className="h-6 w-6">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez choisir quels
                    types de cookies accepter.
                  </p>

                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 mb-4"
                    >
                      {Object.entries(consentDescriptions).map(([key, description]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium capitalize">{key}</span>
                              {key === "necessary" && (
                                <Badge variant="secondary" className="text-xs">
                                  Obligatoire
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                          </div>
                          <Switch
                            checked={consents[key as keyof typeof consents]}
                            onCheckedChange={(checked) => setConsents((prev) => ({ ...prev, [key]: checked }))}
                            disabled={key === "necessary"}
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleAcceptAll} className="flex-1">
                      Tout accepter
                    </Button>
                    <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Personnaliser
                    </Button>
                    {showDetails && (
                      <Button variant="outline" onClick={handleAcceptSelected} className="flex-1">
                        Accepter la sélection
                      </Button>
                    )}
                    <Button variant="ghost" onClick={handleRejectAll} className="flex-1">
                      Tout refuser
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
