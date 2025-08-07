const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Material = require('./Material');

const Movimentacao = sequelize.define('Movimentacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'material_id',
    references: {
      model: Material,
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida', 'ajuste'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantidadeAnterior: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantidade_anterior'
  },
  quantidadeNova: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantidade_nova'
  },
  motivo: {
    type: DataTypes.ENUM(
      'compra', 'doacao', 'devolucao', 'requisicao', 'perda', 
      'vencimento', 'inventario', 'correcao', 'ajuste', 'outro'
    ),
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  realizadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'realizado_por',
    references: {
      model: User,
      key: 'id'
    }
  },
  dataMovimentacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'data_movimentacao'
  }
}, {
  tableName: 'movimentacoes',
  timestamps: true
});

// Relacionamentos
Movimentacao.belongsTo(Material, { as: 'material', foreignKey: 'materialId' });
Movimentacao.belongsTo(User, { as: 'realizadoPorUser', foreignKey: 'realizadoPor' });

// Hooks
Movimentacao.addHook('beforeCreate', (movimentacao) => {
  if (!movimentacao.dataMovimentacao) {
    movimentacao.dataMovimentacao = new Date();
  }
});

// Método para criar movimentação
Movimentacao.criarMovimentacao = async function(dados) {
  return await this.create({
    materialId: dados.materialId,
    tipo: dados.tipo,
    quantidade: parseInt(dados.quantidade),
    quantidadeAnterior: parseInt(dados.quantidadeAnterior),
    quantidadeNova: parseInt(dados.quantidadeNova),
    motivo: dados.motivo,
    observacoes: dados.observacoes,
    realizadoPor: dados.realizadoPor
  });
};

// Método para buscar histórico de um material
Movimentacao.historicoMaterial = async function(materialId, options = {}) {
  const { page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;

  const { count, rows: movimentacoes } = await this.findAndCountAll({
    where: { materialId },
    include: [
      { 
        model: User, 
        as: 'realizadoPorUser', 
        attributes: ['nome', 'email'] 
      },
      { 
        model: Material, 
        as: 'material', 
        attributes: ['nome', 'unidadeDeMedida'] 
      }
    ],
    order: [['dataMovimentacao', 'DESC']],
    offset: offset,
    limit: parseInt(limit)
  });

  return {
    movimentacoes,
    paginacao: {
      pagina: parseInt(page),
      limite: parseInt(limit),
      total: count,
      paginas: Math.ceil(count / limit)
    }
  };
};

module.exports = Movimentacao; 