#!/usr/bin/env node

/**
 * Script para testar as estatísticas do dashboard
 * Verifica se os endpoints estão funcionando e retornando dados corretos
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Simular um token JWT válido (você pode gerar um real se necessário)
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzY5NzYwMCwiZXhwIjoxNzM0MzAxNjAwfQ.example';

async function testDashboardStats() {
  console.log('🧪 Testando Estatísticas do Dashboard...\n');

  try {
    // Testar endpoint de materiais
    console.log('📦 Testando endpoint de materiais...');
    const materiaisResponse = await axios.get(`${API_BASE_URL}/materials`, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    
    const totalMateriais = materiaisResponse.data.materiais?.length || 0;
    const estoqueBaixo = materiaisResponse.data.materiais?.filter(
      material => parseInt(material.quantidade) <= parseInt(material.quantidadeMinima)
    ).length || 0;
    
    console.log(`✅ Materiais: ${totalMateriais} total, ${estoqueBaixo} com estoque baixo`);

    // Testar endpoint de estatísticas de requisições
    console.log('\n📋 Testando endpoint de estatísticas de requisições...');
    const requisicoesResponse = await axios.get(`${API_BASE_URL}/requisitions/estatisticas`, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    
    const stats = requisicoesResponse.data.estatisticas || {};
    console.log(`✅ Requisições: ${stats.total || 0} total`);
    console.log(`   - Pendentes: ${stats.pendentes || 0}`);
    console.log(`   - Aprovadas: ${stats.aprovadas || 0}`);
    console.log(`   - Rejeitadas: ${stats.rejeitadas || 0}`);

    // Testar endpoint de materiais com estoque baixo
    console.log('\n⚠️ Testando endpoint de materiais com estoque baixo...');
    const estoqueBaixoResponse = await axios.get(`${API_BASE_URL}/materials/estoque/baixo`, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    
    const materiaisEstoqueBaixo = estoqueBaixoResponse.data.materiais?.length || 0;
    console.log(`✅ Materiais com estoque baixo: ${materiaisEstoqueBaixo}`);

    // Resumo final
    console.log('\n📊 RESUMO DAS ESTATÍSTICAS:');
    console.log(`   📦 Total de Materiais: ${totalMateriais}`);
    console.log(`   📋 Total de Requisições: ${stats.total || 0}`);
    console.log(`   ⏳ Requisições Pendentes: ${stats.pendentes || 0}`);
    console.log(`   ⚠️ Materiais com Estoque Baixo: ${estoqueBaixo}`);

    // Verificar se os números fazem sentido
    if (totalMateriais > 0 && stats.total >= 0) {
      console.log('\n✅ Estatísticas carregadas com sucesso!');
      console.log('🎯 O dashboard deve estar funcionando corretamente.');
    } else {
      console.log('\n⚠️ Algumas estatísticas estão vazias ou zeradas.');
      console.log('🔍 Verifique se há dados no banco de dados.');
    }

  } catch (error) {
    console.error('\n❌ Erro ao testar estatísticas:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Dados: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    
    console.log('\n🔧 Possíveis soluções:');
    console.log('   1. Verificar se o servidor está rodando na porta 3001');
    console.log('   2. Verificar se o token JWT é válido');
    console.log('   3. Verificar se há dados no banco de dados');
    console.log('   4. Verificar logs do servidor para erros');
  }
}

// Executar o teste
if (require.main === module) {
  testDashboardStats();
}

module.exports = { testDashboardStats }; 