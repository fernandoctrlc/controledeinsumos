const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração do banco
const sequelize = new Sequelize(
  process.env.DB_NAME || 'almoxarifado',
  process.env.DB_USER || 'almoxarifado_user',
  process.env.DB_PASSWORD || 'Almoxarifado123!',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

async function addDepartamentoToRequisitions() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Adicionar campo departamento na tabela requisições
    console.log('🏗️ Adicionando campo departamento na tabela requisições...');
    
    const alterQuery = `
      ALTER TABLE requisitions 
      ADD COLUMN departamento INT NULL,
      ADD INDEX idx_departamento (departamento),
      ADD CONSTRAINT fk_requisicao_departamento 
      FOREIGN KEY (departamento) REFERENCES departamentos(id) 
      ON DELETE SET NULL;
    `;

    try {
      await sequelize.query(alterQuery);
      console.log('✅ Campo departamento adicionado com sucesso!');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Campo departamento já existe na tabela requisições');
      } else {
        throw error;
      }
    }

    // Verificar estrutura da tabela
    console.log('🔍 Verificando estrutura da tabela requisitions...');
    const [results] = await sequelize.query('DESCRIBE requisitions');
    console.log('📊 Estrutura da tabela requisições:');
    results.forEach(row => {
      console.log(`  - ${row.Field}: ${row.Type} ${row.Null === 'NO' ? '(NOT NULL)' : ''} ${row.Key === 'PRI' ? '(PRIMARY KEY)' : ''} ${row.Key === 'UNI' ? '(UNIQUE)' : ''}`);
    });

    // Atualizar algumas requisições existentes com departamentos padrão
    console.log('📝 Atualizando requisições existentes com departamentos padrão...');
    
    const updateQuery = `
      UPDATE requisitions 
      SET departamento = 1 
      WHERE departamento IS NULL 
      LIMIT 10;
    `;

    try {
      const [updateResult] = await sequelize.query(updateQuery);
      console.log(`✅ ${updateResult.affectedRows} requisições atualizadas com departamento padrão`);
    } catch (error) {
      console.log('⚠️ Erro ao atualizar requisições existentes:', error.message);
    }

    console.log('\n🎉 Campo departamento adicionado com sucesso!');
    console.log('📋 Próximos passos:');
    console.log('   1. Atualizar formulários de requisição para incluir seleção de departamento');
    console.log('   2. Atualizar APIs para incluir campo departamento');
    console.log('   3. Testar criação de requisições com departamento');

  } catch (error) {
    console.error('❌ Erro ao adicionar campo departamento:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão com o banco fechada.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  addDepartamentoToRequisitions();
}

module.exports = { addDepartamentoToRequisitions }; 