-- =====================================================
-- DJIGAFLOW COMPLETE DATABASE SCHEMA
-- Professional E-commerce & Dropshipping Platform
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- =====================================================
-- CORE AUTHENTICATION & USER MANAGEMENT
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255) GENERATED ALWAYS AS (COALESCE(first_name || ' ' || last_name, email)) STORED,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'supplier', 'moderator')) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0 NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Constraints
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- User addresses
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing', 'both')) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    label VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    phone VARCHAR(20),
    instructions TEXT
);

-- User sessions tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    location JSONB,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- PRODUCT CATALOG MANAGEMENT
-- =====================================================

-- Categories with hierarchical structure
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 0 NOT NULL,
    path TEXT[] DEFAULT '{}' NOT NULL,
    image_url TEXT,
    icon VARCHAR(100),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    product_count INTEGER DEFAULT 0 NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Constraints
    CONSTRAINT categories_slug_format CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT categories_level_check CHECK (level >= 0 AND level <= 5)
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    product_count INTEGER DEFAULT 0 NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT
);

-- Suppliers for dropshipping
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('aliexpress', 'jumia', 'amazon', 'dhgate', 'alibaba', 'local', 'other')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')) NOT NULL,
    
    -- Contact Information
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    website_url TEXT,
    
    -- API Configuration
    api_endpoint TEXT,
    api_key TEXT,
    api_secret TEXT,
    access_token TEXT,
    refresh_token TEXT,
    
    -- Business Terms
    commission_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    processing_time_days INTEGER DEFAULT 3 CHECK (processing_time_days >= 0),
    
    -- Sync Configuration
    auto_sync BOOLEAN DEFAULT TRUE NOT NULL,
    sync_frequency_hours INTEGER DEFAULT 24 CHECK (sync_frequency_hours > 0),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    
    -- Geographic & Currency
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    shipping_zones TEXT[] DEFAULT '{}' NOT NULL,
    
    -- Additional Data
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Performance Metrics
    total_products INTEGER DEFAULT 0 NOT NULL,
    active_products INTEGER DEFAULT 0 NOT NULL,
    total_orders INTEGER DEFAULT 0 NOT NULL,
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    avg_processing_time DECIMAL(5,2),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5)
);

-- Supplier products (original products from suppliers)
CREATE TABLE IF NOT EXISTS supplier_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    
    -- Basic Information
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Pricing
    original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price IS NULL OR sale_price >= 0),
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    
    -- Media
    images TEXT[] DEFAULT '{}' NOT NULL,
    videos TEXT[] DEFAULT '{}' NOT NULL,
    
    -- Classification
    category VARCHAR(255),
    subcategory VARCHAR(255),
    brand VARCHAR(255),
    model VARCHAR(255),
    sku VARCHAR(255),
    barcode VARCHAR(255),
    tags TEXT[] DEFAULT '{}' NOT NULL,
    
    -- Specifications
    specifications JSONB DEFAULT '{}'::jsonb NOT NULL,
    variants JSONB DEFAULT '{}'::jsonb NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    min_order_quantity INTEGER DEFAULT 1 CHECK (min_order_quantity > 0),
    max_order_quantity INTEGER,
    
    -- Physical Properties
    weight DECIMAL(8,3) CHECK (weight IS NULL OR weight > 0),
    dimensions JSONB DEFAULT '{}'::jsonb,
    
    -- Shipping
    shipping_info JSONB DEFAULT '{}'::jsonb NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00 CHECK (shipping_cost >= 0),
    
    -- Quality Metrics
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Sync Information
    last_stock_check_at TIMESTAMP WITH TIME ZONE,
    last_price_update_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE(supplier_id, external_id),
    CHECK (sale_price IS NULL OR sale_price < original_price)
);

