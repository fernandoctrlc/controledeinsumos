# 🚀 GUIA DE DEPLOY - VPS

## 📋 PRÉ-REQUISITOS NA VPS

### 1. 📦 Instalar Dependências do Sistema
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL
sudo apt install mysql-server -y

# Instalar PM2 (gerenciador de processos)
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y

# Instalar Git
sudo apt install git -y

# Instalar Certbot (para SSL)
sudo apt install certbot python3-certbot-nginx -y
```

### 2. 🔧 Configurar MySQL
```bash
# Configurar MySQL
sudo mysql_secure_installation

# Criar banco de dados
sudo mysql -u root -p
```

```sql
CREATE DATABASE almoxarifado;
CREATE USER 'almoxarifado_user'@'localhost' IDENTIFIED BY 'sua_senha_forte_aqui';
GRANT ALL PRIVILEGES ON almoxarifado.* TO 'almoxarifado_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 🚀 DEPLOY DO PROJETO

### 3. 📥 Clonar o Repositório
```bash
# Navegar para diretório de aplicações
cd /var/www

# Clonar o repositório
sudo git clone https://github.com/fernandoctrlc/controledeinsumos.git
sudo chown -R $USER:$USER controledeinsumos
cd controledeinsumos
```

### 4. 🔧 Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar variáveis de ambiente
nano .env
```

**Conteúdo do .env:**
```env
# Configurações do Banco
DB_HOST=localhost
DB_USER=almoxarifado_user
DB_PASS=sua_senha_forte_aqui
DB_NAME=almoxarifado
DB_PORT=3306

# Configurações do Servidor
PORT=3001
NODE_ENV=production
JWT_SECRET=sua_chave_jwt_super_secreta_aqui

# Configurações do Frontend
NEXT_PUBLIC_API_URL=https://seudominio.com/api
```

### 5. 📦 Instalar Dependências
```bash
# Instalar dependências do projeto
npm install

# Instalar dependências do frontend
cd client
npm install
cd ..
```

### 6. 🏗️ Build do Frontend
```bash
# Fazer build do frontend
cd client
npm run build
cd ..
```

### 7. 🔄 Sincronizar Banco de Dados
```bash
# Sincronizar banco de dados
node server/sync-database.js

# Executar seeders
node server/seeders/seed.js
```

## 🌐 CONFIGURAÇÃO DO NGINX

### 8. 📝 Configurar Nginx
```bash
# Criar configuração do Nginx
sudo nano /etc/nginx/sites-available/controledeinsumos
```

**Conteúdo da configuração:**
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

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
```

### 9. 🔗 Ativar Configuração
```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/controledeinsumos /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 🚀 INICIAR APLICAÇÃO COM PM2

### 10. 📝 Criar Arquivo de Configuração PM2
```bash
# Criar arquivo ecosystem.config.js
nano ecosystem.config.js
```

**Conteúdo do ecosystem.config.js:**
```javascript
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
```

### 11. 🚀 Iniciar Aplicação
```bash
# Iniciar aplicação com PM2
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup
```

## 🔒 CONFIGURAR SSL (HTTPS)

### 12. 🌐 Configurar Domínio
```bash
# Instalar certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

## 📊 MONITORAMENTO

### 13. 🔍 Verificar Status
```bash
# Verificar status dos processos
pm2 status

# Verificar logs
pm2 logs

# Verificar uso de recursos
pm2 monit
```

## 🔧 COMANDOS ÚTEIS

### 📋 Comandos de Manutenção
```bash
# Reiniciar aplicação
pm2 restart all

# Parar aplicação
pm2 stop all

# Ver logs em tempo real
pm2 logs --lines 100

# Atualizar código
git pull origin main
npm install
cd client && npm install && npm run build && cd ..
pm2 restart all
```

### 🔄 Script de Deploy Automático
```bash
# Criar script de deploy
nano deploy.sh
```

**Conteúdo do deploy.sh:**
```bash
#!/bin/bash
echo "🚀 Iniciando deploy..."

# Parar aplicação
pm2 stop all

# Atualizar código
git pull origin main

# Instalar dependências
npm install
cd client && npm install && npm run build && cd ..

# Reiniciar aplicação
pm2 restart all

echo "✅ Deploy concluído!"
```

```bash
# Tornar script executável
chmod +x deploy.sh
```

## 📱 ACESSO AO SISTEMA

### 🌐 URLs de Acesso
- **Frontend:** https://seudominio.com
- **API:** https://seudominio.com/api
- **Health Check:** https://seudominio.com/api/health

### 👤 Usuários Padrão
- **Administrador:** admin@escola.com / admin123
- **Professor:** joao.silva@escola.com / 123456
- **Coordenador:** maria.santos@escola.com / 123456
- **Almoxarife:** pedro.oliveira@escola.com / 123456

## 🔧 TROUBLESHOOTING

### ❌ Problemas Comuns
```bash
# Verificar se as portas estão abertas
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar logs do PM2
pm2 logs

# Verificar status dos serviços
sudo systemctl status nginx
sudo systemctl status mysql
```

## 📊 MONITORAMENTO AVANÇADO

### 📈 Configurar Monitoramento
```bash
# Instalar PM2 Plus (opcional)
pm2 install pm2-server-monit

# Configurar alertas
pm2 install pm2-logrotate
```

**✅ Sistema pronto para produção!** 