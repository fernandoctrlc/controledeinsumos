#!/bin/bash

echo "🔧 Script completo para corrigir problemas na VPS"
echo "================================================"
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

echo "3. Parar o PM2:"
echo "   pm2 stop all"
echo ""

echo "4. Criar arquivo .env correto:"
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
echo "   # JWT Secret"
echo "   JWT_SECRET=${JWT_SECRET}"
echo ""
echo "   # Configurações do Frontend"
echo "   NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api"
echo "   EOF"
echo ""

echo "5. Verificar arquivo .env:"
echo "   cat .env"
echo ""

echo "6. Testar variáveis de ambiente:"
echo "   node check-env.js"
echo ""

echo "7. Testar JWT:"
echo "   node debug-jwt.js"
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

echo "11. Testar API:"
echo "    curl -s https://insumos.escolamega.com.br/api/health"
echo ""

echo "🎯 Comando único para executar na VPS:"
echo "cd /var/www/controledeinsumos && git pull && pm2 stop all && cat > .env << 'EOF'"
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
echo "node check-env.js && node debug-jwt.js && pm2 start all"
echo "" 