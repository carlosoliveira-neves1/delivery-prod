// Sistema de banco de dados local para ChegouAí
// Implementação simples usando localStorage
// v1.0 - Funciona 100% offline

class LocalDatabase {
  constructor() {
    this.provider = 'localStorage';
    this.client = null;
    this.isConnected = true;
  }

  async initialize() {
    console.log('✅ Conectado ao localStorage');
    this.isConnected = true;
  }

  generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
  }

  // Métodos para usuários
  async createUser(userData) {
    try {
      const users = JSON.parse(localStorage.getItem('chegouai_users') || '[]');
      const newUser = { 
        ...userData, 
        id: userData.id || Date.now().toString(),
        created_at: userData.created_at || new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('chegouai_users', JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const users = JSON.parse(localStorage.getItem('chegouai_users') || '[]');
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      const users = JSON.parse(localStorage.getItem('chegouai_users') || '[]');
      return users.find(u => u.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      return null;
    }
  }

  // Métodos para negócios
  async createBusiness(businessData) {
    try {
      const businesses = JSON.parse(localStorage.getItem('chegouai_businesses') || '[]');
      const newBusiness = { 
        ...businessData, 
        id: businessData.id || Date.now().toString(),
        created_at: businessData.created_at || new Date().toISOString()
      };
      businesses.push(newBusiness);
      localStorage.setItem('chegouai_businesses', JSON.stringify(businesses));
      return newBusiness;
    } catch (error) {
      console.error('Erro ao criar negócio:', error);
      throw error;
    }
  }

  async getBusinessByUserId(userId) {
    try {
      const businesses = JSON.parse(localStorage.getItem('chegouai_businesses') || '[]');
      return businesses.find(b => b.user_id === userId) || null;
    } catch (error) {
      console.error('Erro ao buscar negócio:', error);
      return null;
    }
  }

  async getBusinessById(id) {
    try {
      const businesses = JSON.parse(localStorage.getItem('chegouai_businesses') || '[]');
      return businesses.find(b => b.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar negócio por ID:', error);
      return null;
    }
  }

  // Métodos para produtos
  async createProduct(productData) {
    try {
      const products = JSON.parse(localStorage.getItem('chegouai_products') || '[]');
      const newProduct = { 
        ...productData, 
        id: productData.id || this.generateId('product'),
        created_at: productData.created_at || new Date().toISOString()
      };
      products.push(newProduct);
      localStorage.setItem('chegouai_products', JSON.stringify(products));
      return newProduct;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  async getProductsByBusinessId(businessId) {
    try {
      const products = JSON.parse(localStorage.getItem('chegouai_products') || '[]');
      return products.filter(p => p.business_id === businessId && p.is_available !== false) || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = JSON.parse(localStorage.getItem('chegouai_products') || '[]');
      return products.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      return null;
    }
  }

  async updateProduct(id, productData) {
    try {
      const products = JSON.parse(localStorage.getItem('chegouai_products') || '[]');
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...productData, updated_at: new Date().toISOString() };
        localStorage.setItem('chegouai_products', JSON.stringify(products));
        return products[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // Métodos para empresas
  async createCompany(companyData) {
    try {
      const companies = JSON.parse(localStorage.getItem('chegouai_companies') || '[]');
      const newCompany = {
        ...companyData,
        id: companyData.id || this.generateId(),
        created_at: companyData.created_at || new Date().toISOString()
      };
      companies.push(newCompany);
      localStorage.setItem('chegouai_companies', JSON.stringify(companies));
      return newCompany;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  }

  async getCompanyById(id) {
    try {
      const companies = JSON.parse(localStorage.getItem('chegouai_companies') || '[]');
      return companies.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar empresa por ID:', error);
      return null;
    }
  }

  async getCompanyByCode(code) {
    try {
      const companies = JSON.parse(localStorage.getItem('chegouai_companies') || '[]');
      return companies.find(c => c.code === code) || null;
    } catch (error) {
      console.error('Erro ao buscar empresa pelo código:', error);
      return null;
    }
  }

  // Métodos para pedidos
  async createOrder(orderData) {
    try {
      const orders = JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
      const newOrder = { 
        ...orderData, 
        id: orderData.id || Date.now().toString(),
        created_at: orderData.created_at || new Date().toISOString()
      };
      orders.push(newOrder);
      localStorage.setItem('chegouai_orders', JSON.stringify(orders));
      return newOrder;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  async getOrdersByBusinessId(businessId) {
    try {
      const orders = JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
      return orders
        .filter(o => o.business_id === businessId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    }
  }

  async getOrderById(id) {
    try {
      const orders = JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
      return orders.find(o => o.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar pedido por ID:', error);
      return null;
    }
  }

  async updateOrder(id, orderData) {
    try {
      const orders = JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
      const index = orders.findIndex(o => o.id === id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...orderData, updated_at: new Date().toISOString() };
        localStorage.setItem('chegouai_orders', JSON.stringify(orders));
        return orders[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  }

  // Métodos utilitários
  async getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem('chegouai_users') || '[]');
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      return [];
    }
  }

  async getAllBusinesses() {
    try {
      return JSON.parse(localStorage.getItem('chegouai_businesses') || '[]');
    } catch (error) {
      console.error('Erro ao buscar todos os negócios:', error);
      return [];
    }
  }

  async getAllProducts() {
    try {
      return JSON.parse(localStorage.getItem('chegouai_products') || '[]');
    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
      return [];
    }
  }

  async getAllOrders() {
    try {
      return JSON.parse(localStorage.getItem('chegouai_orders') || '[]');
    } catch (error) {
      console.error('Erro ao buscar todos os pedidos:', error);
      return [];
    }
  }

  async getAllCompanies() {
    try {
      return JSON.parse(localStorage.getItem('chegouai_companies') || '[]');
    } catch (error) {
      console.error('Erro ao buscar todas as empresas:', error);
      return [];
    }
  }

  // Backup e restore
  async createBackup() {
    try {
      const backup = {
        users: this.getAllUsers(),
        businesses: this.getAllBusinesses(),
        products: this.getAllProducts(),
        orders: this.getAllOrders(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('chegouai_backup', JSON.stringify(backup));
      return backup;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw error;
    }
  }

  async restoreBackup(backup) {
    try {
      localStorage.setItem('chegouai_users', JSON.stringify(backup.users || []));
      localStorage.setItem('chegouai_businesses', JSON.stringify(backup.businesses || []));
      localStorage.setItem('chegouai_products', JSON.stringify(backup.products || []));
      localStorage.setItem('chegouai_orders', JSON.stringify(backup.orders || []));
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw error;
    }
  }

  // Limpar dados
  async clearAll() {
    try {
      localStorage.removeItem('chegouai_users');
      localStorage.removeItem('chegouai_businesses');
      localStorage.removeItem('chegouai_products');
      localStorage.removeItem('chegouai_orders');
      localStorage.removeItem('chegouai_companies');
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }
}

// Instância singleton do banco
let dbInstance = null;

export const getDatabase = () => {
  if (!dbInstance) {
    dbInstance = new LocalDatabase();
  }
  return dbInstance;
};

export const initializeDatabase = async () => {
  const db = getDatabase();
  await db.initialize();
  return db;
};

export default LocalDatabase;