-- Products (our catalog)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Relationships
    supplier_product_id UUID REFERENCES supplier_products(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    
    -- Basic Information
    name TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Pricing & Profit
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price IS NULL OR sale_price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
    markup_percentage DECIMAL(5,2) DEFAULT 50.00 CHECK (markup_percentage >= 0),
    profit_margin DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    
    -- Media
    images TEXT[] DEFAULT '{}' NOT NULL,
    videos TEXT[] DEFAULT '{}' NOT NULL,
    
    -- Product Details
    sku VARCHAR(255) UNIQUE,
    barcode VARCHAR(255),
    model VARCHAR(255),
    
    -- Specifications & Variants
    specifications JSONB DEFAULT '{}'::jsonb NOT NULL,
    variants JSONB DEFAULT '{}'::jsonb NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Inventory Management
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    min_stock_level INTEGER DEFAULT 5 CHECK (min_stock_level >= 0),
    max_stock_level INTEGER DEFAULT 1000 CHECK (max_stock_level >= min_stock_level),
    track_inventory BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Physical Properties
    weight DECIMAL(8,3) CHECK (weight IS NULL OR weight > 0),
    dimensions JSONB DEFAULT '{}'::jsonb,
    
    -- Shipping & Tax
    shipping_class VARCHAR(50) DEFAULT 'standard',
    tax_class VARCHAR(50) DEFAULT 'standard',
    requires_shipping BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Status & Visibility
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock', 'discontinued')) NOT NULL,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'hidden', 'password_protected')) NOT NULL,
    password VARCHAR(255),
    
    -- Features
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_digital BOOLEAN DEFAULT FALSE NOT NULL,
    is_downloadable BOOLEAN DEFAULT FALSE NOT NULL,
    download_limit INTEGER CHECK (download_limit IS NULL OR download_limit > 0),
    download_expiry_days INTEGER CHECK (download_expiry_days IS NULL OR download_expiry_days > 0),
    
    -- Auto-sync for dropshipping
    auto_sync BOOLEAN DEFAULT TRUE NOT NULL,
    sync_price BOOLEAN DEFAULT TRUE NOT NULL,
    sync_stock BOOLEAN DEFAULT TRUE NOT NULL,
    sync_description BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Quality & Performance Metrics
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    total_sales INTEGER DEFAULT 0 CHECK (total_sales >= 0),
    views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    canonical_url TEXT,
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    
    -- Tags
    tags TEXT[] DEFAULT '{}' NOT NULL,
    
    -- Constraints
    CONSTRAINT products_slug_format CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT products_sale_price_check CHECK (sale_price IS NULL OR sale_price < price),
    CONSTRAINT products_password_check CHECK (
        (visibility = 'password_protected' AND password IS NOT NULL) OR 
        (visibility != 'password_protected' AND password IS NULL)
    )
);

-- Product images with detailed metadata
CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    title TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    mime_type VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL
);
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL;

ALTER TABLE product_images ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL;

-- Product variants (size, color, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) UNIQUE,
    price DECIMAL(10,2) CHECK (price IS NULL OR price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price IS NULL OR sale_price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    weight DECIMAL(8,3) CHECK (weight IS NULL OR weight > 0),
    dimensions JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    attributes JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL
);

ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL;

-- =====================================================
-- ORDER MANAGEMENT SYSTEM
-- =====================================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Order Identification
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Customer Information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_email VARCHAR(255),
    
    -- Status Management
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'shipped', 'delivered', 'cancelled', 
        'refunded', 'failed', 'on_hold', 'partially_shipped'
    )) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled'
    )) NOT NULL,
    fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled' CHECK (fulfillment_status IN (
        'unfulfilled', 'partially_fulfilled', 'fulfilled', 'cancelled'
    )) NOT NULL,
    
    -- Payment Information
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    transaction_id VARCHAR(255),
    
    -- Financial Details
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (discount_amount >= 0),
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    
    -- Addresses
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    
    -- Additional Information
    customer_notes TEXT,
    admin_notes TEXT,
    internal_notes TEXT,
    
    -- Shipping Information
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    tracking_url TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    estimated_delivery_date DATE,
    
    -- Promotional Information
    coupon_code VARCHAR(50),
    coupon_discount DECIMAL(10,2) DEFAULT 0.00 CHECK (coupon_discount >= 0),
    
    -- Analytics
    referral_source VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- Risk Assessment
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')) NOT NULL,
    fraud_score DECIMAL(5,2) DEFAULT 0.00 CHECK (fraud_score >= 0 AND fraud_score <= 100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    supplier_product_id UUID REFERENCES supplier_products(id) ON DELETE SET NULL,
    
    -- Product Information (snapshot at time of order)
    name TEXT NOT NULL,
    sku VARCHAR(255),
    description TEXT,
    image_url TEXT,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    
    -- Profit Calculation
    profit DECIMAL(10,2) DEFAULT 0.00,
    margin_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Product Details (snapshot)
    variant_attributes JSONB DEFAULT '{}'::jsonb,
    product_snapshot JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Fulfillment
    fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled' CHECK (fulfillment_status IN (
        'unfulfilled', 'fulfilled', 'cancelled', 'returned'
    )) NOT NULL,
    fulfilled_quantity INTEGER DEFAULT 0 CHECK (fulfilled_quantity >= 0),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Order status history
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) NOT NULL,
    previous_status VARCHAR(20),
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- SUPPLIER ORDER MANAGEMENT (DROPSHIPPING)
-- =====================================================

