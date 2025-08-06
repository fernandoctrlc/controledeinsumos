const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'almoxarifado',
  process.env.DB_USER || 'almoxarifado_user',
  process.env.DB_PASS || 'Almoxarifado123!',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao MySQL');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error);
  }
};

// Função para sincronizar os modelos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Banco de dados sincronizado');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
}; 