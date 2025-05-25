-- Tables pour le système de parrainage
CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('registration', 'purchase', 'share')),
  reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('discount', 'credit', 'points', 'exclusive_access')),
  reward_value DECIMAL(10,2) NOT NULL,
  reward_currency VARCHAR(3) DEFAULT 'EUR',
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_rewards_per_user INTEGER DEFAULT NULL,
  max_total_rewards INTEGER DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  terms_and_conditions TEXT,
  fraud_detection_rules JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  program_id UUID REFERENCES referral_programs(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  total_referrals INTEGER DEFAULT 0,
  total_rewards_earned DECIMAL(10,2) DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_code VARCHAR(20) NOT NULL,
  program_id UUID REFERENCES referral_programs(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('registration', 'purchase', 'share')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'fraud')),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  purchase_amount DECIMAL(10,2) DEFAULT 0,
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_type VARCHAR(50),
  reward_status VARCHAR(50) DEFAULT 'pending' CHECK (reward_status IN ('pending', 'approved', 'paid', 'cancelled')),
  ip_address INET,
  user_agent TEXT,
  referral_source VARCHAR(100),
  conversion_data JSONB DEFAULT '{}',
  fraud_score DECIMAL(3,2) DEFAULT 0,
  fraud_flags JSONB DEFAULT '[]',
  processed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES referral_programs(id) ON DELETE SET NULL,
  reward_type VARCHAR(50) NOT NULL,
  reward_value DECIMAL(10,2) NOT NULL,
  reward_currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'redeemed', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  coupon_code VARCHAR(50),
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS share_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  share_code VARCHAR(20) UNIQUE NOT NULL,
  share_type VARCHAR(50) NOT NULL CHECK (share_type IN ('social', 'email', 'direct')),
  platform VARCHAR(50),
  content_type VARCHAR(50) CHECK (content_type IN ('product', 'category', 'homepage', 'promotion')),
  content_id VARCHAR(255),
  clicks_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP WITH TIME ZONE,
  ip_addresses JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_user_id ON user_referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_code ON user_referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);
CREATE INDEX IF NOT EXISTS idx_share_tracking_user_id ON share_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_share_tracking_code ON share_tracking(share_code);

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
  exists_check INTEGER;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT COUNT(*) INTO exists_check FROM user_referral_codes WHERE referral_code = code;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
  exists_check INTEGER;
BEGIN
  LOOP
    code := 'SH' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    SELECT COUNT(*) INTO exists_check FROM share_tracking WHERE share_code = code;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE user_referral_codes 
    SET 
      total_referrals = (
        SELECT COUNT(*) FROM referrals 
        WHERE referral_code = NEW.referral_code AND status = 'completed'
      ),
      total_rewards_earned = (
        SELECT COALESCE(SUM(reward_amount), 0) FROM referrals 
        WHERE referral_code = NEW.referral_code AND reward_status = 'approved'
      ),
      last_used_at = CASE WHEN NEW.status = 'completed' THEN NOW() ELSE last_used_at END,
      updated_at = NOW()
    WHERE referral_code = NEW.referral_code;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_referral_stats
  AFTER INSERT OR UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_referral_stats();

-- Insérer un programme de parrainage par défaut
INSERT INTO referral_programs (name, description, type, reward_type, reward_value, terms_and_conditions) VALUES
('Programme de Parrainage Standard', 'Gagnez 10€ de crédit pour chaque ami parrainé qui effectue un achat', 'purchase', 'credit', 10.00, 'Le parrain recevra 10€ de crédit boutique lorsque le filleul effectuera sa première commande d''un montant minimum de 50€.'),
('Bonus d''Inscription', 'Recevez 5€ de crédit pour chaque inscription via votre lien', 'registration', 'credit', 5.00, 'Le parrain recevra 5€ de crédit boutique pour chaque nouvelle inscription validée via son lien de parrainage.'),
('Récompense de Partage', 'Gagnez des points pour chaque partage sur les réseaux sociaux', 'share', 'points', 100, 'Recevez 100 points pour chaque partage effectué sur les réseaux sociaux. 1000 points = 10€ de crédit.');
