const axios = require('axios');
const User = require('./server/models/User');
const { sequelize } = require('./server/config/database');

async function debugApiLogin() {
  console.log('🔍 DEBUGANDO LOGIN DA API\n');
  
  try {
    // 1. Test direct database access
    console.log('📋 Teste 1: Acesso Direto ao Banco');
    const user = await User.findOne({ 
      where: { email: 'joao.silva@escola.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado no banco');
      return;
    }
    
    console.log('✅ Usuário encontrado no banco');
    console.log('📧 Email:', user.email);
    console.log('👤 Nome:', user.nome);
    console.log('🔐 Senha hash:', user.senha);
    console.log('✅ Ativo:', user.ativo);
    
    // 2. Test password comparison
    console.log('\n📋 Teste 2: Comparação de Senha');
    const senhaValida = await user.compararSenha('123456');
    console.log('🔐 Senha válida (direto):', senhaValida);
    
    // 3. Test API login
    console.log('\n📋 Teste 3: Login via API');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'joao.silva@escola.com',
        senha: '123456'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      console.log('✅ API retornou sucesso');
      console.log('📊 Status:', response.status);
      console.log('📄 Dados:', response.data);
      
    } catch (apiError) {
      console.log('❌ API retornou erro');
      console.log('📊 Status:', apiError.response?.status);
      console.log('📄 Dados:', apiError.response?.data);
      
      // 4. Test with different password
      console.log('\n📋 Teste 4: Teste com Senha Diferente');
      try {
        const response2 = await axios.post('http://localhost:3001/api/auth/login', {
          email: 'joao.silva@escola.com',
          senha: 'senha_errada'
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        });
        
        console.log('⚠️ Senha errada retornou:', response2.status);
        
      } catch (apiError2) {
        console.log('✅ Senha errada retornou erro (esperado)');
        console.log('📄 Dados:', apiError2.response?.data);
      }
    }
    
    // 5. Test with different user
    console.log('\n📋 Teste 5: Teste com Usuário Inexistente');
    try {
      const response3 = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'usuario.inexistente@escola.com',
        senha: '123456'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      console.log('⚠️ Usuário inexistente retornou:', response3.status);
      
    } catch (apiError3) {
      console.log('✅ Usuário inexistente retornou erro (esperado)');
      console.log('📄 Dados:', apiError3.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await sequelize.close();
  }
}

debugApiLogin(); 