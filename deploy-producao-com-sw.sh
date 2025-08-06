#!/bin/bash

echo "🚀 Deploy com Correção do Service Worker - Produção"
echo "=================================================="
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

echo "5. Reinstalar dependências:"
echo "   npm install"
echo ""

echo "6. Fazer build do frontend:"
echo "   cd client && npm run build"
echo ""

echo "7. Copiar arquivos estáticos:"
echo "   node copy-static-files.js"
echo ""

echo "8. Voltar para pasta raiz:"
echo "   cd .."
echo ""

echo "9. Iniciar PM2 novamente:"
echo "   pm2 start all"
echo ""

echo "10. Verificar status:"
echo "    pm2 status"
echo ""

echo "11. Verificar logs:"
echo "    pm2 logs --lines 10"
echo ""

echo "12. Testar Service Worker:"
echo "    curl -s https://insumos.escolamega.com.br/sw.js | head -5"
echo ""

echo "🎯 Comando único para executar na VPS:"
echo "cd /var/www/controledeinsumos && git pull origin main && pm2 stop all && node fix-producao-enum.js && npm install && cd client && npm run build && node copy-static-files.js && cd .. && pm2 start all"
echo ""

echo "✅ Após o deploy, teste o Service Worker:"
echo "🌐 URL: https://insumos.escolamega.com.br"
echo "🔧 Console: Verifique se não há mais erro 404 no sw.js" 