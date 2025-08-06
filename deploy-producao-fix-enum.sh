#!/bin/bash

echo "🚀 Deploy com Correção do ENUM - Produção"
echo "=========================================="
echo ""

echo "📋 Comandos para executar na VPS:"
echo ""

echo "1. Acessar a pasta do projeto:"
echo "   cd /var/www/controledeinsumos"
echo ""

echo "2. Fazer pull das mudanças:"
echo "   git pull origin main"
echo ""

echo "3. Parar o PM2:"
echo "   pm2 stop all"
echo ""

echo "4. Corrigir o ENUM no banco:"
echo "   node fix-producao-enum.js"
echo ""

echo "5. Reinstalar dependências (se necessário):"
echo "   npm install"
echo ""

echo "6. Fazer build do frontend:"
echo "   cd client && npm run build"
echo ""

echo "7. Voltar para pasta raiz:"
echo "   cd .."
echo ""

echo "8. Iniciar PM2 novamente:"
echo "   pm2 start all"
echo ""

echo "9. Verificar status:"
echo "   pm2 status"
echo ""

echo "10. Verificar logs:"
echo "    pm2 logs --lines 10"
echo ""

echo "11. Testar a aplicação:"
echo "    curl -s https://insumos.escolamega.com.br/api/health"
echo ""

echo "🎯 Comando único para executar na VPS:"
echo "cd /var/www/controledeinsumos && git pull origin main && pm2 stop all && node fix-producao-enum.js && npm install && cd client && npm run build && cd .. && pm2 start all"
echo ""

echo "✅ Após o deploy, teste o cadastro de produtos com 'litro' como unidade"
echo "🌐 URL: https://insumos.escolamega.com.br/produtos/novo" 