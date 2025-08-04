const axios = require('axios');

async function testApiDebug() {
  console.log('🔍 TESTANDO DEBUG DA API\n');
  
  // Test 1: Simple request
  console.log('📋 Teste 1: Requisição Simples');
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'joao.silva@escola.com',
      senha: '123456'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    console.log('✅ Sucesso:', response.data);
    
  } catch (error) {
    console.log('❌ Erro:', error.response?.data);
  }
  
  // Test 2: Request with explicit content type
  console.log('\n📋 Teste 2: Requisição com Content-Type Explícito');
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', 
      JSON.stringify({
        email: 'joao.silva@escola.com',
        senha: '123456'
      }), 
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000
      }
    );
    
    console.log('✅ Sucesso:', response.data);
    
  } catch (error) {
    console.log('❌ Erro:', error.response?.data);
  }
  
  // Test 3: Request with different case
  console.log('\n📋 Teste 3: Requisição com Diferentes Cases');
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      EMAIL: 'joao.silva@escola.com',
      SENHA: '123456'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    console.log('✅ Sucesso:', response.data);
    
  } catch (error) {
    console.log('❌ Erro:', error.response?.data);
  }
  
  // Test 4: Request with extra fields
  console.log('\n📋 Teste 4: Requisição com Campos Extras');
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'joao.silva@escola.com',
      senha: '123456',
      extra: 'campo_extra'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    console.log('✅ Sucesso:', response.data);
    
  } catch (error) {
    console.log('❌ Erro:', error.response?.data);
  }
  
  // Test 5: Request with missing fields
  console.log('\n📋 Teste 5: Requisição com Campos Faltando');
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'joao.silva@escola.com'
      // senha missing
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    console.log('✅ Sucesso:', response.data);
    
  } catch (error) {
    console.log('❌ Erro:', error.response?.data);
  }
}

testApiDebug(); 