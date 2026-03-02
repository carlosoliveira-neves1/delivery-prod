// Serviço para gerenciar usuários e autenticação

class UserService {
  constructor() {
    this.db = null;
    this.currentUser = null;
  }

  async initialize() {
    try {
      const { getDatabase } = await import('./localDatabase');
      this.db = getDatabase();
      await this.db.initialize();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  // Gerar hash simples para senha (em produção usar bcrypt)
  hashPassword(password) {
    return btoa(password + 'tanamao_salt');
  }

  // Verificar senha
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  // Registrar novo usuário
  async registerUser(userData) {
    try {
      const { name, email, password, businessData } = userData;
      
      // Verificar se usuário já existe
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('Usuário já existe com este email');
      }

      const userId = this.generateId();
      const passwordHash = this.hashPassword(password);

      const newUser = {
        id: userId,
        name,
        email,
        password_hash: passwordHash,
        role: 'user',
        created_at: new Date().toISOString()
      };

      // Salvar usuário
      if (this.db && this.db.client) {
        await this.db.createUser(newUser);
      } else {
        // Fallback para localStorage
        const users = this.getLocalUsers();
        users.push(newUser);
        localStorage.setItem('tanamao_users', JSON.stringify(users));
      }

      // Criar negócio se fornecido
      if (businessData) {
        await this.createUserBusiness(userId, businessData);
      }

      return { success: true, user: { id: userId, name, email, role: 'user' } };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return { success: false, error: error.message };
    }
  }

  // Login do usuário
  async loginUser(email, password) {
    try {
      const user = await this.getUserByEmail(email);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!this.verifyPassword(password, user.password_hash)) {
        throw new Error('Senha incorreta');
      }

      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      // Salvar sessão
      localStorage.setItem('tanamao_current_user', JSON.stringify(this.currentUser));

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar usuário por email
  async getUserByEmail(email) {
    try {
      if (this.db && this.db.client) {
        return await this.db.getUserByEmail(email);
      } else {
        // Fallback para localStorage
        const users = this.getLocalUsers();
        return users.find(user => user.email === email) || null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      // Em caso de erro, sempre tentar localStorage
      const users = this.getLocalUsers();
      return users.find(user => user.email === email) || null;
    }
  }

  // Criar negócio do usuário
  async createUserBusiness(userId, businessData) {
    try {
      const businessId = this.generateId();
      
      const newBusiness = {
        id: businessId,
        user_id: userId,
        business_name: businessData.name,
        business_type: businessData.type,
        description: businessData.description,
        phone: businessData.phone,
        address: businessData.address,
        template_config: businessData.template,
        is_active: true,
        created_at: new Date().toISOString()
      };

      await this.db.createBusiness(newBusiness);

      return newBusiness;
    } catch (error) {
      console.error('Erro ao criar negócio:', error);
      throw error;
    }
  }

  // Buscar negócio do usuário
  async getUserBusiness(userId) {
    try {
      return await this.db.getBusinessByUserId(userId);
    } catch (error) {
      console.error('Erro ao buscar negócio:', error);
      return null;
    }
  }

  // Obter usuário atual
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Tentar recuperar da sessão
    const savedUser = localStorage.getItem('tanamao_current_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      return this.currentUser;
    }

    return null;
  }

  // Logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem('tanamao_current_user');
    localStorage.removeItem('userBusinessConfig');
    localStorage.removeItem('businessConfigured');
  }

  // Métodos auxiliares para localStorage
  getLocalUsers() {
    const users = localStorage.getItem('tanamao_users');
    return users ? JSON.parse(users) : [];
  }

  getLocalBusinesses() {
    const businesses = localStorage.getItem('tanamao_businesses');
    return businesses ? JSON.parse(businesses) : [];
  }

  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Verificar se usuário está logado
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Verificar se usuário é admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Obter estatísticas dos usuários (para admin)
  async getUserStats() {
    try {
      const users = this.getLocalUsers();
      const businesses = this.getLocalBusinesses();

      return {
        totalUsers: users.length,
        totalBusinesses: businesses.length,
        activeBusinesses: businesses.filter(b => b.is_active).length,
        businessTypes: this.getBusinessTypeStats(businesses)
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }

  getBusinessTypeStats(businesses) {
    const stats = {};
    businesses.forEach(business => {
      const type = business.business_type;
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }
}

// Instância singleton
let userServiceInstance = null;

export const getUserService = () => {
  if (!userServiceInstance) {
    userServiceInstance = new UserService();
  }
  return userServiceInstance;
};

export const initializeUserService = async () => {
  const service = getUserService();
  await service.initialize();
  return service;
};

export default UserService;
