-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs (étend auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'supplier')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}'::jsonb,
  shipping_addresses JSONB DEFAULT '[]'::jsonb
);

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  seo_keywords TEXT[]
);

-- Table des fournisseurs
CREATE TABLE suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('aliexpress', 'jumia', 'amazon', 'dhgate', 'alibaba', 'other')),
  website_url TEXT,
  api_endpoint TEXT,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  refresh_token TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency INTEGER DEFAULT 3600, -- en secondes
  auto_sync BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  shipping_zones TEXT[] DEFAULT '{}',
  currency VARCHAR(3) DEFAULT 'EUR',
  min_order_amount DECIMAL(10,2) DEFAULT 0.00,
  processing_time_days INTEGER DEFAULT 3
);

-- Table des produits fournisseurs
CREATE TABLE supplier_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  external_id VARCHAR(255) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  images TEXT[] DEFAULT '{}',
  category VARCHAR(255),
  subcategory VARCHAR(255),
  brand VARCHAR(255),
  model VARCHAR(255),
  sku VARCHAR(255),
  barcode VARCHAR(255),
  specifications JSONB DEFAULT '{}'::jsonb,
  variants JSONB DEFAULT '{}'::jsonb,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  shipping_info JSONB DEFAULT '{}'::jsonb,
  dimensions JSONB DEFAULT '{}'::jsonb,
  weight DECIMAL(8,3),
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  is_featured BOOLEAN DEFAULT false,
  last_stock_check TIMESTAMP WITH TIME ZONE,
  UNIQUE(supplier_id, external_id)
);

-- Table des produits (notre catalogue)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplier_product_id UUID REFERENCES supplier_products(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  markup_percentage DECIMAL(5,2) DEFAULT 50.00,
  profit_margin DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'EUR',
  images TEXT[] DEFAULT '{}',
  brand VARCHAR(255),
  model VARCHAR(255),
  sku VARCHAR(255) UNIQUE,
  barcode VARCHAR(255),
  specifications JSONB DEFAULT '{}'::jsonb,
  variants JSONB DEFAULT '{}'::jsonb,
  stock INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  max_stock_level INTEGER DEFAULT 1000,
  weight DECIMAL(8,3),
  dimensions JSONB DEFAULT '{}'::jsonb,
  shipping_class VARCHAR(50) DEFAULT 'standard',
  tax_class VARCHAR(50) DEFAULT 'standard',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock')),
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'hidden')),
  featured BOOLEAN DEFAULT false,
  auto_sync BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  meta_title VARCHAR(255),
  meta_description TEXT,
  seo_keywords TEXT[],
  last_sync TIMESTAMP WITH TIME ZONE
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'error')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial')),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'EUR',
  billing_address JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  customer_notes TEXT,
  admin_notes TEXT,
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  estimated_delivery DATE,
  coupon_code VARCHAR(50),
  referral_source VARCHAR(100),
  ip_address INET,
  user_agent TEXT
);

-- Table des articles de commande
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL NOT NULL,
  supplier_product_id UUID REFERENCES supplier_products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sku VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  quantity INTEGER NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL,
  profit DECIMAL(10,2) DEFAULT 0.00,
  variant JSONB DEFAULT '{}'::jsonb,
  product_snapshot JSONB DEFAULT '{}'::jsonb
);

-- Table des commandes fournisseurs
CREATE TABLE supplier_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  external_order_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'error')),
  total_amount DECIMAL(10,2) NOT NULL,
  supplier_amount DECIMAL(10,2) NOT NULL,
  our_profit DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  tracking_number VARCHAR(255),
  shipping_status VARCHAR(50) DEFAULT 'pending',
  estimated_delivery DATE,
  actual_delivery DATE,
  shipping_cost DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  last_retry TIMESTAMP WITH TIME ZONE
);

-- Table des articles de commande fournisseur
CREATE TABLE supplier_order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_order_id UUID REFERENCES supplier_orders(id) ON DELETE CASCADE NOT NULL,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE NOT NULL,
  supplier_product_id UUID REFERENCES supplier_products(id) NOT NULL,
  external_product_id VARCHAR(255) NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  variant JSONB DEFAULT '{}'::jsonb
);

-- Table des règles de pricing
CREATE TABLE pricing_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  brand VARCHAR(255),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  markup_type VARCHAR(20) DEFAULT 'percentage' CHECK (markup_type IN ('percentage', 'fixed', 'formula')),
  markup_value DECIMAL(10,2) NOT NULL,
  min_profit DECIMAL(10,2) DEFAULT 5.00,
  max_profit DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  conditions JSONB DEFAULT '{}'::jsonb,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE
);

-- Table des logs de synchronisation
CREATE TABLE sync_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL CHECK (sync_type IN ('products', 'prices', 'stock', 'orders', 'full')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'success', 'error', 'partial', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  products_processed INTEGER DEFAULT 0,
  products_imported INTEGER DEFAULT 0,
  products_updated INTEGER DEFAULT 0,
  products_failed INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  duration_ms INTEGER,
  error_details JSONB DEFAULT '{}'::jsonb,
  summary JSONB DEFAULT '{}'::jsonb,
  triggered_by VARCHAR(50) DEFAULT 'manual' CHECK (triggered_by IN ('manual', 'cron', 'webhook', 'api'))
);

