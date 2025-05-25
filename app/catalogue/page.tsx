import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"

// Données statiques pour la démo
const products = [
  { id: 1, name: "Smartphone XYZ", price: 499.99, salePrice: 449.99, rating: 4.5, reviewsCount: 120 },
  { id: 2, name: "Montre connectée", price: 129.99, salePrice: null, rating: 4.2, reviewsCount: 85 },
  { id: 3, name: "Écouteurs sans fil", price: 79.99, salePrice: 59.99, rating: 4.0, reviewsCount: 64 },
  { id: 4, name: "Tablette 10 pouces", price: 299.99, salePrice: null, rating: 4.3, reviewsCount: 42 },
  { id: 5, name: "Enceinte Bluetooth", price: 59.99, salePrice: 49.99, rating: 4.1, reviewsCount: 38 },
  { id: 6, name: "Batterie externe", price: 29.99, salePrice: null, rating: 4.4, reviewsCount: 56 },
]

export default function CataloguePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">DjigaFlow</div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Accueil
            </Link>
            <Link href="/catalogue" className="text-sm font-medium">
              Catalogue
            </Link>
            <Link href="/nouveautes" className="text-sm font-medium">
              Nouveautés
            </Link>
            <Link href="/promotions" className="text-sm font-medium">
              Promotions
            </Link>
          </nav>
          <div>
            <Button>Connexion</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Catalogue</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                rating={product.rating}
                reviewsCount={product.reviewsCount}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">DjigaFlow</h3>
              <p className="text-gray-600">Votre boutique en ligne pour des produits tendance</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Liens rapides</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/catalogue" className="text-gray-600 hover:text-blue-600">
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/nouveautes" className="text-gray-600 hover:text-blue-600">
                    Nouveautés
                  </Link>
                </li>
                <li>
                  <Link href="/promotions" className="text-gray-600 hover:text-blue-600">
                    Promotions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t text-center text-gray-600 text-sm">
            &copy; 2023 DjigaFlow. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
