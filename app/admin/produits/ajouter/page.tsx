"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { createProduct, type ProductData } from "@/lib/product-sync"
import { ArrowLeft, Upload, X, Plus, Save, Eye } from "lucide-react"
import Link from "next/link"

/**
 * INTERFACE POUR LES CATÉGORIES
 */
interface Category {
  id: string
  name: string
  slug: string
}

/**
 * DONNÉES MOCKÉES DES CATÉGORIES
 * En production, ces données viendraient de la base de données
 */
const categories: Category[] = [
  { id: "1", name: "Électronique", slug: "electronique" },
  { id: "2", name: "Mode", slug: "mode" },
  { id: "3", name: "Maison & Jardin", slug: "maison" },
  { id: "4", name: "Sport & Loisirs", slug: "sport" },
  { id: "5", name: "Beauté & Santé", slug: "beaute" },
]

/**
 * PAGE D'AJOUT DE PRODUIT
 *
 * Cette page permet aux administrateurs d'ajouter de nouveaux produits
 * qui seront automatiquement synchronisés sur tout le site.
 *
 * Fonctionnalités :
 * - Formulaire complet de création de produit
 * - Upload d'images multiples
 * - Gestion des variantes et spécifications
 * - Prévisualisation en temps réel
 * - Synchronisation automatique après création
 */
export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [variants, setVariants] = useState<Record<string, any>>({})
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  /**
   * ÉTAT DU FORMULAIRE PRINCIPAL
   */
  const [formData, setFormData] = useState<Partial<ProductData>>({
    name: "",
    description: "",
    price: 0,
    sale_price: null,
    stock: 0,
    category_id: "",
    images: [],
    featured: false,
    rating: 0,
    reviews_count: 0,
    specifications: {},
    variants: {},
    tags: [],
    meta_title: "",
    meta_description: "",
  })

  /**
   * GESTION DES CHANGEMENTS DE FORMULAIRE
   */
  const handleInputChange = (field: keyof ProductData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /**
   * GESTION DE L'UPLOAD D'IMAGES
   * Simulation - en production, utiliser un service de stockage
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // Simulation de l'upload
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setImages((prev) => [...prev, imageUrl])
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  /**
   * SUPPRESSION D'UNE IMAGE
   */
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  /**
   * AJOUT D'UNE SPÉCIFICATION
   */
  const addSpecification = (key: string, value: string) => {
    if (!key.trim() || !value.trim()) return

    const newSpecs = { ...specifications, [key]: value }
    setSpecifications(newSpecs)
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }))
  }

  /**
   * SUPPRESSION D'UNE SPÉCIFICATION
   */
  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications }
    delete newSpecs[key]
    setSpecifications(newSpecs)
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }))
  }

  /**
   * AJOUT D'UN TAG
   */
  const addTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return

    const newTags = [...tags, newTag.trim()]
    setTags(newTags)
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
    setNewTag("")
  }

  /**
   * SUPPRESSION D'UN TAG
   */
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(newTags)
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  /**
   * VALIDATION DU FORMULAIRE
   */
  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!formData.name?.trim()) {
      errors.push("Le nom du produit est requis")
    }

    if (!formData.description?.trim()) {
      errors.push("La description du produit est requise")
    }

    if (!formData.price || formData.price <= 0) {
      errors.push("Le prix doit être supérieur à 0")
    }

    if (!formData.category_id) {
      errors.push("Une catégorie doit être sélectionnée")
    }

    if (!formData.images || formData.images.length === 0) {
      errors.push("Au moins une image est requise")
    }

    if (formData.stock === undefined || formData.stock < 0) {
      errors.push("Le stock ne peut pas être négatif")
    }

    return errors
  }

  /**
   * SOUMISSION DU FORMULAIRE
   * Crée le produit et déclenche la synchronisation automatique
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Validation
    const errors = validateForm()
    if (errors.length > 0) {
      toast({
        title: "Erreurs de validation",
        description: errors.join(", "),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("🚀 Création du produit avec synchronisation automatique...")

      // Créer le produit avec synchronisation automatique
      const result = await createProduct(formData as ProductData)

      if (result.success) {
        toast({
          title: "Produit créé avec succès !",
          description: "Le produit est maintenant visible sur tout le site.",
        })

        // Rediriger vers la liste des produits
        router.push("/admin/produits")
      } else {
        throw new Error(result.error || "Erreur lors de la création")
      }
    } catch (error) {
      console.error("❌ Erreur lors de la création du produit:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * PRÉVISUALISATION DU PRODUIT
   */
  const handlePreview = () => {
    // Ouvrir une nouvelle fenêtre avec la prévisualisation
    const previewData = encodeURIComponent(JSON.stringify(formData))
    window.open(`/admin/produits/preview?data=${previewData}`, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/produits">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Ajouter un produit</h1>
            <p className="text-muted-foreground">
              Créez un nouveau produit qui sera automatiquement synchronisé sur tout le site
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreview} disabled={!formData.name}>
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Création..." : "Créer le produit"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="specifications">Spécifications</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Onglet Informations générales */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations de base */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du produit *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: iPhone 15 Pro Max"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Description détaillée du produit..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={formData.category_id || ""}
                      onValueChange={(value) => handleInputChange("category_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Prix et stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Prix et stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Prix (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || ""}
                      onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sale_price">Prix de promotion (€)</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.sale_price || ""}
                      onChange={(e) => handleInputChange("sale_price", Number.parseFloat(e.target.value) || null)}
                      placeholder="Prix réduit (optionnel)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock || ""}
                      onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                      placeholder="Quantité en stock"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) => handleInputChange("featured", checked)}
                    />
                    <Label htmlFor="featured">Produit en vedette</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter un tag..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Images */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Images du produit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Zone d'upload */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez-déposez vos images ici ou cliquez pour sélectionner
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Sélectionner des images
                      </Button>
                    </Label>
                  </div>

                  {/* Aperçu des images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Produit ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index === 0 && <Badge className="absolute bottom-2 left-2">Image principale</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Spécifications */}
          <TabsContent value="specifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Formulaire d'ajout de spécification */}
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Nom de la spécification" id="spec-key" />
                    <div className="flex space-x-2">
                      <Input placeholder="Valeur" id="spec-value" />
                      <Button
                        type="button"
                        onClick={() => {
                          const keyInput = document.getElementById("spec-key") as HTMLInputElement
                          const valueInput = document.getElementById("spec-value") as HTMLInputElement
                          if (keyInput && valueInput) {
                            addSpecification(keyInput.value, valueInput.value)
                            keyInput.value = ""
                            valueInput.value = ""
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Liste des spécifications */}
                  <div className="space-y-2">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{key}:</span>
                          <span className="ml-2 text-muted-foreground">{value}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(key)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet SEO */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimisation SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Titre SEO</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title || ""}
                    onChange={(e) => handleInputChange("meta_title", e.target.value)}
                    placeholder="Titre optimisé pour les moteurs de recherche"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{(formData.meta_title || "").length}/60 caractères</p>
                </div>

                <div>
                  <Label htmlFor="meta_description">Description SEO</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description || ""}
                    onChange={(e) => handleInputChange("meta_description", e.target.value)}
                    placeholder="Description optimisée pour les moteurs de recherche"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.meta_description || "").length}/160 caractères
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
