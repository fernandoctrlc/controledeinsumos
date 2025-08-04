const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Material = require('../models/Material');
const Requisicao = require('../models/Requisicao');
const { sequelize } = require('../config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Hash da senha padrão
    const senhaHash = await bcrypt.hash('123456', 12);

    // Criar usuários de exemplo
    const users = await User.bulkCreate([
      {
        nome: 'João Silva',
        email: 'joao.silva@escola.com',
        senha: senhaHash,
        perfil: 'professor',
        ativo: true
      },
      {
        nome: 'Maria Santos',
        email: 'maria.santos@escola.com',
        senha: senhaHash,
        perfil: 'coordenador',
        ativo: true
      },
      {
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@escola.com',
        senha: senhaHash,
        perfil: 'almoxarife',
        ativo: true
      }
    ]);

    console.log('✅ Usuários criados:', users.length);

    // Buscar o almoxarife para usar como criadoPor
    const almoxarife = await User.findOne({ where: { perfil: 'almoxarife' } });

    // Criar materiais de exemplo
    const materials = await Material.bulkCreate([
      {
        nome: 'Papel A4',
        unidadeDeMedida: 'pacote',
        quantidade: 50,
        quantidadeMinima: 10,
        descricao: 'Papel A4 75g, pacote com 500 folhas',
        categoria: 'Papelaria',
        ativo: true,
        criadoPor: almoxarife.id
      },
      {
        nome: 'Caneta Esferográfica',
        unidadeDeMedida: 'unidade',
        quantidade: 200,
        quantidadeMinima: 50,
        descricao: 'Caneta esferográfica azul, ponta média',
        categoria: 'Papelaria',
        ativo: true,
        criadoPor: almoxarife.id
      },
      {
        nome: 'Lápis HB',
        unidadeDeMedida: 'unidade',
        quantidade: 150,
        quantidadeMinima: 30,
        descricao: 'Lápis HB número 2',
        categoria: 'Papelaria',
        ativo: true,
        criadoPor: almoxarife.id
      },
      {
        nome: 'Borracha',
        unidadeDeMedida: 'unidade',
        quantidade: 80,
        quantidadeMinima: 20,
        descricao: 'Borracha branca escolar',
        categoria: 'Papelaria',
        ativo: true,
        criadoPor: almoxarife.id
      },
      {
        nome: 'Régua',
        unidadeDeMedida: 'unidade',
        quantidade: 60,
        quantidadeMinima: 15,
        descricao: 'Régua de 30cm transparente',
        categoria: 'Material Escolar',
        ativo: true,
        criadoPor: almoxarife.id
      }
    ]);

    console.log('✅ Materiais criados:', materials.length);

    // Buscar o professor para usar como solicitante
    const professor = await User.findOne({ where: { perfil: 'professor' } });

    // Criar algumas requisições de exemplo
    const requisicoes = await Requisicao.bulkCreate([
      {
        solicitante: professor.id,
        material: materials[0].id, // Papel A4
        quantidade: 5,
        status: 'pendente',
        justificativa: 'Necessário para atividades escolares',
        observacoes: 'Urgente para próxima semana',
        prioridade: 'alta',
        dataNecessidade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      },
      {
        solicitante: professor.id,
        material: materials[1].id, // Caneta
        quantidade: 20,
        status: 'aprovada',
        justificativa: 'Para uso em sala de aula',
        observacoes: 'Canetas azuis preferencialmente',
        prioridade: 'media',
        dataNecessidade: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        aprovadoPor: almoxarife.id,
        dataAprovacao: new Date()
      }
    ]);

    console.log('✅ Requisições criadas:', requisicoes.length);

    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📋 Dados de exemplo criados:');
    console.log('   - 3 usuários (professor, coordenador, almoxarife)');
    console.log('   - 5 materiais de exemplo');
    console.log('   - 2 requisições de exemplo');
    console.log('');
    console.log('🔑 Senha padrão para todos os usuários: 123456');
    console.log('');
    console.log('👤 Usuários disponíveis:');
    console.log('   - Professor: joao.silva@escola.com');
    console.log('   - Coordenador: maria.santos@escola.com');
    console.log('   - Almoxarife: pedro.oliveira@escola.com');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 