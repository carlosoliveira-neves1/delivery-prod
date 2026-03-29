-- ============================================================================
-- ChegouAí Delivery - Dados de Teste Genéricos (Schema: delivery)
-- ============================================================================

-- ============================================================================
-- 1. INSERIR EMPRESA
-- ============================================================================
INSERT INTO delivery.companies (name, code, schema_name, description, tax_id, legal_name)
VALUES (
  'Delivery Infra',
  'DELIV001',
  'delivery',
  'Plataforma de delivery multi-tenant',
  '12345678000190',
  'Delivery Infra LTDA'
) ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 2. INSERIR USUÁRIOS
-- ============================================================================
INSERT INTO delivery.users (company_id, name, email, password_hash, phone, role, is_active)
SELECT 
  c.id,
  'Administrador',
  'admin@delivery.com',
  'dGVzdGUxMjM0NTY3OHRhbmFtYW9fc2FsdA==',
  '11999999999',
  'admin',
  true
FROM delivery.companies c
WHERE c.code = 'DELIV001'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.users (company_id, name, email, password_hash, phone, role, is_active)
SELECT 
  c.id,
  'Gerente de Loja',
  'gerente@delivery.com',
  'dGVzdGUxMjM0NTY3OHRhbmFtYW9fc2FsdA==',
  '11988888888',
  'user',
  true
FROM delivery.companies c
WHERE c.code = 'DELIV001'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.users (company_id, name, email, password_hash, phone, role, is_active)
SELECT 
  c.id,
  'Entregador',
  'entregador@delivery.com',
  'dGVzdGUxMjM0NTY3OHRhbmFtYW9fc2FsdA==',
  '11977777777',
  'user',
  true
FROM delivery.companies c
WHERE c.code = 'DELIV001'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. INSERIR NEGÓCIOS (LOJAS)
-- ============================================================================
INSERT INTO delivery.businesses (company_id, user_id, business_name, business_type, description, phone, address, delivery_fee, min_order_value, is_active)
SELECT 
  c.id,
  u.id,
  'Restaurante Central',
  'restaurante',
  'Restaurante com comida caseira e fresca',
  '11987654321',
  'Avenida Paulista, 1000 - São Paulo, SP',
  12.00,
  25.00,
  true
FROM delivery.companies c
CROSS JOIN delivery.users u
WHERE c.code = 'DELIV001' AND u.email = 'gerente@delivery.com'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.businesses (company_id, user_id, business_name, business_type, description, phone, address, delivery_fee, min_order_value, is_active)
SELECT 
  c.id,
  u.id,
  'Lanchonete Rápida',
  'lanchonete',
  'Lanches rápidos e saborosos',
  '11987654322',
  'Rua Augusta, 500 - São Paulo, SP',
  8.00,
  15.00,
  true
FROM delivery.companies c
CROSS JOIN delivery.users u
WHERE c.code = 'DELIV001' AND u.email = 'gerente@delivery.com'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.businesses (company_id, user_id, business_name, business_type, description, phone, address, delivery_fee, min_order_value, is_active)
SELECT 
  c.id,
  u.id,
  'Açaí e Smoothies',
  'cafe',
  'Bebidas naturais e saudáveis',
  '11987654323',
  'Rua Oscar Freire, 300 - São Paulo, SP',
  5.00,
  10.00,
  true
FROM delivery.companies c
CROSS JOIN delivery.users u
WHERE c.code = 'DELIV001' AND u.email = 'gerente@delivery.com'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. INSERIR CATEGORIAS
-- ============================================================================
INSERT INTO delivery.categories (company_id, business_id, name, description, display_order, is_active)
SELECT 
  c.id,
  b.id,
  'Pratos Principais',
  'Nossos pratos mais populares',
  1,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.categories (company_id, business_id, name, description, display_order, is_active)
SELECT 
  c.id,
  b.id,
  'Acompanhamentos',
  'Arroz, feijão, saladas',
  2,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.categories (company_id, business_id, name, description, display_order, is_active)
SELECT 
  c.id,
  b.id,
  'Bebidas',
  'Sucos, refrigerantes, água',
  3,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.categories (company_id, business_id, name, description, display_order, is_active)
SELECT 
  c.id,
  b.id,
  'Lanches',
  'Sanduíches e pastéis',
  1,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Lanchonete Rápida'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.categories (company_id, business_id, name, description, display_order, is_active)
