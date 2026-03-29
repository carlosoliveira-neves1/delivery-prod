import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('🔧 Setup Database - ChegouAí Delivery');
console.log('=====================================\n');

const REQUIRED_ENV = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);

if (missingEnv.length) {
  console.error(`❌ Variáveis obrigatórias faltando: ${missingEnv.join(', ')}`);
  process.exit(1);
}

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

async function setupDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    // 1. Criar schema chegouai
    console.log('📦 Criando schema chegouai...');
    await client.query('CREATE SCHEMA IF NOT EXISTS chegouai');
    console.log('✅ Schema chegouai criado\n');

    // 2. Aplicar schema SQL
    console.log('📋 Aplicando schema de tabelas...');
    const schemaSqlPath = path.resolve(__dirname, '../docs/db-schema-new.sql');
    const schemaSql = await fs.readFile(schemaSqlPath, { encoding: 'utf-8' });
    await client.query(schemaSql);
    console.log('✅ Schema de tabelas aplicado\n');

    // 3. Aplicar seed data
    console.log('🌱 Inserindo dados de teste...');
    const seedSqlPath = path.resolve(__dirname, '../docs/db-seed-data.sql');
    const seedSql = await fs.readFile(seedSqlPath, { encoding: 'utf-8' });
    await client.query(seedSql);
    console.log('✅ Dados de teste inseridos\n');

    // 4. Verificar dados
    console.log('🔍 Verificando dados inseridos...');
    const companiesResult = await client.query('SELECT COUNT(*) FROM chegouai.companies');
    const usersResult = await client.query('SELECT COUNT(*) FROM chegouai.users');
    const productsResult = await client.query('SELECT COUNT(*) FROM chegouai.products');
    
    console.log(`   - Empresas: ${companiesResult.rows[0].count}`);
    console.log(`   - Usuários: ${usersResult.rows[0].count}`);
    console.log(`   - Produtos: ${productsResult.rows[0].count}\n`);

    console.log('=====================================');
    console.log('✅ Setup do banco concluído com sucesso!');
    console.log('=====================================\n');
    
    console.log('📝 Credenciais de Teste:');
    console.log('   Email Admin: admin@chegouai.com');
    console.log('   Email Usuário: usuario@chegouai.com');
    console.log('   Senha: teste12345678');
    console.log('   Código Empresa: PAD001\n');

  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

setupDatabase();
