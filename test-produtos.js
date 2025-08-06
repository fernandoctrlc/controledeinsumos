const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testarProdutos() {
  console.log('🧪 Testando funcionalidades de produtos...\n');

  try {
    // 1. Testar health check
    console.log('1. Testando health check...');
    const health = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', health.data.status);
    console.log('');

    // 2. Testar listagem de materiais (produtos)
    console.log('2. Testando listagem de produtos...');
    try {
      const materiais = await axios.get(`${API_BASE_URL}/materials`);
      console.log('✅ Produtos encontrados:', materiais.data.materiais?.length || 0);
      
      if (materiais.data.materiais && materiais.data.materiais.length > 0) {
        console.log('📋 Primeiro produto:', materiais.data.materiais[0].nome);
      }
    } catch (error) {
      console.log('❌ Erro ao listar produtos:', error.response?.data || error.message);
    }
    console.log('');

    // 3. Testar criação de produto
    console.log('3. Testando criação de produto...');
    try {
      const novoProduto = await axios.post(`${API_BASE_URL}/materials`, {
        nome: 'Produto Teste',
        categoria: 'Papelaria',
        quantidade: 100,
        quantidadeMinima: 10,
        unidade: 'unidade',
        descricao: 'Produto de teste para validação',
        ativo: true
      });
      console.log('✅ Produto criado:', novoProduto.data.nome);
      
      // 4. Testar busca do produto criado
      console.log('4. Testando busca do produto...');
      const produto = await axios.get(`${API_BASE_URL}/materials/${novoProduto.data.id}`);
      console.log('✅ Produto encontrado:', produto.data.nome);
      
      // 5. Testar adição de estoque
      console.log('5. Testando adição de estoque...');
      const estoque = await axios.post(`${API_BASE_URL}/materials/${novoProduto.data.id}/adicionar-estoque`, {
        quantidade: 50
      });
      console.log('✅ Estoque adicionado:', estoque.data.message);
      
    } catch (error) {
      console.log('❌ Erro ao criar/testar produto:', error.response?.data || error.message);
    }
    console.log('');

    // 6. Testar categorias
    console.log('6. Testando categorias...');
    try {
      const categorias = await axios.get(`${API_BASE_URL}/materials/categorias`);
      console.log('✅ Categorias encontradas:', categorias.data.length);
    } catch (error) {
      console.log('❌ Erro ao buscar categorias:', error.response?.data || error.message);
    }
    console.log('');

    // 7. Testar estoque baixo
    console.log('7. Testando estoque baixo...');
    try {
      const estoqueBaixo = await axios.get(`${API_BASE_URL}/materials/estoque/baixo`);
      console.log('✅ Produtos com estoque baixo:', estoqueBaixo.data.length);
    } catch (error) {
      console.log('❌ Erro ao buscar estoque baixo:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarProdutos(); 