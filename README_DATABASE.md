# 🗄️ Sistema de Banco de Dados - ChegouAí

## 📋 Visão Geral

O ChegouAí implementa um sistema flexível de banco de dados que funciona tanto localmente (localStorage) quanto na nuvem, permitindo escalabilidade conforme o crescimento do negócio.

## 🏗️ Arquitetura

### Camadas do Sistema:
1. **Frontend React** - Interface do usuário
2. **UserService** - Lógica de negócio e autenticação
3. **CloudDatabase** - Abstração do banco de dados
4. **Providers** - Supabase, Firebase, PlanetScale, Railway

## 🔧 Configuração Rápida

### Opção 1: Supabase (Recomendado - PostgreSQL)

```bash
# 1. Instalar dependência
npm install @supabase/supabase-js

# 2. Criar conta em https://supabase.com
# 3. Criar novo projeto
# 4. Configurar variáveis de ambiente
```

**Arquivo `.env`:**
```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anonima
```

**SQL para criar tabelas:**
```sql
-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de negócios
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    address TEXT,
    template_config JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(8,2),
    category_id VARCHAR(100),
    image_url TEXT,
    sku VARCHAR(100),
    preparation_time INTEGER,
    ingredients JSONB,
    allergens JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    delivery_address TEXT,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_orders_business_id ON orders(business_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Opção 2: Firebase (NoSQL)

```bash
# 1. Instalar dependência
npm install firebase

# 2. Criar projeto em https://console.firebase.google.com
# 3. Ativar Firestore Database
```

**Arquivo `.env`:**
```env
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto-id
```

## 🚀 Como Usar

### 1. Inicialização
```javascript
import { initializeUserService } from '@/lib/userService';

// No App.js ou componente principal
const userService = await initializeUserService();
```

### 2. Registro de Usuário
```javascript
const result = await userService.registerUser({
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123'
});

if (result.success) {
  console.log('Usuário criado:', result.user);
}
```

### 3. Login
```javascript
const result = await userService.loginUser('joao@email.com', 'senha123');

if (result.success) {
  console.log('Login realizado:', result.user);
}
```

### 4. Criar Negócio
```javascript
const business = await userService.createUserBusiness(userId, {
  name: 'Pizzaria do João',
  type: 'pizzaria',
  description: 'A melhor pizza da cidade',
  phone: '11999999999',
  address: 'Rua das Flores, 123',
  template: { colors: { primary: '#dc2626' } }
});
```

## 📊 Estrutura de Dados

### Usuário
```javascript
{
  id: 'uuid',
  name: 'Nome do Usuário',
  email: 'email@exemplo.com',
  role: 'user' | 'admin',
  created_at: '2024-03-01T10:00:00Z'
}
```

### Negócio
```javascript
{
  id: 'uuid',
  user_id: 'uuid',
  business_name: 'Nome do Negócio',
  business_type: 'pizzaria' | 'padaria' | 'mercado' | ...,
  description: 'Descrição do negócio',
  phone: '11999999999',
  address: 'Endereço completo',
  template_config: {
    colors: { primary: '#color', secondary: '#color' },
    layout: 'layout_type',
    defaultCategories: ['cat1', 'cat2']
  },
  is_active: true,
  created_at: '2024-03-01T10:00:00Z'
}
```

## 🔄 Fallback System

O sistema funciona em camadas:

1. **Nuvem Disponível**: Usa banco na nuvem (Supabase, Firebase, etc.)
2. **Nuvem Indisponível**: Fallback automático para localStorage
3. **Desenvolvimento**: localStorage por padrão

## 🛡️ Segurança

### Produção:
- Usar bcrypt para hash de senhas
- Implementar JWT para autenticação
- Configurar CORS adequadamente
- Usar HTTPS obrigatório

### Desenvolvimento:
- Hash simples com salt
- Sessão no localStorage
- Validação básica

## 📈 Escalabilidade

### Pequeno Porte (0-100 usuários):
- **Supabase Free**: 500MB, 2 CPU cores
- **Firebase Spark**: 1GB storage, 10GB transfer

### Médio Porte (100-1000 usuários):
- **Supabase Pro**: $25/mês, 8GB, 4 CPU cores
- **Firebase Blaze**: Pay-as-you-go

### Grande Porte (1000+ usuários):
- **PlanetScale**: MySQL escalável
- **Railway**: PostgreSQL com auto-scaling

## 🔧 Manutenção

### Backup Automático:
```javascript
// Exportar dados para backup
const backup = {
  users: await db.getAllUsers(),
  businesses: await db.getAllBusinesses(),
  products: await db.getAllProducts(),
  orders: await db.getAllOrders()
};

localStorage.setItem('tanamao_backup', JSON.stringify(backup));
```

### Migração de Dados:
```javascript
// Migrar do localStorage para nuvem
const localData = JSON.parse(localStorage.getItem('tanamao_users'));
for (const user of localData) {
  await db.createUser(user);
}
```

## 📞 Suporte

Para dúvidas sobre configuração do banco:

1. Verifique as variáveis de ambiente
2. Teste a conexão no console do navegador
3. Consulte os logs de erro
4. Use o fallback localStorage se necessário

## 🎯 Próximos Passos

1. **Implementar**: Escolher provider e configurar
2. **Testar**: Cadastro e login de usuários
3. **Migrar**: Dados existentes se necessário
4. **Monitorar**: Performance e uso
5. **Escalar**: Conforme crescimento