-- Table des paramètres système
CREATE TABLE system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false
);

-- Table des coupons
CREATE TABLE coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0.00,
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  user_limit INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  applicable_products UUID[] DEFAULT '{}',
  applicable_categories UUID[] DEFAULT '{}',
  excluded_products UUID[] DEFAULT '{}',
  excluded_categories UUID[] DEFAULT '{}'
);

-- Table des avis produits
CREATE TABLE product_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  pros TEXT,
  cons TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  response TEXT,
  response_date TIMESTAMP WITH TIME ZONE
);

-- Index pour les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_suppliers_type ON suppliers(type);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_external_id ON supplier_products(external_id);
CREATE INDEX idx_supplier_products_status ON supplier_products(status);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_supplier_product_id ON products(supplier_product_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_supplier_orders_order_id ON supplier_orders(order_id);
CREATE INDEX idx_supplier_orders_supplier_id ON supplier_orders(supplier_id);
CREATE INDEX idx_sync_logs_supplier_id ON sync_logs(supplier_id);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'DJG-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_selling_price(
  original_price DECIMAL(10,2),
  markup_percentage DECIMAL(5,2)
) RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN ROUND(original_price * (1 + markup_percentage / 100), 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_product_rating(product_uuid UUID)
RETURNS VOID AS $
DECLARE
  avg_rating DECIMAL(3,2);
  review_count INTEGER;
BEGIN
  SELECT 
    ROUND(AVG(rating), 2),
    COUNT(*)
  INTO avg_rating, review_count
  FROM product_reviews 
  WHERE product_id = product_uuid AND is_approved = true;
  
  UPDATE products 
  SET 
    rating = COALESCE(avg_rating, 0),
    reviews_count = review_count,
    updated_at = NOW()
  WHERE id = product_uuid;
END;
$ LANGUAGE plpgsql;

-- Wrapper trigger function that delegates to update_product_rating()
CREATE OR REPLACE FUNCTION update_product_rating_trigger()
RETURNS TRIGGER AS $
BEGIN
  -- Call the helper to recalculate rating for the affected product
  PERFORM update_product_rating(COALESCE(NEW.product_id, OLD.product_id));
  -- Pass the row along (for AFTER triggers we can return either NEW or OLD)
  RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_products_updated_at BEFORE UPDATE ON supplier_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour calculer automatiquement les prix
CREATE OR REPLACE FUNCTION auto_calculate_product_pricing()
RETURNS TRIGGER AS $$
DECLARE
  supplier_price DECIMAL(10,2);
BEGIN
  -- Récupérer le prix du fournisseur
  IF NEW.supplier_product_id IS NOT NULL THEN
    SELECT original_price INTO supplier_price
    FROM supplier_products 
    WHERE id = NEW.supplier_product_id;
    
    IF supplier_price IS NOT NULL THEN
      -- Calculer le prix de vente avec la marge
      NEW.price = calculate_selling_price(supplier_price, NEW.markup_percentage);
      NEW.cost_price = supplier_price;
      NEW.profit_margin = NEW.price - supplier_price;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_calculate_product_pricing
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  WHEN (NEW.supplier_product_id IS NOT NULL)
  EXECUTE FUNCTION auto_calculate_product_pricing();

-- Trigger pour générer automatiquement le numéro de commande
CREATE OR REPLACE FUNCTION auto_generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_order_number();

-- Trigger pour mettre à jour les notes des produits
CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating_trigger();

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can view own reviews" ON product_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Insérer des paramètres système par défaut
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('site_name', '"DjigaFlow"', 'Nom du site', 'general', true),
('site_description', '"Plateforme de dropshipping automatisée"', 'Description du site', 'general', true),
('default_currency', '"EUR"', 'Devise par défaut', 'general', true),
('default_markup_percentage', '50', 'Marge par défaut en pourcentage', 'pricing', false),
('auto_sync_enabled', 'true', 'Synchronisation automatique activée', 'sync', false),
('sync_frequency_hours', '6', 'Fréquence de synchronisation en heures', 'sync', false),
('order_auto_processing', 'true', 'Traitement automatique des commandes', 'orders', false),
('email_notifications', 'true', 'Notifications par email activées', 'notifications', false),
('maintenance_mode', 'false', 'Mode maintenance', 'general', false);

-- Insérer des catégories par défaut
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Électronique', 'electronique', 'Appareils électroniques et gadgets', 1),
('Mode', 'mode', 'Vêtements et accessoires', 2),
('Maison & Jardin', 'maison-jardin', 'Articles pour la maison et le jardin', 3),
('Sport & Loisirs', 'sport-loisirs', 'Équipements sportifs et loisirs', 4),
('Beauté & Santé', 'beaute-sante', 'Produits de beauté et de santé', 5),
('Automobile', 'automobile', 'Accessoires et pièces automobiles', 6),
('Jouets & Enfants', 'jouets-enfants', 'Jouets et articles pour enfants', 7),
('Livres & Médias', 'livres-medias', 'Livres, films et médias', 8);
