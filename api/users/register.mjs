import { Client } from 'pg';

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'delivery_infra',
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
    : undefined,
});

let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { name, email, password, companyCode } = req.body;
  if (!name || !email || !password || !companyCode) {
    return res.status(400).json({ error: 'Nome, e-mail, senha e código da empresa são obrigatórios' });
  }

  try {
    await ensureConnection();

    const normalizedCode = companyCode.trim().toUpperCase();

    // Verificar empresa
    const companyRes = await client.query('SELECT id FROM companies WHERE code = $1', [normalizedCode]);
    if (companyRes.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada para o código informado' });
    }
    const companyId = companyRes.rows[0].id;

    // Verificar e-mail duplicado
    const existingRes = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingRes.rows.length > 0) {
      return res.status(409).json({ error: 'Usuário já existe com este e-mail' });
    }

    // Hash da senha
    const passwordHash = Buffer.from(password + 'tanamao_salt').toString('base64');

    // Inserir usuário
    const insertRes = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, company_id, created_at`,
      [companyId, name, email, passwordHash, 'user']
    );

    const user = insertRes.rows[0];

    return res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('API /api/users/register error:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