-- Supplier orders for dropshipping fulfillment
CREATE TABLE IF NOT EXISTS supplier_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Relationships
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    
    -- External Reference
    external_order_id VARCHAR(255),
    external_order_number VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 
        'cancelled', 'failed', 'refunded'
    )) NOT NULL,
    
    -- Financial
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    supplier_amount DECIMAL(10,2) NOT NULL CHECK (supplier_amount >= 0),
    our_profit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    
    -- Shipping
    tracking_number VARCHAR(255),
    tracking_url TEXT,
    shipping_method VARCHAR(100),
    shipping_cost DECIMAL(10,2) DEFAULT 0.00 CHECK (shipping_cost >= 0),
    shipping_status VARCHAR(50) DEFAULT 'pending',
    
    -- Delivery
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 CHECK (retry_count >= 0),
    max_retries INTEGER DEFAULT 3 CHECK (max_retries > 0),
    last_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional Information
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Supplier order items
CREATE TABLE IF NOT EXISTS supplier_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    supplier_order_id UUID REFERENCES supplier_orders(id) ON DELETE CASCADE NOT NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE NOT NULL,
    supplier_product_id UUID REFERENCES supplier_products(id) NOT NULL,
    
    -- External Reference
    external_product_id VARCHAR(255) NOT NULL,
    external_variant_id VARCHAR(255),
    
    -- Product Information
    name TEXT NOT NULL,
    sku VARCHAR(255),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    
    -- Variant Information
    variant_attributes JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    )) NOT NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

-- Inventory transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Transaction Details
    type VARCHAR(20) NOT NULL CHECK (type IN (
        'purchase', 'sale', 'adjustment', 'return', 'damage', 'theft', 'sync'
    )),
    quantity_change INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL CHECK (quantity_before >= 0),
    quantity_after INTEGER NOT NULL CHECK (quantity_after >= 0),
    
    -- Reference
    reference_type VARCHAR(50),
    reference_id UUID,
    
    -- User & Reason
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT inventory_transactions_product_check CHECK (
        (product_id IS NOT NULL AND product_variant_id IS NULL) OR
        (product_id IS NULL AND product_variant_id IS NOT NULL)
    )
);

-- Stock alerts
CREATE TABLE IF NOT EXISTS stock_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Alert Details
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),
    threshold_value INTEGER NOT NULL,
    current_stock INTEGER NOT NULL,
    
    -- Status
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Notifications
    notification_sent BOOLEAN DEFAULT FALSE NOT NULL,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT stock_alerts_product_check CHECK (
        (product_id IS NOT NULL AND product_variant_id IS NULL) OR
        (product_id IS NULL AND product_variant_id IS NOT NULL)
    )
);

-- =====================================================
-- PRICING & PROMOTIONS
-- =====================================================

