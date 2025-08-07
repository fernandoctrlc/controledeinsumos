const { sequelize } = require('./server/config/database');

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela materials...');

    // Verificar se a tabela existe
    const [results] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'almoxarifado' 
      AND TABLE_NAME = 'materials'
    `);
    
    if (results.length === 0) {
      console.log('❌ Tabela materials não existe');
      return;
    }

    console.log('✅ Tabela materials existe');

    // Verificar colunas da tabela
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'almoxarifado' 
      AND TABLE_NAME = 'materials'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('📋 Estrutura da tabela materials:');
    console.table(columns);

    // Verificar dados existentes
    const [materials] = await sequelize.query(`
      SELECT id, nome, quantidade, quantidadeMinima 
      FROM materials 
      LIMIT 5
    `);

    console.log('📊 Dados existentes (primeiros 5 registros):');
    console.table(materials);

  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkTableStructure();
}

module.exports = checkTableStructure; 