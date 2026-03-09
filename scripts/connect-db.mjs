import dotenv from 'dotenv';
import { Client } from 'pg';

// Load .env if present (ignored by git)
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const REQUIRED_ENV = ['DB_HOST', 'DB_USER', 'DB_PASSWORD'];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);

if (missingEnv.length) {
  console.error(`Missing required DB variables: ${missingEnv.join(', ')}`);
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

async function runChecks() {
  try {
    await client.connect();
    console.log(`✅ Conectado a ${client.host}:${client.port} (${client.database})`);

    const query = process.env.DB_HEALTH_CHECK || 'SELECT now() AS current_time';
    const result = await client.query(query);

    console.log('✅ Health check resultado:', result.rows[0]);
  } catch (error) {
    console.error('❌ Falha ao conectar ou executar query:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runChecks();
