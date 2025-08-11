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
    allowNull: false,
    field: 'unidade_de_medida'
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  quantidadeMinima: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    },
    field: 'quantidade_minima'
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
    field: 'criado_por',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'materials'
});

// Relacionamento com User - Definido em associations.js

// Método para verificar se está em estoque baixo
Material.prototype.estoqueBaixo = function() {
  return parseInt(this.quantidade) <= parseInt(this.quantidadeMinima);
};

// Método para adicionar quantidade ao estoque
Material.prototype.adicionarEstoque = async function(quantidade) {
  this.quantidade = parseInt(this.quantidade) + parseInt(quantidade);
  return await this.save();
};

// Método para remover quantidade do estoque
Material.prototype.removerEstoque = async function(quantidade) {
  const novaQuantidade = parseInt(this.quantidade) - parseInt(quantidade);
  if (novaQuantidade < 0) {
    throw new Error('Quantidade insuficiente em estoque');
  }
  this.quantidade = novaQuantidade;
  return await this.save();
};

module.exports = Material; 