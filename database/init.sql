-- Création des tables pour JammShop

-- Table des catégories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id)
);

-- Table des produits
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  variants JSONB,
  specifications JSONB
);

-- Table des utilisateurs (extension de la table auth.users de Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  addresses JSONB,
  phone TEXT
);

-- Table des commandes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_method TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT
);

-- Table des articles de commande
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  variant JSONB
);

-- Table des avis
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  approved BOOLEAN NOT NULL DEFAULT false
);

-- Création des index pour améliorer les performances
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Création des fonctions pour mettre à jour automatiquement la note moyenne des produits
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE product_id = NEW.product_id AND approved = true
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id AND approved = true
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création des triggers
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Création des politiques de sécurité Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Les administrateurs peuvent voir tous les utilisateurs"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour les commandes
CREATE POLICY "Les utilisateurs peuvent voir leurs propres commandes"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Les administrateurs peuvent voir toutes les commandes"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour les avis
CREATE POLICY "Tout le monde peut voir les avis approuvés"
ON reviews FOR SELECT
USING (approved = true);

CREATE POLICY "Les utilisateurs peuvent voir leurs propres avis"
ON reviews FOR SELECT
USING (auth.uid() = user_id);

-- Insertion de données de test
INSERT INTO categories (name, description, image) VALUES
('Électronique', 'Produits électroniques et gadgets', '/placeholder.svg?height=100&width=100'),
('Mode', 'Vêtements et accessoires', '/placeholder.svg?height=100&width=100'),
('Maison', 'Décoration et articles pour la maison', '/placeholder.svg?height=100&width=100'),
('Sport', 'Équipement sportif et accessoires', '/placeholder.svg?height=100&width=100');

-- Insertion de produits de test
INSERT INTO products (name, description, price, sale_price, stock, category_id, images, featured, rating, reviews_count, specifications) VALUES
('Smartphone XYZ', 'Un smartphone puissant avec un excellent appareil photo', 499.99, 449.99, 50, (SELECT id FROM categories WHERE name = 'Électronique'), ARRAY['/placeholder.svg?height=300&width=300', '/placeholder.svg?height=300&width=300'], true, 4.5, 120, '{"écran": "6.5 pouces", "processeur": "Octa-core", "mémoire": "128 Go", "batterie": "4500 mAh"}'),
('Montre connectée', 'Suivez votre activité physique et recevez des notifications', 129.99, NULL, 30, (SELECT id FROM categories WHERE name = 'Électronique'), ARRAY['/placeholder.svg?height=300&width=300'], true, 4.2, 85, '{"écran": "1.4 pouces", "autonomie": "7 jours", "étanchéité": "IP68", "connectivité": "Bluetooth 5.0"}'),
('T-shirt premium', 'T-shirt en coton de haute qualité', 29.99, 19.99, 100, (SELECT id FROM categories WHERE name = 'Mode'), ARRAY['/placeholder.svg?height=300&width=300'], false, 4.0, 45, '{"matière": "100% coton", "tailles": "S, M, L, XL", "couleurs": "Noir, Blanc, Bleu"}'),
('Lampe de bureau LED', 'Lampe de bureau ajustable avec éclairage LED', 49.99, 39.99, 25, (SELECT id FROM categories WHERE name = 'Maison'), ARRAY['/placeholder.svg?height=300&width=300'], true, 4.7, 60, '{"puissance": "10W", "température": "3000K-6000K", "ajustable": "Oui", "minuterie": "Oui"}'),
('Ballon de football', 'Ballon de football professionnel', 24.99, NULL, 40, (SELECT id FROM categories WHERE name = 'Sport'), ARRAY['/placeholder.svg?height=300&width=300'], false, 4.3, 30, '{"taille": "5", "matière": "Cuir synthétique", "coutures": "Thermocollées"}');
