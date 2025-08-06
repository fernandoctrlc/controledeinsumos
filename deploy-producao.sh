#!/bin/bash

echo "🚀 Deploy em Produção - Sistema de Produtos"
echo "============================================"
echo ""

echo "📋 Comandos para executar na VPS:"
echo ""

echo "1. Acessar a pasta do projeto:"
echo "   cd /var/www/controledeinsumos"
echo ""

echo "2. Fazer pull das mudanças:"
echo "   git pull origin main"
echo ""

echo "3. Instalar dependências (se necessário):"
echo "   npm install"
echo ""

echo "4. Fazer build do frontend:"
echo "   cd client && npm run build"
echo ""

echo "5. Voltar para pasta raiz:"
echo "   cd .."
echo ""

echo "6. Reiniciar PM2:"
echo "   pm2 restart all"
echo ""

echo "7. Verificar status:"
echo "   pm2 status"
echo ""

echo "8. Verificar logs:"
echo "   pm2 logs --lines 10"
echo ""

echo "9. Testar a aplicação:"
echo "   curl -s https://insumos.escolamega.com.br/api/health"
echo ""

echo "🎯 Comando único para executar na VPS:"
echo "cd /var/www/controledeinsumos && git pull origin main && npm install && cd client && npm run build && cd .. && pm2 restart all"
echo ""

echo "✅ Após o deploy, acesse: https://insumos.escolamega.com.br"
echo "📋 Teste o menu 'Produtos' com usuário coordenador ou almoxarife" 