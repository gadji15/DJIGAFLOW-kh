"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, TestTube } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const supplierTypes = [
  { value: "aliexpress", label: "AliExpress" },
  { value: "jumia", label: "Jumia" },
  { value: "amazon", label: "Amazon" },
  { value: "dhgate", label: "DHgate" },
  { value: "alibaba", label: "Alibaba" },
  { value: "other", label: "Autre" },
]

const currencies = [
  { value: "EUR", label: "Euro (EUR)" },
  { value: "USD", label: "Dollar US (USD)" },
  { value: "XOF", label: "Franc CFA (XOF)" },
  { value: "GBP", label: "Livre Sterling (GBP)" },
  { value: "CNY", label: "Yuan Chinois (CNY)" },
]

export default function AddSupplierPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    website_url: "",
    api_endpoint: "",
    api_key: "",
    api_secret: "",
    commission_rate: 0,
    currency: "EUR",
    min_order_amount: 0,
    processing_time_days: 3,
    auto_sync: true,
    sync_frequency: 3600,
    contact_info: {
      email: "",
      phone: "",
      contact_person: "",
    },
    shipping_zones: ["FR", "EU"],
    settings: {},
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("contact_info.")) {
      const contactField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [contactField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const testConnection = async () => {
    if (!formData.api_endpoint || !formData.api_key) {
      toast.error("Veuillez remplir l'endpoint API et la clé API")
      return
    }

    setTesting(true)
    try {
      const response = await fetch("/api/suppliers/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          api_endpoint: formData.api_endpoint,
          api_key: formData.api_key,
          api_secret: formData.api_secret,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Connexion réussie ! API fonctionnelle.")
      } else {
        toast.error(`Erreur de connexion: ${result.error}`)
      }
    } catch (error) {
      toast.error("Erreur lors du test de connexion")
    } finally {
      setTesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type) {
      toast.error("Veuillez remplir les champs obligatoires")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([
          {
            name: formData.name,
            type: formData.type,
            website_url: formData.website_url || null,
            api_endpoint: formData.api_endpoint || null,
            api_key: formData.api_key || null,
            api_secret: formData.api_secret || null,
            commission_rate: formData.commission_rate,
            currency: formData.currency,
            min_order_amount: formData.min_order_amount,
            processing_time_days: formData.processing_time_days,
            auto_sync: formData.auto_sync,
            sync_frequency: formData.sync_frequency,
            contact_info: formData.contact_info,
            shipping_zones: formData.shipping_zones,
            settings: formData.settings,
            status: "active",
          },
        ])
        .select()

      if (error) {
        throw error
      }

      toast.success("Fournisseur ajouté avec succès !")
      router.push("/admin/fournisseurs")
    } catch (error: any) {
      console.error("Error adding supplier:", error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/fournisseurs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Ajouter un fournisseur</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du fournisseur *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: AliExpress Store"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type de fournisseur *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplierTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website_url">Site web</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuration API */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api_endpoint">Endpoint API</Label>
                <Input
                  id="api_endpoint"
                  value={formData.api_endpoint}
                  onChange={(e) => handleInputChange("api_endpoint", e.target.value)}
                  placeholder="https://api.example.com/v1"
                />
              </div>

              <div>
                <Label htmlFor="api_key">Clé API</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => handleInputChange("api_key", e.target.value)}
                  placeholder="Votre clé API"
                />
              </div>

              <div>
                <Label htmlFor="api_secret">Secret API (optionnel)</Label>
                <Input
                  id="api_secret"
                  type="password"
                  value={formData.api_secret}
                  onChange={(e) => handleInputChange("api_secret", e.target.value)}
                  placeholder="Votre secret API"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={testConnection}
                disabled={testing || !formData.api_endpoint || !formData.api_key}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {testing ? "Test en cours..." : "Tester la connexion"}
              </Button>
            </CardContent>
          </Card>

          {/* Paramètres commerciaux */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres commerciaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="commission_rate">Taux de commission (%)</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.commission_rate}
                  onChange={(e) => handleInputChange("commission_rate", Number.parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="min_order_amount">Montant minimum de commande</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.min_order_amount}
                  onChange={(e) => handleInputChange("min_order_amount", Number.parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="processing_time_days">Temps de traitement (jours)</Label>
                <Input
                  id="processing_time_days"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.processing_time_days}
                  onChange={(e) => handleInputChange("processing_time_days", Number.parseInt(e.target.value) || 3)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Synchronisation */}
          <Card>
            <CardHeader>
              <CardTitle>Synchronisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto_sync">Synchronisation automatique</Label>
                <Switch
                  id="auto_sync"
                  checked={formData.auto_sync}
                  onCheckedChange={(checked) => handleInputChange("auto_sync", checked)}
                />
              </div>

              <div>
                <Label htmlFor="sync_frequency">Fréquence de sync (secondes)</Label>
                <Select
                  value={formData.sync_frequency.toString()}
                  onValueChange={(value) => handleInputChange("sync_frequency", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1800">30 minutes</SelectItem>
                    <SelectItem value="3600">1 heure</SelectItem>
                    <SelectItem value="7200">2 heures</SelectItem>
                    <SelectItem value="21600">6 heures</SelectItem>
                    <SelectItem value="43200">12 heures</SelectItem>
                    <SelectItem value="86400">24 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact_person">Personne de contact</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_info.contact_person}
                  onChange={(e) => handleInputChange("contact_info.contact_person", e.target.value)}
                  placeholder="Nom du contact"
                />
              </div>

              <div>
                <Label htmlFor="contact_email">Email de contact</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_info.email}
                  onChange={(e) => handleInputChange("contact_info.email", e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Téléphone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_info.phone}
                  onChange={(e) => handleInputChange("contact_info.phone", e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/fournisseurs">Annuler</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
