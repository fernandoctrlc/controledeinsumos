const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuração do banco
const sequelize = new Sequelize(
  process.env.DB_NAME || 'controledeinsumos',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

async function createDepartamentosTable() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Criar tabela de departamentos
    console.log('🏗️ Criando tabela de departamentos...');
    
    const query = `
      CREATE TABLE IF NOT EXISTS departamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE,
        sigla VARCHAR(10) NOT NULL UNIQUE,
        descricao TEXT,
        responsavel VARCHAR(100),
        email VARCHAR(100),
        telefone VARCHAR(20),
        ativo BOOLEAN NOT NULL DEFAULT TRUE,
        criadoPor INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_nome (nome),
        INDEX idx_sigla (sigla),
        INDEX idx_ativo (ativo),
        INDEX idx_criadoPor (criadoPor),
        
        FOREIGN KEY (criadoPor) REFERENCES users(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await sequelize.query(query);
    console.log('✅ Tabela de departamentos criada com sucesso!');

    // Inserir alguns departamentos de exemplo
    console.log('📝 Inserindo departamentos de exemplo...');
    
    const insertQuery = `
      INSERT IGNORE INTO departamentos (nome, sigla, descricao, responsavel, email, telefone, ativo, criadoPor) VALUES
      ('Departamento de Matemática', 'DMAT', 'Responsável pelas disciplinas de matemática e estatística', 'Prof. João Silva', 'matematica@escola.com', '(11) 99999-9999', TRUE, 1),
      ('Departamento de Português', 'DPORT', 'Responsável pelas disciplinas de português e literatura', 'Prof. Maria Santos', 'portugues@escola.com', '(11) 88888-8888', TRUE, 1),
      ('Departamento de Ciências', 'DCIEN', 'Responsável pelas disciplinas de física, química e biologia', 'Prof. Carlos Oliveira', 'ciencias@escola.com', '(11) 77777-7777', TRUE, 1),
      ('Departamento de História', 'DHIST', 'Responsável pelas disciplinas de história e geografia', 'Prof. Ana Costa', 'historia@escola.com', '(11) 66666-6666', TRUE, 1),
      ('Departamento de Educação Física', 'DEFIS', 'Responsável pelas disciplinas de educação física e esportes', 'Prof. Pedro Lima', 'edfisica@escola.com', '(11) 55555-5555', TRUE, 1);
    `;

    await sequelize.query(insertQuery);
    console.log('✅ Departamentos de exemplo inseridos com sucesso!');

    // Verificar estrutura da tabela
    console.log('🔍 Verificando estrutura da tabela...');
    const [results] = await sequelize.query('DESCRIBE departamentos');
    console.log('📊 Estrutura da tabela departamentos:');
    results.forEach(row => {
      console.log(`  - ${row.Field}: ${row.Type} ${row.Null === 'NO' ? '(NOT NULL)' : ''} ${row.Key === 'PRI' ? '(PRIMARY KEY)' : ''} ${row.Key === 'UNI' ? '(UNIQUE)' : ''}`);
    });

    console.log('\n🎉 Tabela de departamentos criada e configurada com sucesso!');
    console.log('📋 Departamentos de exemplo inseridos:');
    console.log('   - DMAT: Departamento de Matemática');
    console.log('   - DPORT: Departamento de Português');
    console.log('   - DCIEN: Departamento de Ciências');
    console.log('   - DHIST: Departamento de História');
    console.log('   - DEFIS: Departamento de Educação Física');

  } catch (error) {
    console.error('❌ Erro ao criar tabela de departamentos:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão com o banco fechada.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createDepartamentosTable();
}

module.exports = { createDepartamentosTable }; 