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
      const { name, code, schema_name, description, tax_id, state_registration, legal_name } = req.body;
      if (!name || !code || !tax_id) {
        return res.status(400).json({ error: 'Nome, código e CPF/CNPJ são obrigatórios' });
      }

      const normalizedCode = code.trim().toUpperCase();
      const finalSchemaName = schema_name || normalizedCode;

      // Verificar se já existe empresa com este código
      const conflict = await client.query('SELECT id FROM companies WHERE code = $1', [normalizedCode]);
      if (conflict.rows.length > 0) {
        return res.status(409).json({ error: 'Já existe uma empresa com este código' });
      }

      // Verificar se já existe o schema
      const schemaExists = await client.query(
        'SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1',
        [finalSchemaName]
      );
      
      let schemaCreated = false;
      if (schemaExists.rows.length === 0) {
        // Criar schema
        await client.query(`CREATE SCHEMA "${finalSchemaName}"`);
        schemaCreated = true;
      }

      // Inserir empresa na tabela companies (schema public)
      const insert = await client.query(
        `INSERT INTO companies (name, code, schema_name, description, tax_id, state_registration, legal_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, normalizedCode, finalSchemaName, description, tax_id, state_registration, legal_name]
      );

      const company = insert.rows[0];

      // Se criou schema novo, replicar tabelas e criar admin
      if (schemaCreated) {
        await replicateTablesToSchema(finalSchemaName);
        await createAdminForCompany(company, finalSchemaName);
      } else {
        // Schema já existia, criar admin apenas no schema public
        await createAdminsForCompany(company);
      }

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

async function replicateTablesToSchema(schemaName) {
  const tables = [
    'companies', 'users', 'businesses', 'products', 'orders'
  ];

  for (const table of tables) {
    // Criar tabela no novo schema com mesma estrutura
    await client.query(`
      CREATE TABLE "${schemaName}".${table} 
      (LIKE public.${table} INCLUDING ALL)
    `);
  }
}

async function createAdminForCompany(company, schemaName) {
  const passwordHash = Buffer.from('Carlos190702@@@tanamao_salt').toString('base64');
  const adminEmail = `admin.${company.code}@infratecnologia.com.br`;

  // Inserir admin imutável no schema do tenant
  await client.query(`
    INSERT INTO "${schemaName}".users (company_id, name, email, password_hash, role)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email) DO NOTHING
  `, [
    company.id,
    `${company.name} Admin Imutável`,
    adminEmail,
    passwordHash,
    'admin_imutavel'
  ]);

  // Inserir empresa no schema do tenant
  await client.query(`
    INSERT INTO "${schemaName}".companies (id, name, code, schema_name, description, tax_id, state_registration, legal_name, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id) DO NOTHING
  `, [
    company.id,
    company.name,
    company.code,
    company.schema_name,
    company.description,
    company.tax_id,
    company.state_registration,
    company.legal_name,
    company.created_at
  ]);
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
