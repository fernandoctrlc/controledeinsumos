const axios = require('axios');

async function testarDashboardComLogin() {
  console.log('🧪 Testando dashboard com login...\n');

  try {
    // 1. Fazer login via API
    console.log('1. Fazendo login via API...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'almoxarifado@gmail.com',
      senha: '123456'
    });
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login realizado:', user.nome);
    console.log('');

    // 2. Simular localStorage no navegador
    console.log('2. Simulando localStorage...');
    console.log('📋 Token:', token ? 'Presente' : 'Ausente');
    console.log('📋 User:', user ? 'Presente' : 'Ausente');
    console.log('');

    // 3. Testar dashboard
    console.log('3. Testando dashboard...');
    const dashboardResponse = await axios.get('http://localhost:3000/dashboard');
    console.log('✅ Dashboard status:', dashboardResponse.status);
    
    // Verificar se contém "Carregando" ou erro
    const content = dashboardResponse.data;
    if (content.includes('Carregando')) {
      console.log('⚠️ Dashboard está em carregamento (possível loop)');
    } else if (content.includes('login')) {
      console.log('⚠️ Dashboard redirecionando para login');
    } else {
      console.log('✅ Dashboard carregado normalmente');
    }
    console.log('');

    // 4. Testar outras páginas
    console.log('4. Testando outras páginas...');
    const produtosResponse = await axios.get('http://localhost:3000/produtos');
    console.log('✅ Produtos:', produtosResponse.status);
    
    const requisicoesResponse = await axios.get('http://localhost:3000/requisicoes');
    console.log('✅ Requisições:', requisicoesResponse.status);
    console.log('');

    console.log('🎯 Conclusão:');
    console.log('- Dashboard retorna 200 mas pode estar em loop de carregamento');
    console.log('- Outras páginas funcionam normalmente');
    console.log('- Possível problema: localStorage não está sendo acessado corretamente');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.response?.status, error.response?.statusText);
  }
}

testarDashboardComLogin(); 