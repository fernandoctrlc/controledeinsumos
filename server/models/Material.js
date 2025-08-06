const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  unidadeDeMedida: {
    type: DataTypes.ENUM('unidade', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'caixa', 'pacote', 'rolo', 'folha', 'litro', 'quilo', 'metro', 'resma', 'fardo'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  quantidadeMinima: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50]
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  criadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'materials'
});

// Relacionamento com User
Material.belongsTo(User, { as: 'criadoPorUser', foreignKey: 'criadoPor' });

// Método para verificar se está em estoque baixo
Material.prototype.estoqueBaixo = function() {
  return parseFloat(this.quantidade) <= parseFloat(this.quantidadeMinima);
};

// Método para adicionar quantidade ao estoque
Material.prototype.adicionarEstoque = async function(quantidade) {
  this.quantidade = parseFloat(this.quantidade) + parseFloat(quantidade);
  return await this.save();
};

// Método para remover quantidade do estoque
Material.prototype.removerEstoque = async function(quantidade) {
  const novaQuantidade = parseFloat(this.quantidade) - parseFloat(quantidade);
  if (novaQuantidade < 0) {
    throw new Error('Quantidade insuficiente em estoque');
  }
  this.quantidade = novaQuantidade;
  return await this.save();
};

module.exports = Material; 