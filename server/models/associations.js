const User = require('./User');
const Material = require('./Material');
const Requisicao = require('./Requisicao');
const Departamento = require('./Departamento');

// Associações do User
User.hasMany(Material, {
  foreignKey: 'criado_por',
  as: 'materiaisCriados'
});

User.hasMany(Requisicao, {
  foreignKey: 'solicitante',
  as: 'requisicoesSolicitadas'
});

User.hasMany(Requisicao, {
  foreignKey: 'aprovado_por',
  as: 'requisicoesAprovadas'
});

User.hasMany(Departamento, {
  foreignKey: 'criadoPor',
  as: 'departamentosCriados'
});

// Associações do Material
Material.belongsTo(User, {
  foreignKey: 'criado_por',
  as: 'criadoPorUser'
});

Material.hasMany(Requisicao, {
  foreignKey: 'material',
  as: 'requisicoes'
});

// Associações da Requisicao
Requisicao.belongsTo(User, {
  foreignKey: 'solicitante',
  as: 'solicitanteUser'
});

Requisicao.belongsTo(User, {
  foreignKey: 'aprovado_por',
  as: 'aprovadoPorUser'
});

Requisicao.belongsTo(Material, {
  foreignKey: 'material',
  as: 'materialObj'
});

Requisicao.belongsTo(Departamento, {
  foreignKey: 'departamento',
  as: 'departamentoObj'
});

// Associações do Departamento
Departamento.belongsTo(User, {
  foreignKey: 'criadoPor',
  as: 'criadoPorUser'
});

Departamento.hasMany(Requisicao, {
  foreignKey: 'departamento',
  as: 'requisicoes'
});

module.exports = {
  User,
  Material,
  Requisicao,
  Departamento
}; 