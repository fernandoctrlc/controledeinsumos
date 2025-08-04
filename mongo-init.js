// Script de inicialização do MongoDB
// Este script é executado quando o container do MongoDB é iniciado pela primeira vez

// Conectar ao banco de dados
db = db.getSiblingDB('almoxarifado');

// Criar usuários de exemplo
db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'almoxarifado' }
  ]
});

// Criar coleções
db.createCollection('users');
db.createCollection('materials');
db.createCollection('requisitions');

// Inserir dados de exemplo
db.users.insertMany([
  {
    nome: 'João Silva',
    email: 'joao.silva@escola.com',
    senha: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8JZqK6e', // senha: 123456
    perfil: 'professor',
    ativo: true,
    ultimoAcesso: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nome: 'Maria Santos',
    email: 'maria.santos@escola.com',
    senha: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8JZqK6e', // senha: 123456
    perfil: 'coordenador',
    ativo: true,
    ultimoAcesso: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@escola.com',
    senha: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8JZqK6e', // senha: 123456
    perfil: 'almoxarife',
    ativo: true,
    ultimoAcesso: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.materials.insertMany([
  {
    nome: 'Papel A4',
    unidadeDeMedida: 'pacote',
    quantidade: 50,
    quantidadeMinima: 10,
    descricao: 'Papel A4 75g, pacote com 500 folhas',
    categoria: 'Papelaria',
    ativo: true,
    criadoPor: db.users.findOne({ perfil: 'almoxarife' })._id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nome: 'Caneta Esferográfica',
    unidadeDeMedida: 'unidade',
    quantidade: 200,
    quantidadeMinima: 50,
    descricao: 'Caneta esferográfica azul, ponta média',
    categoria: 'Papelaria',
    ativo: true,
    criadoPor: db.users.findOne({ perfil: 'almoxarife' })._id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nome: 'Lápis HB',
    unidadeDeMedida: 'unidade',
    quantidade: 150,
    quantidadeMinima: 30,
    descricao: 'Lápis HB número 2',
    categoria: 'Papelaria',
    ativo: true,
    criadoPor: db.users.findOne({ perfil: 'almoxarife' })._id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nome: 'Borracha',
    unidadeDeMedida: 'unidade',
    quantidade: 80,
    quantidadeMinima: 20,
    descricao: 'Borracha branca escolar',
    categoria: 'Papelaria',
    ativo: true,
    criadoPor: db.users.findOne({ perfil: 'almoxarife' })._id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nome: 'Régua',
    unidadeDeMedida: 'unidade',
    quantidade: 60,
    quantidadeMinima: 15,
    descricao: 'Régua de 30cm transparente',
    categoria: 'Material Escolar',
    ativo: true,
    criadoPor: db.users.findOne({ perfil: 'almoxarife' })._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Criar índices para melhor performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ perfil: 1 });
db.users.createIndex({ ativo: 1 });

db.materials.createIndex({ nome: 1 });
db.materials.createIndex({ categoria: 1 });
db.materials.createIndex({ ativo: 1 });
db.materials.createIndex({ quantidade: 1 });

db.requisitions.createIndex({ solicitante: 1 });
db.requisitions.createIndex({ material: 1 });
db.requisitions.createIndex({ status: 1 });
db.requisitions.createIndex({ createdAt: -1 });
db.requisitions.createIndex({ dataNecessidade: 1 });
db.requisitions.createIndex({ prioridade: 1 });

print('✅ Banco de dados inicializado com sucesso!');
print('📊 Dados de exemplo criados:');
print('   - 3 usuários (professor, coordenador, almoxarife)');
print('   - 5 materiais de exemplo');
print('🔑 Senha padrão para todos os usuários: 123456'); 