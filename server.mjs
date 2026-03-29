import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 4173;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL
const pgClient = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

pgClient.connect().then(() => {
  console.log('✅ Conectado ao PostgreSQL Locaweb');
}).catch(err => {
  console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
});

// Helper para hash de senha
function hashPassword(password) {
  return Buffer.from(password + 'tanamao_salt').toString('base64');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// API Routes

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, companyCode } = req.body;

    if (!email || !password || !companyCode) {
      return res.status(400).json({ error: 'Email, password e companyCode são obrigatórios' });
    }

    const schema = process.env.DB_SCHEMA || 'delivery';
    
    // Buscar usuário
    const userQuery = `
      SELECT u.id, u.name, u.email, u.password_hash, u.role, u.company_id, c.code
      FROM ${schema}.users u
      JOIN ${schema}.companies c ON u.company_id = c.id
      WHERE u.email = $1 AND c.code = $2
    `;

    const result = await pgClient.query(userQuery, [email, companyCode]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou empresa inválidos' });
    }

    const user = result.rows[0];

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyCode: user.code,
      },
      company: {
        id: user.company_id,
        code: user.code,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao processar login' });
  }
});

// Global Login (Admin)
app.post('/api/auth/global-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    const schema = process.env.DB_SCHEMA || 'delivery';

    const userQuery = `
      SELECT u.id, u.name, u.email, u.password_hash, u.role, u.company_id, c.code
      FROM ${schema}.users u
      JOIN ${schema}.companies c ON u.company_id = c.id
      WHERE u.email = $1 AND u.role = 'admin'
    `;

    const result = await pgClient.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Admin não encontrado' });
    }

    const user = result.rows[0];

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyCode: user.code,
      },
      company: {
        id: user.company_id,
        code: user.code,
      },
    });
  } catch (error) {
    console.error('Erro no global login:', error);
    res.status(500).json({ error: 'Erro ao processar login' });
  }
});

// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, companyCode } = req.body;

    if (!name || !email || !password || !companyCode) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const schema = process.env.DB_SCHEMA || 'delivery';
    const passwordHash = hashPassword(password);

    // Buscar empresa
    const companyQuery = `SELECT id FROM ${schema}.companies WHERE code = $1`;
    const companyResult = await pgClient.query(companyQuery, [companyCode]);

    if (companyResult.rows.length === 0) {
      return res.status(400).json({ error: 'Empresa não encontrada' });
    }

    const companyId = companyResult.rows[0].id;

    // Criar usuário
    const userQuery = `
      INSERT INTO ${schema}.users (company_id, name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, 'user', true)
      RETURNING id, name, email, role
    `;

    const userResult = await pgClient.query(userQuery, [companyId, name, email, passwordHash]);
    const newUser = userResult.rows[0];

    res.json({
      success: true,
      user: newUser,
      company: { id: companyId, code: companyCode },
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// Servir arquivos estáticos do Vite
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});
