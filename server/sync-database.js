const { sequelize, syncDatabase } = require('./config/database');
const User = require('./models/User');
const Material = require('./models/Material');
const Requisicao = require('./models/Requisicao');

async function syncAndSeed() {
  try {
    console.log('🔄 Sincronizando banco de dados...');
    
    // Sincronizar todos os modelos
    await sequelize.sync({ force: true }); // force: true vai recriar as tabelas
    
    console.log('✅ Banco de dados sincronizado com sucesso!');
    console.log('📋 Tabelas criadas:');
    console.log('   - users');
    console.log('   - materials');
    console.log('   - requisitions');
    
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar se o arquivo for executado diretamente
if (require.main === module) {
  syncAndSeed();
}

module.exports = syncAndSeed; 