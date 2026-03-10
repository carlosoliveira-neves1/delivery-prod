/**
 * Cliente HTTP para chamar as Vercel Functions.
 * Se as variáveis de ambiente não estiverem disponíveis, ele usa localStorage como fallback.
 */

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`Erro na requisição para ${path}:`, err);
    throw err;
  }
}

export const api = {
  // Companies
  async listCompanies() {
    return request('/api/companies');
  },
  async createCompany(payload) {
    return request('/api/companies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Auth
  async login({ email, password, companyCode }) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, companyCode }),
    });
  },

  // Users
  async registerUser({ name, email, password, companyCode }) {
    return request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, companyCode }),
    });
  },
};

export default api;
