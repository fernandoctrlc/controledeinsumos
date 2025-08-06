#!/bin/bash

echo "🔧 Script para corrigir variáveis de ambiente na VPS"
echo "=================================================="
echo ""

# Gerar uma chave JWT segura
JWT_SECRET=$(openssl rand -base64 32)

echo "📋 Execute estes comandos na VPS:"
echo ""

echo "1. Acessar a pasta do projeto:"
echo "   cd /var/www/controledeinsumos"
echo ""

echo "2. Fazer pull das mudanças:"
echo "   git pull"
echo ""

echo "3. Fazer backup do .env atual (se existir):"
echo "   cp .env .env.backup 2>/dev/null || echo 'Arquivo .env não existe'"
echo ""

echo "4. Criar novo arquivo .env:"
echo "   cat > .env << 'EOF'"
echo "   # Configurações do Banco de Dados"
echo "   DB_HOST=localhost"
echo "   DB_USER=Fernando.Henrique"
echo "   DB_PASS=@01Fe3686#2023"
echo "   DB_NAME=insumos_db"
echo "   DB_PORT=3306"
echo ""
echo "   # Configurações do Servidor"
echo "   PORT=3001"
echo "   NODE_ENV=production"
echo ""
echo "   # JWT Secret (chave gerada automaticamente)"
echo "   JWT_SECRET=${JWT_SECRET}"
echo ""
echo "   # Configurações do Frontend"
echo "   NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api"
echo "   EOF"
echo ""

echo "5. Verificar se o arquivo foi criado:"
echo "   cat .env"
echo ""

echo "6. Testar as variáveis de ambiente:"
echo "   node check-env.js"
echo ""

echo "7. Reiniciar o PM2:"
echo "   pm2 restart all"
echo ""

echo "8. Verificar status do PM2:"
echo "   pm2 status"
echo ""

echo "9. Verificar logs:"
echo "   pm2 logs --lines 10"
echo ""

echo "10. Testar a API:"
echo "    curl -s https://insumos.escolamega.com.br/api/health"
echo ""

echo "🎯 Comando único para executar na VPS:"
echo "cd /var/www/controledeinsumos && git pull && cat > .env << 'EOF'"
echo "DB_HOST=localhost"
echo "DB_USER=Fernando.Henrique"
echo "DB_PASS=@01Fe3686#2023"
echo "DB_NAME=insumos_db"
echo "DB_PORT=3306"
echo "PORT=3001"
echo "NODE_ENV=production"
echo "JWT_SECRET=${JWT_SECRET}"
echo "NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api"
echo "EOF"
echo "node check-env.js && pm2 restart all"
echo "" 