SELECT 
  c.id,
  b.id,
  'Açaí',
  'Açaí com frutas e granola',
  1,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Açaí e Smoothies'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.categories (company_id, business_id, name, description, display_order, is_active)
SELECT 
  c.id,
  b.id,
  'Smoothies',
  'Bebidas naturais',
  2,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Açaí e Smoothies'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. INSERIR PRODUTOS
-- ============================================================================
-- Restaurante Central
INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Moqueca de Peixe',
  'Peixe fresco com leite de coco e dendê',
  65.00, 25, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central' AND cat.name = 'Pratos Principais'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Feijoada Completa',
  'Feijoada com acompanhamentos',
  55.00, 30, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central' AND cat.name = 'Pratos Principais'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Arroz Integral',
  'Arroz integral cozido no vapor',
  8.00, 10, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central' AND cat.name = 'Acompanhamentos'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Suco Natural Laranja',
  'Suco de laranja espremido na hora',
  12.00, 5, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central' AND cat.name = 'Bebidas'
ON CONFLICT DO NOTHING;

-- Lanchonete Rápida
INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Sanduíche Especial',
  'Pão integral com carnes variadas',
  28.00, 10, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Lanchonete Rápida' AND cat.name = 'Lanches'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Pastel de Queijo',
  'Pastel crocante recheado de queijo',
  12.00, 8, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Lanchonete Rápida' AND cat.name = 'Lanches'
ON CONFLICT DO NOTHING;

-- Açaí e Smoothies
INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Açaí com Granola',
  'Açaí com granola, banana e mel',
  22.00, 5, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Açaí e Smoothies' AND cat.name = 'Açaí'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.products (company_id, business_id, category_id, name, description, price, preparation_time, is_available)
SELECT 
  c.id, b.id, cat.id,
  'Smoothie Morango',
  'Smoothie natural de morango com iogurte',
  18.00, 5, true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
CROSS JOIN delivery.categories cat
WHERE c.code = 'DELIV001' AND b.business_name = 'Açaí e Smoothies' AND cat.name = 'Smoothies'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. INSERIR CLIENTES
-- ============================================================================
INSERT INTO delivery.customers (company_id, business_id, name, email, phone, address, city, state, zip_code, cpf, is_active)
SELECT 
  c.id, b.id,
  'Carlos Silva',
  'carlos@email.com',
  '11999999999',
  'Rua das Flores, 100',
  'São Paulo',
  'SP',
  '01234-567',
  '12345678901',
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.customers (company_id, business_id, name, email, phone, address, city, state, zip_code, cpf, is_active)
SELECT 
  c.id, b.id,
  'Maria Santos',
  'maria@email.com',
  '11988888888',
  'Avenida Brasil, 200',
  'São Paulo',
  'SP',
  '02345-678',
  '98765432101',
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Lanchonete Rápida'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.customers (company_id, business_id, name, email, phone, address, city, state, zip_code, cpf, is_active)
SELECT 
  c.id, b.id,
  'João Oliveira',
  'joao@email.com',
  '11977777777',
  'Rua das Acácias, 300',
  'São Paulo',
  'SP',
  '03456-789',
  '55555555555',
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Açaí e Smoothies'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. INSERIR PROMOÇÕES
-- ============================================================================
INSERT INTO delivery.promotions (company_id, business_id, name, description, discount_type, discount_value, min_order_value, max_uses, is_active)
SELECT 
  c.id, b.id,
  'Desconto Primeira Compra',
  '15% de desconto na primeira compra',
  'percentage',
  15.00,
  30.00,
  100,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Restaurante Central'
ON CONFLICT DO NOTHING;

INSERT INTO delivery.promotions (company_id, business_id, name, description, discount_type, discount_value, min_order_value, max_uses, is_active)
SELECT 
  c.id, b.id,
  'Cupom R$ 10 OFF',
  'R$ 10 de desconto em pedidos acima de R$ 50',
  'fixed_amount',
  10.00,
  50.00,
  50,
  true
FROM delivery.companies c
CROSS JOIN delivery.businesses b
WHERE c.code = 'DELIV001' AND b.business_name = 'Lanchonete Rápida'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIM DO SEED DATA
-- ============================================================================
-- Dados de teste inseridos com sucesso!
-- Schema: delivery
-- Empresa: DELIV001
-- Usuários: admin@delivery.com, gerente@delivery.com, entregador@delivery.com
-- Senha: teste12345678