-- Pricing rules for dynamic pricing
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Rule Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Scope
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    
    -- Conditions
    min_price DECIMAL(10,2) CHECK (min_price IS NULL OR min_price >= 0),
    max_price DECIMAL(10,2) CHECK (max_price IS NULL OR max_price >= 0),
    conditions JSONB DEFAULT '{}'::jsonb,
    
    -- Pricing Logic
    markup_type VARCHAR(20) DEFAULT 'percentage' CHECK (markup_type IN ('percentage', 'fixed', 'formula')) NOT NULL,
    markup_value DECIMAL(10,2) NOT NULL,
    min_profit DECIMAL(10,2) DEFAULT 5.00 CHECK (min_profit >= 0),
    max_profit DECIMAL(10,2) CHECK (max_profit IS NULL OR max_profit >= min_profit),
    
    -- Status & Priority
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    priority INTEGER DEFAULT 1 CHECK (priority > 0),
    
    -- Validity Period
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT pricing_rules_price_range CHECK (min_price IS NULL OR max_price IS NULL OR min_price <= max_price),
    CONSTRAINT pricing_rules_validity CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_from < valid_until)
);

-- Price history for tracking
CREATE TABLE IF NOT EXISTS price_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Price Information
    original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
    final_price DECIMAL(10,2) NOT NULL CHECK (final_price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
    
    -- Rule Application
    pricing_rule_id UUID REFERENCES pricing_rules(id) ON DELETE SET NULL,
    adjustments JSONB DEFAULT '{}'::jsonb,
    
    -- Context
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT price_history_product_check CHECK (
        (product_id IS NOT NULL AND product_variant_id IS NULL) OR
        (product_id IS NULL AND product_variant_id IS NOT NULL)
    )
);

-- Coupons and discounts
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Coupon Information
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Discount Configuration
    type VARCHAR(20) DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed', 'free_shipping', 'buy_x_get_y')) NOT NULL,
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
    
    -- Usage Restrictions
    minimum_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (minimum_amount >= 0),
    maximum_discount DECIMAL(10,2) CHECK (maximum_discount IS NULL OR maximum_discount >= 0),
    usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
    usage_limit_per_customer INTEGER CHECK (usage_limit_per_customer IS NULL OR usage_limit_per_customer > 0),
    usage_count INTEGER DEFAULT 0 CHECK (usage_count >= 0),
    
    -- Applicability
    applicable_products UUID[] DEFAULT '{}',
    applicable_categories UUID[] DEFAULT '{}',
    excluded_products UUID[] DEFAULT '{}',
    excluded_categories UUID[] DEFAULT '{}',
    customer_eligibility JSONB DEFAULT '{}'::jsonb,
    
    -- Status & Validity
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT coupons_code_format CHECK (code ~* '^[A-Z0-9_-]+$'),
    CONSTRAINT coupons_validity CHECK (valid_from < valid_until OR valid_until IS NULL),
    CONSTRAINT coupons_percentage_value CHECK (type != 'percentage' OR (value >= 0 AND value <= 100))
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Usage Details
    discount_amount DECIMAL(10,2) NOT NULL CHECK (discount_amount >= 0),
    order_total DECIMAL(10,2) NOT NULL CHECK (order_total >= 0),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- CUSTOMER REVIEWS & RATINGS
-- =====================================================

-- Product reviews
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Relationships
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    
    -- Review Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    
    -- Media
    images TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    
    -- Verification & Moderation
    is_verified_purchase BOOLEAN DEFAULT FALSE NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE NOT NULL,
    moderation_status VARCHAR(20) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')) NOT NULL,
    moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_reason TEXT,
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
    not_helpful_count INTEGER DEFAULT 0 CHECK (not_helpful_count >= 0),
    
    -- Response
    response TEXT,
    response_by UUID REFERENCES users(id) ON DELETE SET NULL,
    response_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Review helpfulness votes
CREATE TABLE IF NOT EXISTS review_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    vote VARCHAR(10) NOT NULL CHECK (vote IN ('helpful', 'not_helpful')),
    
    -- Constraints
    UNIQUE(review_id, user_id)
);

-- =====================================================
-- SYNCHRONIZATION & AUTOMATION
-- =====================================================

