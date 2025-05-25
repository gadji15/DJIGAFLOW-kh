"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "",
    status: true,
    meta_title: "",
    meta_description: "",
    image: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/admin/categories")
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouvelle catégorie</h1>
          <p className="text-gray-600 dark:text-gray-400">Créer une nouvelle catégorie de produits</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la catégorie *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Électronique"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="electronique"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL: /categories/{formData.slug || "slug-de-la-categorie"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de la catégorie..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Catégorie parente</Label>
                  <select
                    id="parent"
                    value={formData.parent_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                    className="w-full border rounded px-3 py-2 bg-background"
                  >
                    <option value="">Aucune (catégorie principale)</option>
                    <option value="1">Électronique</option>
                    <option value="3">Mode</option>
                    <option value="4">Maison & Jardin</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>Optimisation SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Titre SEO</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Titre pour les moteurs de recherche"
                  />
                  <p className="text-sm text-muted-foreground">{formData.meta_title.length}/60 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Description SEO</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Description pour les moteurs de recherche"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">{formData.meta_description.length}/160 caractères</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Catégorie active</Label>
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, status: checked }))}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Les catégories inactives ne sont pas visibles sur le site
                </p>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Image de la catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez une image ici ou cliquez pour sélectionner
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      Choisir un fichier
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Formats acceptés: JPG, PNG, WebP. Taille max: 2MB</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>Création en cours...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Créer la catégorie
                      </>
                    )}
                  </Button>
                  <Button asChild type="button" variant="outline" className="w-full">
                    <Link href="/admin/categories">
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
