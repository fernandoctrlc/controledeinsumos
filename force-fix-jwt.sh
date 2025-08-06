#!/bin/bash

# Gerar uma chave JWT segura
JWT_SECRET=$(openssl rand -base64 32)

cd /var/www/controledeinsumos
pm2 delete all
rm -f .env
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=Fernando.Henrique
DB_PASS=@01Fe3686#2023
DB_NAME=almoxarifado
DB_PORT=3306
PORT=3001
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api
EOF
node debug-jwt.js
pm2 start server/index.js --name srvinsumos 