-- Sync logs for tracking synchronization activities
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Sync Information
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL CHECK (sync_type IN ('products', 'prices', 'stock', 'orders', 'full', 'images')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'success', 'error', 'partial', 'cancelled')) NOT NULL,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    
    -- Statistics
    total_items INTEGER DEFAULT 0 CHECK (total_items >= 0),
    processed_items INTEGER DEFAULT 0 CHECK (processed_items >= 0),
    successful_items INTEGER DEFAULT 0 CHECK (successful_items >= 0),
    failed_items INTEGER DEFAULT 0 CHECK (failed_items >= 0),
    skipped_items INTEGER DEFAULT 0 CHECK (skipped_items >= 0),
    
    -- Details
    error_details JSONB DEFAULT '{}'::jsonb,
    summary JSONB DEFAULT '{}'::jsonb,
    
    -- Trigger Information
    triggered_by VARCHAR(50) DEFAULT 'manual' CHECK (triggered_by IN ('manual', 'cron', 'webhook', 'api', 'auto')) NOT NULL,
    triggered_by_user UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Sync errors for detailed error tracking
CREATE TABLE IF NOT EXISTS sync_errors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    sync_log_id UUID REFERENCES sync_logs(id) ON DELETE CASCADE NOT NULL,
    
    -- Error Information
    error_type VARCHAR(100) NOT NULL,
    error_code VARCHAR(50),
    error_message TEXT NOT NULL,
    
    -- Context
    item_type VARCHAR(50),
    item_id VARCHAR(255),
    item_data JSONB DEFAULT '{}'::jsonb,
    
    -- Stack Trace
    stack_trace TEXT,
    
    -- Resolution
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Automation rules
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Rule Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Trigger Configuration
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN (
        'order_created', 'order_paid', 'product_low_stock', 'product_out_of_stock',
        'sync_completed', 'sync_failed', 'review_submitted', 'user_registered'
    )),
    trigger_conditions JSONB DEFAULT '{}'::jsonb,
    
    -- Action Configuration
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'send_email', 'send_sms', 'create_supplier_order', 'update_stock',
        'apply_discount', 'send_notification', 'webhook', 'custom_script'
    )),
    action_config JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Status & Execution
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    execution_count INTEGER DEFAULT 0 CHECK (execution_count >= 0),
    last_executed_at TIMESTAMP WITH TIME ZONE,
    
    -- Error Handling
    max_retries INTEGER DEFAULT 3 CHECK (max_retries >= 0),
    retry_delay_seconds INTEGER DEFAULT 300 CHECK (retry_delay_seconds > 0),
    
    -- Metadata
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Automation execution logs
CREATE TABLE IF NOT EXISTS automation_executions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    automation_rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE NOT NULL,
    
    -- Execution Details
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'retrying')) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    
    -- Context
    trigger_data JSONB DEFAULT '{}'::jsonb,
    execution_result JSONB DEFAULT '{}'::jsonb,
    
    -- Error Information
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 CHECK (retry_count >= 0),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Event Information
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    
    -- User & Session
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    anonymous_id VARCHAR(255),
    
    -- Context
    page_url TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    
    -- Geographic
    country_code VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Device Information
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(20),
    
    -- Event Data
    properties JSONB DEFAULT '{}'::jsonb,
    
    -- E-commerce Specific
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Revenue Tracking
    revenue DECIMAL(10,2) CHECK (revenue IS NULL OR revenue >= 0),
    currency VARCHAR(3),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Daily analytics aggregations
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Traffic Metrics
    unique_visitors INTEGER DEFAULT 0 CHECK (unique_visitors >= 0),
    page_views INTEGER DEFAULT 0 CHECK (page_views >= 0),
    sessions INTEGER DEFAULT 0 CHECK (sessions >= 0),
    bounce_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (bounce_rate >= 0 AND bounce_rate <= 100),
    avg_session_duration INTEGER DEFAULT 0 CHECK (avg_session_duration >= 0),
    
    -- E-commerce Metrics
    orders_count INTEGER DEFAULT 0 CHECK (orders_count >= 0),
    revenue DECIMAL(12,2) DEFAULT 0.00 CHECK (revenue >= 0),
    avg_order_value DECIMAL(10,2) DEFAULT 0.00 CHECK (avg_order_value >= 0),
    conversion_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (conversion_rate >= 0 AND conversion_rate <= 100),
    
    -- Product Metrics
    products_viewed INTEGER DEFAULT 0 CHECK (products_viewed >= 0),
    products_added_to_cart INTEGER DEFAULT 0 CHECK (products_added_to_cart >= 0),
    cart_abandonment_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (cart_abandonment_rate >= 0 AND cart_abandonment_rate <= 100),
    
    -- Customer Metrics
    new_customers INTEGER DEFAULT 0 CHECK (new_customers >= 0),
    returning_customers INTEGER DEFAULT 0 CHECK (returning_customers >= 0),
    
    -- Geographic Data
    top_countries JSONB DEFAULT '{}'::jsonb,
    top_cities JSONB DEFAULT '{}'::jsonb,
    
    -- Device Data
    desktop_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (desktop_percentage >= 0 AND desktop_percentage <= 100),
    mobile_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (mobile_percentage >= 0 AND mobile_percentage <= 100),
    tablet_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (tablet_percentage >= 0 AND tablet_percentage <= 100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    UNIQUE(date)
);

