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
  const { method } = req;

  try {
    await ensureConnection();

    if (method === 'GET') {
      const result = await client.query('SELECT * FROM companies ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    if (method === 'POST') {
      const { name, code, schema_name = 'public', description } = req.body;
      if (!name || !code) {
        return res.status(400).json({ error: 'Nome e código são obrigatórios' });
      }

      const normalizedCode = code.trim().toUpperCase();

      const conflict = await client.query('SELECT id FROM companies WHERE code = $1', [normalizedCode]);
      if (conflict.rows.length > 0) {
        return res.status(409).json({ error: 'Já existe uma empresa com este código' });
      }

      const insert = await client.query(
        `INSERT INTO companies (name, code, schema_name, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, normalizedCode, schema_name, description]
      );

      const company = insert.rows[0];

      // Criar admins padrão
      await createAdminsForCompany(company);

      return res.status(201).json(company);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
  } catch (err) {
    console.error('API /api/companies error:', err);
    return res.status(500).json({ error: 'Erro interno' });
  } finally {
    // Não desconectar aqui para reuso entre requisições (serverless pode manter warm)
  }
}

async function createAdminsForCompany(company) {
  const passwordHash = Buffer.from('Carlos190702@@@tanamao_salt').toString('base64');
  const emails = [
    `admin+${company.code.toLowerCase()}@teste.com`,
    `${company.code.toLowerCase()}@teste.com`
  ];

  for (const email of emails) {
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length === 0) {
      await client.query(
        `INSERT INTO users (company_id, name, email, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [company.id, `${company.name} Admin`, email, passwordHash, 'admin']
      );
    }
  }
}
