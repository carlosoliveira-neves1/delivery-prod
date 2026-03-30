// Script de limpeza automática de negócios trial expirados
// Execute com: node cleanup-trials.mjs
// Agende no cron: 0 2 * * * cd /caminho/do/projeto && node cleanup-trials.mjs

import { initializeUserService } from './src/lib/userService.js';

async function cleanupExpiredTrials() {
  console.log('🧹 Iniciando limpeza de negócios trial expirados...');
  console.log(`⏰ Data/hora: ${new Date().toISOString()}`);
  
  try {
    const userService = await initializeUserService();
    
    // Limpar negócios expirados
    const deletedCount = await userService.cleanupExpiredTrials();
    
    if (deletedCount > 0) {
      console.log(`✅ ${deletedCount} negócio(s) trial expirado(s) removido(s) com sucesso.`);
    } else {
      console.log('ℹ️ Nenhum negócio trial expirado encontrado.');
    }
    
    console.log('🎉 Limpeza concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupExpiredTrials();
}

export { cleanupExpiredTrials };
