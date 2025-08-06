#!/bin/bash

echo "🔍 DIAGNÓSTICO - ERRO 502 BAD GATEWAY"
echo "═".repeat(60)

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo ""
step "1. Verificando status do PM2..."
pm2 status

echo ""
step "2. Verificando logs do PM2..."
pm2 logs --lines 20

echo ""
step "3. Verificando se as portas estão abertas..."
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001

echo ""
step "4. Testando conectividade local..."
curl -s http://localhost:3000 | head -10
curl -s http://localhost:3001/api/health | head -10

echo ""
step "5. Verificando configuração do Nginx..."
nginx -t

echo ""
step "6. Verificando logs do Nginx..."
tail -10 /var/log/nginx/error.log

echo ""
step "7. Verificando configuração do Nginx..."
cat /etc/nginx/sites-enabled/controledeinsumos

echo ""
step "8. Verificando variáveis de ambiente..."
if [ -f ".env" ]; then
    echo "Arquivo .env existe"
    grep -E "^(PORT|NODE_ENV|DB_)" .env
else
    error "Arquivo .env não encontrado!"
fi

echo ""
step "9. Verificando build do frontend..."
if [ -d "client/.next" ]; then
    echo "✅ Build do frontend existe"
    ls -la client/.next/ | head -5
else
    error "❌ Build do frontend não encontrado!"
fi

echo ""
step "10. Verificando dependências..."
if [ -d "client/node_modules" ]; then
    echo "✅ node_modules do frontend existe"
else
    error "❌ node_modules do frontend não encontrado!"
fi

echo ""
step "11. Testando aplicação diretamente..."
cd client
npm run start &
FRONTEND_PID=$!
sleep 5
curl -s http://localhost:3000 | head -5
kill $FRONTEND_PID 2>/dev/null
cd ..

echo ""
step "12. Verificando permissões..."
ls -la /var/www/controledeinsumos/
ls -la /var/www/controledeinsumos/client/

echo ""
echo "🔧 SOLUÇÕES COMUNS:"
echo "1. Se PM2 não está rodando: pm2 start ecosystem.config.js"
echo "2. Se build não existe: cd client && npm run build"
echo "3. Se portas não estão abertas: verificar firewall"
echo "4. Se Nginx com erro: sudo systemctl restart nginx"
echo "5. Se permissões erradas: sudo chown -R www-data:www-data /var/www/controledeinsumos" 