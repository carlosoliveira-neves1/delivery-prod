// Seed para localStorage (dev)
import { initializeUserService, getUserService } from '../src/lib/userService.js';

// Polyfill import.meta.env for Node
globalThis.import = { meta: { env: {} } };

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

async function seed() {
  await initializeUserService();
  const service = getUserService();

  // Criar empresa
  const company = await service.registerCompany({
    name: 'Delivery Admin',
    code: 'DELIVERY001',
    schema_name: 'public',
    description: 'Admin global para Login e AdminLogin'
  });
  console.log('✅ Empresa criada:', company);

  console.log('🎉 Seed concluído. Use em /Login:');
  console.log('  E-mail: admin@delivery.com');
  console.log('  Senha: Carlos190702@@@');
  console.log('  Código: DELIVERY001');
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
