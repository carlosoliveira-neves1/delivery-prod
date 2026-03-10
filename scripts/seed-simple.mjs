import dotenv from 'dotenv';
import { Client } from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

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

async function seed() {
  await client.connect();
  console.log('✅ Conectado ao banco');

  // Criar empresa
  const companyRes = await client.query(
    `INSERT INTO companies (name, code, schema_name, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    ['Padaria Piloto', 'PADARIA001', 'public', 'Empresa demo para login']
  );
  const company = companyRes.rows[0];
  console.log('✅ Empresa criada:', company);

  // Hash da senha (btoa(senha + 'tanamao_salt'))
  const passwordHash = Buffer.from('Carlos190702@@tanamao_salt').toString('base64');

  // Criar admin
  const userRes = await client.query(
    `INSERT INTO users (company_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, company_id, created_at`,
    [company.id, `${company.name} Admin`, 'padaria001@teste.com', passwordHash, 'admin']
  );
  const user = userRes.rows[0];
  console.log('✅ Admin criado:', user);

  await client.end();
  console.log('🎉 Seed concluído. Use em /Login:');
  console.log('  E-mail: padaria001@teste.com');
  console.log('  Senha: Carlos190702@@@');
  console.log('  Código: PADARIA001');
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
