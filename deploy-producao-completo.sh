#!/bin/bash

echo "🚀 Deploy Completo - Produção"
echo "============================="
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

echo "8. Verificar se os arquivos foram copiados:"
echo "   ls -la client/.next/static/"
echo ""

echo "9. Voltar para pasta raiz:"
echo "   cd .."
echo ""

echo "10. Iniciar PM2 novamente:"
echo "    pm2 start all"
echo ""

echo "11. Verificar status:"
echo "    pm2 status"
echo ""

echo "12. Verificar logs:"
echo "    pm2 logs --lines 10"
echo ""

echo "13. Testar arquivos estáticos:"
echo "    node verificar-arquivos-producao.js"
echo ""

echo "🎯 Comando único para executar na VPS:"
echo "cd /var/www/controledeinsumos && git pull origin main && pm2 stop all && node fix-producao-enum.js && npm install && cd client && npm run build && node copy-static-files.js && ls -la .next/static/ && cd .. && pm2 start all && node verificar-arquivos-producao.js"
echo ""

echo "✅ Após o deploy, verifique:"
echo "🌐 URL: https://insumos.escolamega.com.br"
echo "🔧 Console: Verifique se não há mais erro 404 no sw.js"
echo "📁 Arquivos: Verifique se os arquivos estão em .next/static/" 