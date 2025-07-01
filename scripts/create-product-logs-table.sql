-- CRÉATION DE LA TABLE DE LOGS POUR LES PRODUITS
-- Cette table permet de tracer toutes les modifications des produits

CREATE TABLE IF NOT EXISTS product_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(10) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
  product_id UUID NOT NULL,
  data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_product_logs_product_id ON product_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_logs_timestamp ON product_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_product_logs_action ON product_logs(action);

-- Commentaires pour la documentation
COMMENT ON TABLE product_logs IS 'Table de logs pour tracer toutes les modifications des produits';
COMMENT ON COLUMN product_logs.action IS 'Type d''action: CREATE, UPDATE, ou DELETE';
COMMENT ON COLUMN product_logs.product_id IS 'ID du produit concerné par l''action';
COMMENT ON COLUMN product_logs.data IS 'Données JSON de l''action (nouveau produit, modifications, etc.)';
COMMENT ON COLUMN product_logs.user_id IS 'ID de l''utilisateur qui a effectué l''action';
