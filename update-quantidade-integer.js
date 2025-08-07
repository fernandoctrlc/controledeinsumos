const { sequelize } = require('./server/config/database');

async function updateQuantidadeToInteger() {
  try {
    console.log('🔄 Atualizando campos de quantidade para INTEGER...');

    // Atualizar tabela materials
    await sequelize.query(`
      ALTER TABLE materials 
      MODIFY COLUMN quantidade INT NOT NULL DEFAULT 0,
      MODIFY COLUMN quantidade_minima INT NOT NULL DEFAULT 0
    `);
    console.log('✅ Tabela materials atualizada');

    // Atualizar tabela requisitions
    await sequelize.query(`
      ALTER TABLE requisitions 
      MODIFY COLUMN quantidade INT NOT NULL
    `);
    console.log('✅ Tabela requisitions atualizada');

    // Atualizar tabela movimentacoes (se existir)
    try {
      await sequelize.query(`
        ALTER TABLE movimentacoes 
        MODIFY COLUMN quantidade INT NOT NULL,
        MODIFY COLUMN quantidade_anterior INT NOT NULL,
        MODIFY COLUMN quantidade_nova INT NOT NULL
      `);
      console.log('✅ Tabela movimentacoes atualizada');
    } catch (error) {
      console.log('⚠️ Tabela movimentacoes ainda não existe, será criada automaticamente');
    }

    // Converter valores existentes para inteiros
    await sequelize.query(`
      UPDATE materials 
      SET quantidade = CAST(quantidade AS UNSIGNED),
          quantidade_minima = CAST(quantidade_minima AS UNSIGNED)
    `);
    console.log('✅ Valores convertidos para inteiros');

    await sequelize.query(`
      UPDATE requisitions 
      SET quantidade = CAST(quantidade AS UNSIGNED)
    `);
    console.log('✅ Valores de requisições convertidos para inteiros');

    console.log('🎉 Atualização concluída com sucesso!');
    console.log('📊 Agora as quantidades não terão mais casas decimais desnecessárias');

  } catch (error) {
    console.error('❌ Erro ao atualizar banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateQuantidadeToInteger();
}

module.exports = updateQuantidadeToInteger; 