import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplierId = params.id

    // Vérifier que le fournisseur existe
    const { data: supplier, error: supplierError } = await supabaseAdmin
      .from("suppliers")
      .select("*")
      .eq("id", supplierId)
      .single()

    if (supplierError || !supplier) {
      return NextResponse.json({ success: false, error: "Fournisseur non trouvé" }, { status: 404 })
    }

    // Créer un log de synchronisation
    const { data: syncLog, error: logError } = await supabaseAdmin
      .from("sync_logs")
      .insert({
        supplier_id: supplierId,
        sync_type: "products",
        status: "running",
        triggered_by: "manual",
      })
      .select()
      .single()

    if (logError) {
      console.error("Error creating sync log:", logError)
      return NextResponse.json({ success: false, error: "Erreur lors de la création du log" }, { status: 500 })
    }

    // Démarrer la synchronisation en arrière-plan
    syncSupplierProducts(supplierId, syncLog.id)

    return NextResponse.json({
      success: true,
      message: "Synchronisation démarrée",
      syncId: syncLog.id,
    })
  } catch (error: any) {
    console.error("Error starting sync:", error)
    return NextResponse.json({ success: false, error: error.message || "Erreur interne" }, { status: 500 })
  }
}

async function syncSupplierProducts(supplierId: string, syncLogId: string) {
  const startTime = Date.now()
  let productsImported = 0
  let productsUpdated = 0
  let productsFailed = 0
  const errors: string[] = []

  try {
    // Récupérer les informations du fournisseur
    const { data: supplier } = await supabaseAdmin.from("suppliers").select("*").eq("id", supplierId).single()

    if (!supplier) {
      throw new Error("Fournisseur non trouvé")
    }

    // Simuler la récupération de produits (remplacer par vraie API)
    const mockProducts = await getMockProducts(supplier.type)

    for (const product of mockProducts) {
      try {
        // Vérifier si le produit existe déjà
        const { data: existingProduct } = await supabaseAdmin
          .from("supplier_products")
          .select("id")
          .eq("supplier_id", supplierId)
          .eq("external_id", product.external_id)
          .single()

        if (existingProduct) {
          // Mettre à jour le produit existant
          await supabaseAdmin
            .from("supplier_products")
            .update({
              name: product.name,
              description: product.description,
              original_price: product.original_price,
              sale_price: product.sale_price,
              images: product.images,
              stock_quantity: product.stock_quantity,
              rating: product.rating,
              reviews_count: product.reviews_count,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingProduct.id)

          productsUpdated++
        } else {
          // Créer un nouveau produit
          const { data: newSupplierProduct } = await supabaseAdmin
            .from("supplier_products")
            .insert({
              supplier_id: supplierId,
              external_id: product.external_id,
              name: product.name,
              description: product.description,
              original_price: product.original_price,
              sale_price: product.sale_price,
              currency: supplier.currency,
              images: product.images,
              category: product.category,
              brand: product.brand,
              stock_quantity: product.stock_quantity,
              rating: product.rating,
              reviews_count: product.reviews_count,
              status: "active",
            })
            .select()
            .single()

          if (newSupplierProduct) {
            // Créer le produit dans notre catalogue
            await createCatalogProduct(newSupplierProduct, supplier)
            productsImported++
          }
        }
      } catch (error: any) {
        productsFailed++
        errors.push(`Erreur produit ${product.external_id}: ${error.message}`)
      }
    }

    // Mettre à jour le log de synchronisation
    await supabaseAdmin
      .from("sync_logs")
      .update({
        status: errors.length === 0 ? "success" : "partial",
        completed_at: new Date().toISOString(),
        products_processed: mockProducts.length,
        products_imported: productsImported,
        products_updated: productsUpdated,
        products_failed: productsFailed,
        errors_count: errors.length,
        duration_ms: Date.now() - startTime,
        error_details: { errors },
        summary: {
          imported: productsImported,
          updated: productsUpdated,
          failed: productsFailed,
          total: mockProducts.length,
        },
      })
      .eq("id", syncLogId)

    // Mettre à jour la date de dernière synchronisation du fournisseur
    await supabaseAdmin.from("suppliers").update({ last_sync: new Date().toISOString() }).eq("id", supplierId)
  } catch (error: any) {
    console.error("Sync error:", error)

    // Marquer la synchronisation comme échouée
    await supabaseAdmin
      .from("sync_logs")
      .update({
        status: "error",
        completed_at: new Date().toISOString(),
        errors_count: 1,
        duration_ms: Date.now() - startTime,
        error_details: { errors: [error.message] },
      })
      .eq("id", syncLogId)
  }
}

async function getMockProducts(supplierType: string) {
  // Données de test réalistes selon le type de fournisseur
  const baseProducts = [
    {
      external_id: `${supplierType}_001`,
      name: "Smartphone Android 12 Pro",
      description: 'Smartphone haut de gamme avec écran OLED 6.7", 256GB de stockage, triple caméra 108MP',
      original_price: 299.99,
      sale_price: 249.99,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "Électronique",
      brand: "TechBrand",
      stock_quantity: 150,
      rating: 4.5,
      reviews_count: 1250,
    },
    {
      external_id: `${supplierType}_002`,
      name: "Casque Bluetooth Sans Fil",
      description: "Casque audio premium avec réduction de bruit active, autonomie 30h",
      original_price: 89.99,
      sale_price: null,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "Audio",
      brand: "SoundTech",
      stock_quantity: 75,
      rating: 4.3,
      reviews_count: 890,
    },
    {
      external_id: `${supplierType}_003`,
      name: "Montre Connectée Sport",
      description: "Montre intelligente avec GPS, moniteur cardiaque, étanche 50m",
      original_price: 159.99,
      sale_price: 129.99,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "Wearables",
      brand: "FitWatch",
      stock_quantity: 200,
      rating: 4.7,
      reviews_count: 2100,
    },
  ]

  return baseProducts
}

async function createCatalogProduct(supplierProduct: any, supplier: any) {
  try {
    // Récupérer ou créer la catégorie
    let { data: category } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("name", supplierProduct.category)
      .single()

    if (!category) {
      const { data: newCategory } = await supabaseAdmin
        .from("categories")
        .insert({
          name: supplierProduct.category,
          slug: supplierProduct.category.toLowerCase().replace(/\s+/g, "-"),
          description: `Catégorie ${supplierProduct.category}`,
        })
        .select()
        .single()

      category = newCategory
    }

    // Calculer le prix de vente avec marge
    const markupPercentage = 50 // 50% de marge par défaut
    const sellingPrice = Math.round(supplierProduct.original_price * (1 + markupPercentage / 100) * 100) / 100

    // Créer le slug unique
    const baseSlug = supplierProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)

    let slug = baseSlug
    let counter = 1

    // Vérifier l'unicité du slug
    while (true) {
      const { data: existingProduct } = await supabaseAdmin.from("products").select("id").eq("slug", slug).single()

      if (!existingProduct) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Créer le produit dans notre catalogue
    await supabaseAdmin.from("products").insert({
      supplier_product_id: supplierProduct.id,
      category_id: category?.id,
      name: supplierProduct.name,
      slug: slug,
      description: supplierProduct.description,
      price: sellingPrice,
      sale_price: supplierProduct.sale_price
        ? Math.round(supplierProduct.sale_price * (1 + markupPercentage / 100) * 100) / 100
        : null,
      cost_price: supplierProduct.original_price,
      markup_percentage: markupPercentage,
      profit_margin: sellingPrice - supplierProduct.original_price,
      currency: supplier.currency,
      images: supplierProduct.images,
      brand: supplierProduct.brand,
      stock: supplierProduct.stock_quantity,
      rating: supplierProduct.rating,
      reviews_count: supplierProduct.reviews_count,
      status: "active",
      visibility: "public",
      auto_sync: true,
    })
  } catch (error) {
    console.error("Error creating catalog product:", error)
    throw error
  }
}
