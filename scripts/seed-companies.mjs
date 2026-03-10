import dotenv from 'dotenv';
import { initializeUserService, getUserService } from '../src/lib/userService.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Polyfill import.meta.env for Node
globalThis.import = { meta: { env: process.env } };

console.log('seed: env', { VITE_DB_HOST: process.env.VITE_DB_HOST });

if (typeof localStorage === 'undefined') {
  globalThis.localStorage = (() => {
    const store = new Map();
    return {
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      setItem(key, value) {
        store.set(key, value);
      },
      removeItem(key) {
        store.delete(key);
      }
    };
  })();
}

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const sampleCompanies = [
  {
    name: 'Padaria Piloto',
    code: 'PADARIA001',
    schema_name: 'padaria_padaria001',
    description: 'Empresa piloto para testar o fluxo multitenant'
  },
  {
    name: 'Bistrô Central',
    code: 'BISTRO002',
    schema_name: 'bistro_bistro002',
    description: 'Bistrô interno com schema próprio'
  },
  {
    name: 'Restaurante Nova',
    code: 'RESTAURANTE003',
    schema_name: 'restaurante_restaurante003',
    description: 'Restaurante de teste com cardápio completo'
  }
];

async function seedCompanies() {
  await initializeUserService();
  const service = getUserService();

  for (const company of sampleCompanies) {
    try {
      const created = await service.registerCompany(company);
      console.log(`✅ Empresa criada: ${created.name} (${created.code})`);
      console.log(`   Admin: admin+${created.code.toLowerCase()}@teste.com / Carlos190702@@@`);
    } catch (error) {
      console.warn(`⚠️ Empresa ${company.code} não registrada: ${error.message}`);
    }
  }

  console.log('\nSeed finalizado.');
}

seedCompanies().catch((error) => {
  console.error('Erro ao rodar seed:', error);
  process.exitCode = 1;
});
