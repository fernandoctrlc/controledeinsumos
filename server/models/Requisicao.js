const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Material = require('./Material');

const Requisicao = sequelize.define('Requisicao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  solicitante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  material: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Material,
      key: 'id'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  justificativa: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 500]
    }
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  aprovadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'aprovado_por',
    references: {
      model: User,
      key: 'id'
    }
  },
  dataAprovacao: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_aprovacao'
  },
  motivoRejeicao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'motivo_rejeicao',
    validate: {
      len: [0, 500]
    }
  },
  prioridade: {
    type: DataTypes.ENUM('baixa', 'media', 'alta', 'urgente'),
    allowNull: false,
    defaultValue: 'media'
  },
  dataNecessidade: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'data_necessidade'
  }
}, {
  tableName: 'requisitions'
});

// Relacionamentos
Requisicao.belongsTo(User, { as: 'solicitanteUser', foreignKey: 'solicitante' });
Requisicao.belongsTo(Material, { as: 'materialObj', foreignKey: 'material' });
Requisicao.belongsTo(User, { as: 'aprovadoPorUser', foreignKey: 'aprovadoPor' });

// Hooks
Requisicao.addHook('beforeSave', (requisicao) => {
  if (requisicao.changed('status') && requisicao.status === 'aprovada' && !requisicao.dataAprovacao) {
    requisicao.dataAprovacao = new Date();
  }
});

// Método para aprovar requisição
Requisicao.prototype.aprovar = async function(aprovadorId) {
  this.status = 'aprovada';
  this.aprovadoPor = aprovadorId;
  this.dataAprovacao = new Date();
  return await this.save();
};

// Método para rejeitar requisição
Requisicao.prototype.rejeitar = async function(aprovadorId, motivo) {
  this.status = 'rejeitada';
  this.aprovadoPor = aprovadorId;
  this.dataAprovacao = new Date();
  this.motivoRejeicao = motivo;
  return await this.save();
};

// Método para verificar se pode ser aprovada
Requisicao.prototype.podeSerAprovada = function() {
  return this.status === 'pendente';
};

// Método para verificar se pode ser rejeitada
Requisicao.prototype.podeSerRejeitada = function() {
  return this.status === 'pendente';
};

module.exports = Requisicao; 