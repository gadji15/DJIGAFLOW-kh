-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des fournisseurs
CREATE TABLE suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'aliexpress', 'jumia', 'amazon', etc.
  api_endpoint TEXT,
  api_key TEXT,
  api_secret TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00, -- Commission du fournisseur
  status VARCHAR(20) DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency INTEGER DEFAULT 3600, -- en secondes
  settings JSONB DEFAULT '{}'::jsonb
);

-- Table des produits fournisseurs (produits originaux)
CREATE TABLE supplier_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL, -- ID du produit chez le fournisseur
  name TEXT NOT NULL,
  description TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  images TEXT[] DEFAULT '{}',
  category VARCHAR(255),
  subcategory VARCHAR(255),
  brand VARCHAR(255),
  specifications JSONB DEFAULT '{}'::jsonb,
  variants JSONB DEFAULT '{}'::jsonb,
  stock_quantity INTEGER DEFAULT 0,
  shipping_info JSONB DEFAULT '{}'::jsonb,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(supplier_id, external_id)
);

-- Mise à jour de la table products pour le dropshipping
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_product_id UUID REFERENCES supplier_products(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS markup_percentage DECIMAL(5,2) DEFAULT 50.00;
ALTER TABLE products ADD COLUMN IF NOT EXISTS auto_sync BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(10,2) DEFAULT 0.00;

-- Table des commandes fournisseurs
CREATE TABLE supplier_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  external_order_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  supplier_amount DECIMAL(10,2) NOT NULL,
  our_profit DECIMAL(10,2) NOT NULL,
  tracking_number VARCHAR(255),
  shipping_status VARCHAR(50) DEFAULT 'pending',
  estimated_delivery DATE,
  actual_delivery DATE,
  notes TEXT
);

-- Table des synchronisations
CREATE TABLE sync_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplier_id UUID REFERENCES suppliers(id),
  sync_type VARCHAR(50) NOT NULL, -- 'products', 'prices', 'stock', 'orders'
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'partial'
  products_synced INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  duration_ms INTEGER,
  error_details JSONB DEFAULT '{}'::jsonb,
  summary JSONB DEFAULT '{}'::jsonb
);

-- Table des règles de pricing automatique
CREATE TABLE pricing_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  category VARCHAR(255),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  markup_type VARCHAR(20) DEFAULT 'percentage', -- 'percentage', 'fixed'
  markup_value DECIMAL(10,2) NOT NULL,
  min_profit DECIMAL(10,2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1
);

-- Index pour les performances
CREATE INDEX idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_external_id ON supplier_products(external_id);
CREATE INDEX idx_supplier_products_status ON supplier_products(status);
CREATE INDEX idx_products_supplier_product_id ON products(supplier_product_id);
CREATE INDEX idx_sync_logs_supplier_id ON sync_logs(supplier_id);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);

-- Fonctions pour automatiser les calculs
CREATE OR REPLACE FUNCTION calculate_selling_price(
  original_price DECIMAL(10,2),
  markup_percentage DECIMAL(5,2)
) RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN ROUND(original_price * (1 + markup_percentage / 100), 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement les prix
CREATE OR REPLACE FUNCTION update_product_pricing()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le nouveau prix de vente
  NEW.price = calculate_selling_price(
    (SELECT original_price FROM supplier_products WHERE id = NEW.supplier_product_id),
    NEW.markup_percentage
  );
  
  -- Calculer la marge bénéficiaire
  NEW.profit_margin = NEW.price - (SELECT original_price FROM supplier_products WHERE id = NEW.supplier_product_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_pricing
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  WHEN (NEW.supplier_product_id IS NOT NULL)
  EXECUTE FUNCTION update_product_pricing();
