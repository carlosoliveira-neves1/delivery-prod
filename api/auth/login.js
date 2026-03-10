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

  const { email, password, companyCode } = req.body;
  if (!email || !password || !companyCode) {
    return res.status(400).json({ error: 'E-mail, senha e código da empresa são obrigatórios' });
  }

  try {
    await ensureConnection();

    const normalizedCode = companyCode.trim().toUpperCase();

    // Buscar empresa
    const companyRes = await client.query('SELECT * FROM companies WHERE code = $1', [normalizedCode]);
    if (companyRes.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada para o código informado' });
    }
    const company = companyRes.rows[0];

    // Buscar usuário
    const userRes = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const user = userRes.rows[0];

    // Verificar senha (hash simples btoa(senha + 'tanamao_salt'))
    const expectedHash = Buffer.from(password + 'tanamao_salt').toString('base64');
    if (user.password_hash !== expectedHash) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Verificar se usuário pertence à empresa
    if (user.company_id !== company.id) {
      return res.status(403).json({ error: 'Usuário não pertence a esta empresa' });
    }

    // Retornar dados de sessão (sem hash)
    const { password_hash, ...userSession } = user;
    const { schema_name, ...companySession } = company;

    return res.status(200).json({
      success: true,
      user: userSession,
      company: companySession
    });
  } catch (err) {
    console.error('API /api/auth/login error:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
