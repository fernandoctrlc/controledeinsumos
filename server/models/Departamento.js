const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Departamento = sequelize.define('Departamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  sigla: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 10]
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsavel: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  criadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'departamentos',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['nome']
    },
    {
      unique: true,
      fields: ['sigla']
    },
    {
      fields: ['ativo']
    }
  ]
});

// Hooks
Departamento.beforeCreate(async (departamento) => {
  // Capitalizar nome e sigla
  if (departamento.nome) {
    departamento.nome = departamento.nome.trim().replace(/\b\w/g, l => l.toUpperCase());
  }
  if (departamento.sigla) {
    departamento.sigla = departamento.sigla.trim().toUpperCase();
  }
});

Departamento.beforeUpdate(async (departamento) => {
  // Capitalizar nome e sigla
  if (departamento.changed('nome') && departamento.nome) {
    departamento.nome = departamento.nome.trim().replace(/\b\w/g, l => l.toUpperCase());
  }
  if (departamento.changed('sigla') && departamento.sigla) {
    departamento.sigla = departamento.sigla.trim().toUpperCase();
  }
});

// Métodos de instância
Departamento.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

// Métodos estáticos
Departamento.buscarPorNome = async function(nome) {
  return await this.findOne({
    where: {
      nome: { [sequelize.Op.iLike]: `%${nome}%` },
      ativo: true
    }
  });
};

Departamento.buscarPorSigla = async function(sigla) {
  return await this.findOne({
    where: {
      sigla: { [sequelize.Op.iLike]: `%${sigla}%` },
      ativo: true
    }
  });
};

module.exports = Departamento; 