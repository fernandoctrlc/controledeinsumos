const axios = require('axios');

const API_BASE_URL = 'https://insumos.escolamega.com.br/api';

async function testarProducao() {
  console.log('🧪 Testando sistema em produção...\n');

  try {
    // 1. Testar health check
    console.log('1. Testando health check...');
    const health = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', health.data);
    console.log('');

    // 2. Testar registro de usuário com email único
    const emailUnico = `teste.${Date.now()}@escola.com`;
    console.log(`2. Testando registro de usuário (${emailUnico})...`);
    try {
      const registro = await axios.post(`${API_BASE_URL}/auth/registro`, {
        nome: 'Teste Produção',
        email: emailUnico,
        senha: '123456',
        perfil: 'professor'
      });
      console.log('✅ Registro bem-sucedido:', registro.data.message);
      
      // 3. Testar login com o usuário criado
      console.log('3. Testando login com usuário criado...');
      try {
        const login = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: emailUnico,
          senha: '123456'
        });
        console.log('✅ Login bem-sucedido:', login.data.message);
        
        // 4. Testar acesso com token
        const token = login.data.token;
        console.log('4. Testando acesso com token...');
        
        const perfil = await axios.get(`${API_BASE_URL}/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Perfil acessado:', perfil.data.usuario.nome);
        
      } catch (error) {
        console.log('❌ Erro no login:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.log('❌ Erro no registro:', error.response?.data || error.message);
    }
    console.log('');

    // 5. Testar login com usuário existente
    console.log('5. Testando login com usuário existente...');
    try {
      const loginExistente = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'teste.producao@escola.com',
        senha: '123456'
      });
      console.log('✅ Login com usuário existente:', loginExistente.data.message);
    } catch (error) {
      console.log('❌ Erro no login existente:', error.response?.data || error.message);
    }
    console.log('');

    // 6. Testar materiais (sem token)
    console.log('6. Testando acesso a materiais (sem token)...');
    try {
      const materiais = await axios.get(`${API_BASE_URL}/materials`);
      console.log('❌ Erro esperado: Acesso negado sem token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Acesso negado corretamente (401)');
      } else {
        console.log('❌ Erro inesperado:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarProducao(); 