import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('apply-schema: loaded env', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'MISSING',
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

const REQUIRED_ENV = ['DB_HOST', 'DB_USER', 'DB_PASSWORD'];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);

if (missingEnv.length) {
  console.error(`Variáveis obrigatórias faltando: ${missingEnv.join(', ')}`);
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

const schemaScriptPath = new URL('../docs/db-schema.sql', import.meta.url);

async function applySchema() {
  try {
    await client.connect();
    console.log('Conectado ao banco. Aplicando schema público...');

    const schemaSql = await fs.readFile(schemaScriptPath, { encoding: 'utf-8' });
    await client.query(schemaSql);
    console.log('Schema base aplicado com sucesso.');

    const extraSchemas = (process.env.DB_EXTRA_SCHEMAS ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    for (const raw of extraSchemas) {
      const sanitized = raw.replace(/[^a-zA-Z0-9_]/g, '_');
      if (!sanitized) continue;
      console.log(`Criando schema adicional: ${sanitized}`);
      await client.query(`CREATE SCHEMA IF NOT EXISTS "${sanitized}"`);
    }

    if (extraSchemas.length) {
      console.log('Schemas adicionais criados com sucesso.');
    }

    console.log('Todos os esquemas foram aplicados.');
  } catch (error) {
    console.error('Erro ao aplicar schema:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

applySchema();
