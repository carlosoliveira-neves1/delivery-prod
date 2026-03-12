// Cole este script no console do navegador (http://localhost:5173)
(async () => {
  const { getUserService } = await import('./src/lib/userService.js');
  const service = getUserService();

  const company = await service.registerCompany({
    name: 'Delivery Admin',
    code: 'DELIVERY001',
    schema_name: 'public',
    description: 'Admin global para Login e AdminLogin'
  });
  console.log('✅ Empresa criada:', company);

  console.log('🎉 Agora use em /Login:');
  console.log('  E-mail: admin@delivery.com');
  console.log('  Senha: Carlos190702@@@');
  console.log('  Código: DELIVERY001');
})();
