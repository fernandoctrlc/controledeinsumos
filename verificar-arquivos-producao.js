const axios = require('axios');

async function verificarArquivosProducao() {
  console.log('🔍 Verificando arquivos em produção...\n');

  const baseUrl = 'https://insumos.escolamega.com.br';

  const arquivosParaTestar = [
    { path: '/sw.js', descricao: 'Service Worker' },
    { path: '/manifest.json', descricao: 'Manifest PWA' },
    { path: '/favicon.ico', descricao: 'Favicon' },
    { path: '/icons/icon-192x192.png', descricao: 'Ícone 192x192' },
    { path: '/icons/icon-512x512.png', descricao: 'Ícone 512x512' },
    { path: '/icons/icon-16x16.png', descricao: 'Ícone 16x16' },
    { path: '/icons/icon-32x32.png', descricao: 'Ícone 32x32' },
  ];

  for (const arquivo of arquivosParaTestar) {
    try {
      const response = await axios.get(`${baseUrl}${arquivo.path}`, {
        timeout: 5000,
        validateStatus: function (status) {
          return status < 500; // Aceitar 404 para diagnóstico
        }
      });

      if (response.status === 200) {
        console.log(`✅ ${arquivo.descricao}: ${response.status} (${response.data.length} bytes)`);
      } else {
        console.log(`❌ ${arquivo.descricao}: ${response.status} - Não encontrado`);
      }
    } catch (error) {
      console.log(`❌ ${arquivo.descricao}: Erro - ${error.message}`);
    }
  }

  console.log('\n🎯 Diagnóstico:');
  console.log('- Se todos retornam 200: Arquivos estão sendo servidos corretamente');
  console.log('- Se retornam 404: Arquivos não estão na pasta .next/static/');
  console.log('- Se retornam erro: Problema de conectividade ou servidor');
}

verificarArquivosProducao(); 