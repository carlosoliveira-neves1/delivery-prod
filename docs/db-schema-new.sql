-- ============================================================================
-- ChegouAí Delivery - Novo Schema Limpo (PostgreSQL)
-- ============================================================================
-- Este script cria um schema completamente novo e limpo

-- ============================================================================
-- CRIAR NOVO SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS chegouai;

-- ============================================================================
-- 1. TABELA COMPANIES (Multi-tenant - Isolamento por Empresa)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  schema_name VARCHAR(255) NOT NULL DEFAULT 'chegouai',
  description TEXT,
  tax_id VARCHAR(20) NOT NULL,
  state_registration VARCHAR(20),
  legal_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. TABELA USERS (Usuários do Sistema)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  avatar_url TEXT,
  role VARCHAR(40) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. TABELA BUSINESSES (Lojas/Restaurantes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES chegouai.users(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  description TEXT,
  phone VARCHAR(32),
  address TEXT,
  logo_url TEXT,
  banner_url TEXT,
  delivery_fee NUMERIC(10,2),
  min_order_value NUMERIC(10,2),
  opening_hours JSONB,
  template_config JSONB,
  rating NUMERIC(3,2),
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. TABELA CATEGORIES (Categorias de Produtos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. TABELA PRODUCTS (Produtos/Itens do Cardápio)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES chegouai.categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  weight NUMERIC(8,2),
  image_url TEXT,
  sku VARCHAR(100),
  preparation_time INTEGER,
  ingredients JSONB,
  allergens JSONB,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. TABELA CUSTOMERS (Clientes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(32),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  cpf VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. TABELA ORDERS (Pedidos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES chegouai.customers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES chegouai.users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(32),
  delivery_address TEXT,
  items JSONB NOT NULL,
  subtotal_amount NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2),
  discount_amount NUMERIC(10,2),
  total_amount NUMERIC(10,2) NOT NULL,
  final_amount NUMERIC(10,2),
  status VARCHAR(32) DEFAULT 'pending',
  payment_method VARCHAR(50),
  estimated_delivery_time INTEGER,
  actual_delivery_time TIMESTAMP,
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. TABELA PAYMENTS (Pagamentos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  order_id UUID REFERENCES chegouai.orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(32) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 9. TABELA DELIVERIES (Entregas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  order_id UUID REFERENCES chegouai.orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES chegouai.users(id) ON DELETE SET NULL,
  delivery_address TEXT NOT NULL,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  estimated_time INTEGER,
  actual_time INTEGER,
  delivery_fee NUMERIC(10,2),
  status VARCHAR(32) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. TABELA PROMOTIONS (Promoções/Cupons)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 11. TABELA LOYALTY_PROGRAMS (Programas de Fidelização)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_per_real NUMERIC(5,2),
  redemption_value NUMERIC(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 12. TABELA CUSTOMER_LOYALTY (Pontos do Cliente)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES chegouai.customers(id) ON DELETE CASCADE,
  loyalty_program_id UUID REFERENCES chegouai.loyalty_programs(id) ON DELETE CASCADE,
  points_balance NUMERIC(10,2) DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 13. TABELA REVIEWS (Avaliações)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  business_id UUID REFERENCES chegouai.businesses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES chegouai.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES chegouai.customers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 14. TABELA NOTIFICATIONS (Notificações)
-- ============================================================================
CREATE TABLE IF NOT EXISTS chegouai.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES chegouai.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES chegouai.users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON chegouai.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON chegouai.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON chegouai.users(is_active);

-- Businesses
CREATE INDEX IF NOT EXISTS idx_businesses_company_id ON chegouai.businesses(company_id);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON chegouai.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON chegouai.businesses(is_active);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_business_id ON chegouai.categories(business_id);
CREATE INDEX IF NOT EXISTS idx_categories_company_id ON chegouai.categories(company_id);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_business_id ON chegouai.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON chegouai.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON chegouai.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON chegouai.products(is_available);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON chegouai.customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON chegouai.customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON chegouai.customers(email);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON chegouai.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_business_id ON chegouai.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON chegouai.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON chegouai.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON chegouai.orders(created_at);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON chegouai.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON chegouai.payments(company_id);

-- Deliveries
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON chegouai.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver_id ON chegouai.deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON chegouai.deliveries(status);

-- Promotions
CREATE INDEX IF NOT EXISTS idx_promotions_business_id ON chegouai.promotions(business_id);
CREATE INDEX IF NOT EXISTS idx_promotions_company_id ON chegouai.promotions(company_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON chegouai.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON chegouai.reviews(order_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON chegouai.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON chegouai.notifications(is_read);

-- ============================================================================
-- FIM DO SCHEMA NOVO
-- ============================================================================
