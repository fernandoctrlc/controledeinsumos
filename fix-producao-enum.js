const { sequelize } = require('./server/config/database');

async function fixProducaoEnum() {
  try {
    console.log('🔧 Corrigindo ENUM no banco de produção...\n');

    // 1. Verificar estrutura atual
    console.log('1. Verificando estrutura atual...');
    const [results] = await sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'almoxarifado' 
      AND TABLE_NAME = 'materials' 
      AND COLUMN_NAME = 'unidade_de_medida'
    `);
    
    if (results.length > 0) {
      console.log('📋 ENUM atual:', results[0].COLUMN_TYPE);
    }
    console.log('');

    // 2. Alterar o ENUM para incluir novos valores
    console.log('2. Alterando ENUM...');
    await sequelize.query(`
      ALTER TABLE materials 
      MODIFY COLUMN unidade_de_medida ENUM(
        'unidade', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'caixa', 'pacote', 'rolo', 'folha', 
        'litro', 'quilo', 'metro', 'resma', 'fardo'
      ) NOT NULL
    `);
    console.log('✅ ENUM atualizado com sucesso!');
    console.log('');

    // 3. Verificar nova estrutura
    console.log('3. Verificando nova estrutura...');
    const [newResults] = await sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'almoxarifado' 
      AND TABLE_NAME = 'materials' 
      AND COLUMN_NAME = 'unidade_de_medida'
    `);
    
    if (newResults.length > 0) {
      console.log('📋 Novo ENUM:', newResults[0].COLUMN_TYPE);
    }
    console.log('');

    // 4. Testar inserção
    console.log('4. Testando inserção...');
    await sequelize.query(`
      INSERT INTO materials (nome, unidade_de_medida, quantidade, quantidade_minima, descricao, categoria, ativo, criado_por, created_at, updated_at)
      VALUES ('Teste ENUM', 'litro', 10, 5, 'Teste de ENUM corrigido', 'Teste', true, 1, NOW(), NOW())
    `);
    console.log('✅ Inserção de teste realizada com sucesso!');
    console.log('');

    // 5. Limpar teste
    console.log('5. Limpando teste...');
    await sequelize.query(`
      DELETE FROM materials WHERE nome = 'Teste ENUM'
    `);
    console.log('✅ Teste removido!');
    console.log('');

    console.log('🎉 ENUM corrigido com sucesso! O banco de produção está pronto.');

  } catch (error) {
    console.error('❌ Erro ao corrigir ENUM:', error.message);
    console.error('📋 Detalhes:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar se o arquivo for executado diretamente
if (require.main === module) {
  fixProducaoEnum();
}

module.exports = fixProducaoEnum; 