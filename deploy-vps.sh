#!/bin/bash

echo "🚀 INICIANDO DEPLOY NA VPS"
echo "═".repeat(50)

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
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

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    error "Este script deve ser executado como root (sudo)"
    exit 1
fi

log "Verificando sistema..."

# Atualizar sistema
step "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências
step "Instalando dependências do sistema..."

# Node.js
if ! command -v node &> /dev/null; then
    log "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    log "Node.js já está instalado"
fi

# MySQL
if ! command -v mysql &> /dev/null; then
    log "Instalando MySQL..."
    apt install mysql-server -y
else
    log "MySQL já está instalado"
fi

# PM2
if ! command -v pm2 &> /dev/null; then
    log "Instalando PM2..."
    npm install -g pm2
else
    log "PM2 já está instalado"
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    log "Instalando Nginx..."
    apt install nginx -y
else
    log "Nginx já está instalado"
fi

# Git
if ! command -v git &> /dev/null; then
    log "Instalando Git..."
    apt install git -y
else
    log "Git já está instalado"
fi

# Certbot
if ! command -v certbot &> /dev/null; then
    log "Instalando Certbot..."
    apt install certbot python3-certbot-nginx -y
else
    log "Certbot já está instalado"
fi

# Configurar MySQL
step "Configurando MySQL..."
mysql -e "CREATE DATABASE IF NOT EXISTS almoxarifado;"
mysql -e "CREATE USER IF NOT EXISTS 'almoxarifado_user'@'localhost' IDENTIFIED BY 'almoxarifado123';"
mysql -e "GRANT ALL PRIVILEGES ON almoxarifado.* TO 'almoxarifado_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Clonar repositório
step "Clonando repositório..."
cd /var/www
if [ -d "controledeinsumos" ]; then
    log "Atualizando repositório existente..."
    cd controledeinsumos
    git pull origin main
else
    log "Clonando novo repositório..."
    git clone https://github.com/fernandoctrlc/controledeinsumos.git
    cd controledeinsumos
fi

# Configurar variáveis de ambiente
step "Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    cp env.example .env
    log "Arquivo .env criado. Configure as variáveis de ambiente manualmente."
else
    log "Arquivo .env já existe"
fi

# Instalar dependências
step "Instalando dependências..."
npm install

cd client
npm install
npm run build
cd ..

# Sincronizar banco de dados
step "Sincronizando banco de dados..."
node server/sync-database.js
node server/seeders/seed.js

# Criar configuração do PM2
step "Configurando PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'controledeinsumos-backend',
      script: 'server/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'controledeinsumos-frontend',
      script: 'client/node_modules/.bin/next',
      args: 'start',
      cwd: './client',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# Configurar Nginx
step "Configurando Nginx..."
cat > /etc/nginx/sites-available/controledeinsumos << 'EOF'
server {
    listen 80;
    server_name _;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API (Node.js)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/controledeinsumos /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar e reiniciar Nginx
nginx -t && systemctl restart nginx

# Iniciar aplicação com PM2
step "Iniciando aplicação..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configurar permissões
chown -R www-data:www-data /var/www/controledeinsumos

log "✅ DEPLOY CONCLUÍDO!"
echo ""
log "📊 Status da aplicação:"
pm2 status
echo ""
log "🌐 URLs de acesso:"
echo "   Frontend: http://$(hostname -I | awk '{print $1}')"
echo "   API: http://$(hostname -I | awk '{print $1}')/api"
echo ""
log "👤 Usuários padrão:"
echo "   Administrador: admin@escola.com / admin123"
echo "   Professor: joao.silva@escola.com / 123456"
echo "   Coordenador: maria.santos@escola.com / 123456"
echo "   Almoxarife: pedro.oliveira@escola.com / 123456"
echo ""
warning "⚠️  IMPORTANTE:"
echo "   1. Configure o arquivo .env com suas variáveis"
echo "   2. Configure seu domínio no Nginx"
echo "   3. Instale SSL com: sudo certbot --nginx -d seudominio.com"
echo ""
log "🔧 Comandos úteis:"
echo "   pm2 status - Ver status da aplicação"
echo "   pm2 logs - Ver logs"
echo "   pm2 restart all - Reiniciar aplicação"
echo "   ./deploy-vps.sh - Executar deploy novamente" 