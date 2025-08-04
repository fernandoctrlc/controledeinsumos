const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const { sequelize } = require('./server/config/database');

async function testLogin() {
  try {
    console.log('🔍 Testando login...');
    
    // Buscar usuário
    const user = await User.findOne({ 
      where: { email: 'joao.silva@escola.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    console.log('📝 Senha hash:', user.senha);
    
    // Testar senha
    const senhaValida = await bcrypt.compare('123456', user.senha);
    console.log('🔐 Senha válida:', senhaValida);
    
    if (senhaValida) {
      console.log('✅ Login funcionando!');
    } else {
      console.log('❌ Senha incorreta');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
}

testLogin(); 