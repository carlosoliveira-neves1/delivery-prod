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

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    await ensureConnection();

    // Permitir login global com qualquer admin de qualquer empresa
    const userRes = await client.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Admin não encontrado' });
    }
    const user = userRes.rows[0];

    // Verificar senha
    const expectedHash = Buffer.from(password + 'tanamao_salt').toString('base64');
    if (user.password_hash !== expectedHash) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Buscar empresa associada
    const companyRes = await client.query('SELECT * FROM companies WHERE id = $1', [user.company_id]);
    if (companyRes.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa associada não encontrada' });
    }
    const company = companyRes.rows[0];

    // Retornar dados de sessão
    const { password_hash, ...userSession } = user;
    const { schema_name, ...companySession } = company;

    return res.status(200).json({
      success: true,
      user: userSession,
      company: companySession
    });
  } catch (err) {
    console.error('API /api/auth/global-login error:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
