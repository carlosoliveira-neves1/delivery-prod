// Sistema de banco de dados na nuvem para ChegouAí
// Implementação com múltiplas opções de backend
// v2.0 - localStorage fallback corrigido

// Configurações para diferentes provedores de banco
const DATABASE_CONFIGS = {
  // Opção 1: Supabase (PostgreSQL na nuvem - GRATUITO)
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co',
    key: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key',
    service: 'supabase'
  },
  
  // Opção 2: Firebase (NoSQL - GRATUITO)
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    service: 'firebase'
  },
  
  // Opção 3: PlanetScale (MySQL na nuvem - GRATUITO)
  planetscale: {
    host: process.env.REACT_APP_PLANETSCALE_HOST,
    username: process.env.REACT_APP_PLANETSCALE_USERNAME,
    password: process.env.REACT_APP_PLANETSCALE_PASSWORD,
    service: 'planetscale'
  },
  
  // Opção 4: Railway (PostgreSQL - GRATUITO)
  railway: {
    connectionString: process.env.REACT_APP_RAILWAY_DATABASE_URL,
    service: 'railway'
  }
};

// Estrutura das tabelas necessárias
const DATABASE_SCHEMA = {
  users: {
    id: 'UUID PRIMARY KEY',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password_hash: 'VARCHAR(255) NOT NULL',
    name: 'VARCHAR(255) NOT NULL',
    role: 'ENUM("admin", "user") DEFAULT "user"',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },
  
  businesses: {
    id: 'UUID PRIMARY KEY',
    user_id: 'UUID REFERENCES users(id)',
    business_name: 'VARCHAR(255) NOT NULL',
    business_type: 'VARCHAR(100) NOT NULL',
    description: 'TEXT',
    phone: 'VARCHAR(20)',
    address: 'TEXT',
    template_config: 'JSON',
    is_active: 'BOOLEAN DEFAULT true',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },
  
  products: {
    id: 'UUID PRIMARY KEY',
    business_id: 'UUID REFERENCES businesses(id)',
    name: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    price: 'DECIMAL(10,2) NOT NULL',
    weight: 'DECIMAL(8,2)',
    category_id: 'VARCHAR(100)',
    image_url: 'TEXT',
    sku: 'VARCHAR(100)',
    preparation_time: 'INTEGER',
    ingredients: 'JSON',
    allergens: 'JSON',
    is_available: 'BOOLEAN DEFAULT true',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },
  
  orders: {
    id: 'UUID PRIMARY KEY',
    business_id: 'UUID REFERENCES businesses(id)',
    customer_name: 'VARCHAR(255) NOT NULL',
    customer_email: 'VARCHAR(255)',
    customer_phone: 'VARCHAR(20)',
    delivery_address: 'TEXT',
    items: 'JSON NOT NULL',
    total_amount: 'DECIMAL(10,2) NOT NULL',
    status: 'ENUM("pending", "confirmed", "preparing", "ready", "delivered", "cancelled") DEFAULT "pending"',
    payment_method: 'VARCHAR(50)',
    notes: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};

// Classe principal para gerenciar o banco de dados
class CloudDatabase {
  constructor(provider = 'supabase') {
    this.provider = provider;
    this.config = DATABASE_CONFIGS[provider];
    this.client = null;
    this.isConnected = false;
  }

  // Inicializar conexão com o banco
  async initialize() {
    try {
      switch (this.provider) {
        case 'supabase':
          await this.initSupabase();
          break;
        case 'firebase':
          await this.initFirebase();
          break;
        case 'planetscale':
          await this.initPlanetScale();
          break;
        case 'railway':
          await this.initRailway();
          break;
        default:
          throw new Error(`Provider ${this.provider} não suportado`);
      }
      this.isConnected = true;
      console.log(`✅ Conectado ao ${this.provider}`);
    } catch (error) {
      console.error(`❌ Erro ao conectar com ${this.provider}:`, error);
      throw error;
    }
  }

  // Inicializar Supabase (Recomendado)
  async initSupabase() {
    // Sempre usar localStorage durante desenvolvimento/build
    console.warn('Supabase desabilitado para build - usando localStorage');
    this.provider = 'localStorage';
    this.client = null;
  }

  // Inicializar Firebase
  async initFirebase() {
    // Sempre usar localStorage durante desenvolvimento/build
    console.warn('Firebase desabilitado para build - usando localStorage');
    this.provider = 'localStorage';
    this.client = null;
  }

  // Métodos para usuários
  async createUser(userData) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('users')
          .insert([userData])
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Usar localStorage como fallback
        const users = JSON.parse(localStorage.getItem('chegouai_users') || '[]');
        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('chegouai_users', JSON.stringify(users));
        return newUser;
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      } else {
        // Usar localStorage como fallback
        const users = JSON.parse(localStorage.getItem('chegouai_users') || '[]');
        return users.find(u => u.email === email) || null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Métodos para negócios
  async createBusiness(businessData) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('businesses')
          .insert([businessData])
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Usar localStorage como fallback
        const businesses = JSON.parse(localStorage.getItem('chegouai_businesses') || '[]');
        const newBusiness = { ...businessData, id: Date.now().toString() };
        businesses.push(newBusiness);
        localStorage.setItem('chegouai_businesses', JSON.stringify(businesses));
        return newBusiness;
      }
    } catch (error) {
      console.error('Erro ao criar negócio:', error);
      throw error;
    }
  }

  async getBusinessByUserId(userId) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('businesses')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      } else {
        // Usar localStorage como fallback
        const businesses = JSON.parse(localStorage.getItem('chegouai_businesses') || '[]');
        return businesses.find(b => b.user_id === userId) || null;
      }
    } catch (error) {
      console.error('Erro ao buscar negócio:', error);
      throw error;
    }
  }

  // Métodos para produtos
  async createProduct(productData) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('products')
          .insert([productData])
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Usar localStorage como fallback
        const products = JSON.parse(localStorage.getItem('chegouai_products') || '[]');
        const newProduct = { ...productData, id: Date.now().toString() };
        products.push(newProduct);
        localStorage.setItem('chegouai_products', JSON.stringify(products));
        return newProduct;
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  async getProductsByBusinessId(businessId) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('products')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_available', true);
        
        if (error) throw error;
        return data || [];
      } else {
        // Usar localStorage como fallback
        const products = JSON.parse(localStorage.getItem('chegouai_products') || '[]');
        return products.filter(p => p.business_id === businessId && p.is_available !== false) || [];
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  // Métodos para pedidos
  async createOrder(orderData) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('orders')
          .insert([orderData])
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Usar localStorage como fallback
        const orders = JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
        const newOrder = { ...orderData, id: Date.now().toString() };
        orders.push(newOrder);
        localStorage.setItem('chegouai_orders', JSON.stringify(orders));
        return newOrder;
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  async getOrdersByBusinessId(businessId) {
    try {
      if (this.provider === 'supabase' && this.client) {
        const { data, error } = await this.client
          .from('orders')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } else {
        // Usar localStorage como fallback
        const orders = JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
        return orders.filter(o => o.business_id === businessId).sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ) || [];
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }
}

// Instância singleton do banco
let dbInstance = null;

export const getDatabase = (provider = 'supabase') => {
  if (!dbInstance) {
    dbInstance = new CloudDatabase(provider);
  }
  return dbInstance;
};

// Funções de utilidade para facilitar o uso
export const initializeDatabase = async (provider = 'supabase') => {
  const db = getDatabase(provider);
  await db.initialize();
  return db;
};

// Exportar esquema para referência
export { DATABASE_SCHEMA, DATABASE_CONFIGS };

// Instruções de setup para cada provider
export const SETUP_INSTRUCTIONS = {
  supabase: {
    title: "Supabase (Recomendado - PostgreSQL)",
    steps: [
      "1. Acesse https://supabase.com e crie uma conta gratuita",
      "2. Crie um novo projeto",
      "3. Vá em Settings > API e copie a URL e anon key",
      "4. Crie as tabelas usando o SQL Editor com o schema fornecido",
      "5. Configure as variáveis de ambiente no .env"
    ],
    env: [
      "REACT_APP_SUPABASE_URL=https://your-project.supabase.co",
      "REACT_APP_SUPABASE_ANON_KEY=your-anon-key"
    ],
    install: "npm install @supabase/supabase-js"
  },
  
  firebase: {
    title: "Firebase (NoSQL)",
    steps: [
      "1. Acesse https://console.firebase.google.com",
      "2. Crie um novo projeto",
      "3. Ative o Firestore Database",
      "4. Configure as regras de segurança",
      "5. Copie as configurações do projeto"
    ],
    env: [
      "REACT_APP_FIREBASE_API_KEY=your-api-key",
      "REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com",
      "REACT_APP_FIREBASE_PROJECT_ID=your-project-id"
    ],
    install: "npm install firebase"
  }
};

export default CloudDatabase;