-- =====================================================
-- NOTIFICATIONS & COMMUNICATIONS
-- =====================================================

-- Notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Template Information
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    
    -- Template Content
    subject VARCHAR(500),
    body_text TEXT,
    body_html TEXT,
    
    -- Configuration
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Metadata
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Notifications queue
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Recipient Information
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Notification Details
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
    subject VARCHAR(500),
    content TEXT NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')) NOT NULL,
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery Information
    provider VARCHAR(100),
    external_id VARCHAR(255),
    delivery_status VARCHAR(50),
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 CHECK (retry_count >= 0),
    max_retries INTEGER DEFAULT 3 CHECK (max_retries >= 0),
    
    -- Context
    context_type VARCHAR(100),
    context_id UUID,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT notifications_recipient_check CHECK (
        user_id IS NOT NULL OR email IS NOT NULL OR phone IS NOT NULL
    )
);

-- =====================================================
-- SYSTEM CONFIGURATION
-- =====================================================

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Setting Information
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    
    -- Organization
    category VARCHAR(100) DEFAULT 'general' NOT NULL,
    subcategory VARCHAR(100),
    
    -- Access Control
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Validation
    data_type VARCHAR(50) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json', 'array')) NOT NULL,
    validation_rules JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);

-- User addresses indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_type ON user_addresses(type);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(is_default);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_is_featured ON categories(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_path ON categories USING GIN(path);

-- Brands indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_is_active ON brands(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_is_featured ON brands(is_featured);

-- Suppliers indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_slug ON suppliers(slug);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(type);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_auto_sync ON suppliers(auto_sync);
CREATE INDEX IF NOT EXISTS idx_suppliers_last_sync_at ON suppliers(last_sync_at);

-- Supplier products indexes
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_external_id ON supplier_products(external_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_status ON supplier_products(status);
CREATE INDEX IF NOT EXISTS idx_supplier_products_is_featured ON supplier_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_supplier_products_price ON supplier_products(original_price);
CREATE INDEX IF NOT EXISTS idx_supplier_products_rating ON supplier_products(rating);
CREATE INDEX IF NOT EXISTS idx_supplier_products_tags ON supplier_products USING GIN(tags);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_product_id ON products(supplier_product_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_visibility ON products(visibility);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Product images indexes
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(sort_order);

-- Product variants indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_active ON product_variants(is_active);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_total ON orders(total);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_variant_id ON order_items(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_supplier_product_id ON order_items(supplier_product_id);

-- Supplier orders indexes
CREATE INDEX IF NOT EXISTS idx_supplier_orders_order_id ON supplier_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier_id ON supplier_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_status ON supplier_orders(status);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_external_order_id ON supplier_orders(external_order_id);

-- Inventory transactions indexes
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_variant_id ON inventory_transactions(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at);

-- Product reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);

-- Sync logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_supplier_id ON sync_logs(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_sync_type ON sync_logs(sync_type);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at);

-- Analytics events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_product_id ON analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_products_updated_at BEFORE UPDATE ON supplier_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_orders_updated_at BEFORE UPDATE ON supplier_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'DJG-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate order number
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

-- Function to calculate selling price
CREATE OR REPLACE FUNCTION calculate_selling_price(
    original_price DECIMAL(10,2),
    markup_percentage DECIMAL(5,2)
) RETURNS DECIMAL(10,2) AS $$
BEGIN
    RETURN ROUND(original_price * (1 + markup_percentage / 100), 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update product pricing automatically
CREATE OR REPLACE FUNCTION auto_calculate_product_pricing()
RETURNS TRIGGER AS $$
DECLARE
    supplier_price DECIMAL(10,2);
BEGIN
    -- Only calculate if linked to supplier product
    IF NEW.supplier_product_id IS NOT NULL THEN
        SELECT original_price INTO supplier_price
        FROM supplier_products 
        WHERE id = NEW.supplier_product_id;
        
        IF supplier_price IS NOT NULL THEN
            -- Calculate selling price with markup
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

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    product_uuid UUID;
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Get product ID from NEW or OLD record
    product_uuid = COALESCE(NEW.product_id, OLD.product_id);
    
    -- Calculate new rating and count
    SELECT 
        ROUND(AVG(rating), 2),
        COUNT(*)
    INTO avg_rating, review_count
    FROM product_reviews 
    WHERE product_id = product_uuid AND is_approved = true;
    
    -- Update product
    UPDATE products 
    SET 
        rating = COALESCE(avg_rating, 0),
        reviews_count = review_count,
        updated_at = NOW()
    WHERE id = product_uuid;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_rating
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

-- Function to update category product count
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
DECLARE
    old_category_id UUID;
    new_category_id UUID;
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        new_category_id = NEW.category_id;
        IF new_category_id IS NOT NULL THEN
            UPDATE categories 
            SET product_count = product_count + 1 
            WHERE id = new_category_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle UPDATE
    IF TG_OP = 'UPDATE' THEN
        old_category_id = OLD.category_id;
        new_category_id = NEW.category_id;
        
        -- Decrease count for old category
        IF old_category_id IS NOT NULL AND old_category_id != new_category_id THEN
            UPDATE categories 
            SET product_count = GREATEST(product_count - 1, 0) 
            WHERE id = old_category_id;
        END IF;
        
        -- Increase count for new category
        IF new_category_id IS NOT NULL AND old_category_id != new_category_id THEN
            UPDATE categories 
            SET product_count = product_count + 1 
            WHERE id = new_category_id;
        END IF;
        
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        old_category_id = OLD.category_id;
        IF old_category_id IS NOT NULL THEN
            UPDATE categories 
            SET product_count = GREATEST(product_count - 1, 0) 
            WHERE id = old_category_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_product_count
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_category_product_count();

-- Function to update brand product count
CREATE OR REPLACE FUNCTION update_brand_product_count()
RETURNS TRIGGER AS $$
DECLARE
    old_brand_id UUID;
    new_brand_id UUID;
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        new_brand_id = NEW.brand_id;
        IF new_brand_id IS NOT NULL THEN
            UPDATE brands 
            SET product_count = product_count + 1 
            WHERE id = new_brand_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle UPDATE
    IF TG_OP = 'UPDATE' THEN
        old_brand_id = OLD.brand_id;
        new_brand_id = NEW.brand_id;
        
        -- Decrease count for old brand
        IF old_brand_id IS NOT NULL AND old_brand_id != new_brand_id THEN
            UPDATE brands 
            SET product_count = GREATEST(product_count - 1, 0) 
            WHERE id = old_brand_id;
        END IF;
        
        -- Increase count for new brand
        IF new_brand_id IS NOT NULL AND old_brand_id != new_brand_id THEN
            UPDATE brands 
            SET product_count = product_count + 1 
            WHERE id = new_brand_id;
        END IF;
        
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        old_brand_id = OLD.brand_id;
        IF old_brand_id IS NOT NULL THEN
            UPDATE brands 
            SET product_count = GREATEST(product_count - 1, 0) 
            WHERE id = old_brand_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_brand_product_count
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_brand_product_count();

-- Function to create inventory transaction
CREATE OR REPLACE FUNCTION create_inventory_transaction(
    p_product_id UUID DEFAULT NULL,
    p_product_variant_id UUID DEFAULT NULL,
    p_transaction_type VARCHAR(20),
    p_quantity_change INTEGER,
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    current_stock INTEGER;
    transaction_id UUID;
BEGIN
    -- Get current stock
    IF p_product_id IS NOT NULL THEN
        SELECT stock INTO current_stock FROM products WHERE id = p_product_id;
    ELSIF p_product_variant_id IS NOT NULL THEN
        SELECT stock INTO current_stock FROM product_variants WHERE id = p_product_variant_id;
    ELSE
        RAISE EXCEPTION 'Either product_id or product_variant_id must be provided';
    END IF;
    
    -- Create transaction record
    INSERT INTO inventory_transactions (
        product_id, product_variant_id, type, quantity_change,
        quantity_before, quantity_after, reference_type, reference_id,
        user_id, reason, notes
    ) VALUES (
        p_product_id, p_product_variant_id, p_transaction_type, p_quantity_change,
        current_stock, current_stock + p_quantity_change, p_reference_type, p_reference_id,
        p_user_id, p_reason, p_notes
    ) RETURNING id INTO transaction_id;
    
    -- Update stock
    IF p_product_id IS NOT NULL THEN
        UPDATE products 
        SET stock = stock + p_quantity_change 
        WHERE id = p_product_id;
    ELSIF p_product_variant_id IS NOT NULL THEN
        UPDATE product_variants 
        SET stock = stock + p_quantity_change 
        WHERE id = p_product_variant_id;
    END IF;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own addresses
CREATE POLICY "Users can view own addresses" ON user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON user_addresses FOR DELETE USING (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Users can manage their own reviews
CREATE POLICY "Users can view own reviews" ON product_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
('site_name', '"DjigaFlow"', 'Nom du site web', 'general', true),
('site_description', '"Marketplace professionnel de dropshipping"', 'Description du site', 'general', true),
('site_url', '"https://djigaflow.com"', 'URL du site web', 'general', true),
('default_currency', '"EUR"', 'Devise par défaut', 'general', true),
('default_language', '"fr"', 'Langue par défaut', 'general', true),
('timezone', '"Europe/Paris"', 'Fuseau horaire par défaut', 'general', false),
('maintenance_mode', 'false', 'Mode maintenance activé', 'general', false),
('registration_enabled', 'true', 'Inscription des utilisateurs activée', 'auth', true),
('email_verification_required', 'true', 'Vérification email obligatoire', 'auth', false),
('default_markup_percentage', '50', 'Marge par défaut en pourcentage', 'pricing', false),
('auto_sync_enabled', 'true', 'Synchronisation automatique activée', 'sync', false),
('sync_frequency_hours', '6', 'Fréquence de synchronisation en heures', 'sync', false),
('order_auto_processing', 'true', 'Traitement automatique des commandes', 'orders', false),
('email_notifications_enabled', 'true', 'Notifications par email activées', 'notifications', false),
('sms_notifications_enabled', 'false', 'Notifications par SMS activées', 'notifications', false),
('analytics_enabled', 'true', 'Analytics activées', 'analytics', false),
('max_upload_size_mb', '10', 'Taille maximale de téléchargement en MB', 'uploads', false),
('allowed_image_types', '["jpg", "jpeg", "png", "webp", "gif"]'::jsonb, 'Types d''images autorisés', 'uploads', false),
('free_shipping_threshold', '50', 'Seuil de livraison gratuite', 'shipping', true),
('tax_rate', '20', 'Taux de TVA par défaut', 'tax', false),
('cookie_consent_required', 'true', 'Consentement cookies requis', 'privacy', true)
ON CONFLICT (key) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order, is_active, is_featured) VALUES
('Électronique', 'electronique', 'Appareils électroniques et gadgets high-tech', 1, true, true),
('Mode & Beauté', 'mode-beaute', 'Vêtements, chaussures et produits de beauté', 2, true, true),
('Maison & Jardin', 'maison-jardin', 'Articles pour la maison et le jardinage', 3, true, true),
('Sport & Loisirs', 'sport-loisirs', 'Équipements sportifs et articles de loisirs', 4, true, true),
('Santé & Bien-être', 'sante-bien-etre', 'Produits de santé et bien-être', 5, true, false),
('Automobile', 'automobile', 'Accessoires et pièces automobiles', 6, true, false);
