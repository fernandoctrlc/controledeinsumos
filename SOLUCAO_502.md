# 🔧 SOLUÇÃO PARA ERRO 502 BAD GATEWAY

## 🔍 **DIAGNÓSTICO RÁPIDO**

### 1. **Verificar Status do PM2**
```bash
pm2 status
```
**✅ Deve mostrar:**
- `controledeinsumos-backend` - online
- `controledeinsumos-frontend` - online

### 2. **Verificar Portas**
```bash
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001
```
**✅ Deve mostrar as portas 3000 e 3001 abertas**

### 3. **Testar Aplicação Localmente**
```bash
curl http://localhost:3000
curl http://localhost:3001/api/health
```

## 🚀 **SOLUÇÕES COMUNS**

### **❌ PROBLEMA 1: PM2 não está rodando**

**🔧 SOLUÇÃO:**
```bash
# Parar todos os processos
pm2 delete all

# Iniciar novamente
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Verificar status
pm2 status
```

### **❌ PROBLEMA 2: Build do frontend não existe**

**🔧 SOLUÇÃO:**
```bash
cd /var/www/controledeinsumos/client

# Instalar dependências
npm install

# Fazer build
npm run build

# Verificar se build foi criado
ls -la .next/

# Reiniciar PM2
cd ..
pm2 restart all
```

### **❌ PROBLEMA 3: Configuração do Nginx incorreta**

**🔧 SOLUÇÃO:**
```bash
# Verificar configuração
sudo nginx -t

# Se houver erro, corrigir:
sudo nano /etc/nginx/sites-available/controledeinsumos
```

**✅ Configuração correta:**
```nginx
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
```

```bash
# Reiniciar Nginx
sudo systemctl restart nginx
```

### **❌ PROBLEMA 4: Variáveis de ambiente incorretas**

**🔧 SOLUÇÃO:**
```bash
# Verificar arquivo .env
cat .env

# Se não existir, criar:
cp env.example .env
nano .env
```

**✅ Conteúdo correto do .env:**
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
NEXT_PUBLIC_API_URL=http://seudominio.com/api
```

### **❌ PROBLEMA 5: Permissões incorretas**

**🔧 SOLUÇÃO:**
```bash
# Corrigir permissões
sudo chown -R www-data:www-data /var/www/controledeinsumos
sudo chmod -R 755 /var/www/controledeinsumos
```

### **❌ PROBLEMA 6: Firewall bloqueando portas**

**🔧 SOLUÇÃO:**
```bash
# Verificar firewall
sudo ufw status

# Se ativo, liberar portas
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 3001
```

## 🔧 **SCRIPT DE CORREÇÃO AUTOMÁTICA**

```bash
#!/bin/bash
echo "🔧 CORRIGINDO ERRO 502..."

# Parar PM2
pm2 delete all

# Verificar build
cd /var/www/controledeinsumos/client
if [ ! -d ".next" ]; then
    echo "📦 Fazendo build do frontend..."
    npm install
    npm run build
fi
cd ..

# Verificar .env
if [ ! -f ".env" ]; then
    echo "📄 Criando arquivo .env..."
    cp env.example .env
fi

# Corrigir permissões
sudo chown -R www-data:www-data /var/www/controledeinsumos

# Iniciar PM2
pm2 start ecosystem.config.js
pm2 save

# Reiniciar Nginx
sudo systemctl restart nginx

echo "✅ Correção concluída!"
pm2 status
```

## 📊 **VERIFICAÇÃO FINAL**

```bash
# 1. Verificar PM2
pm2 status

# 2. Verificar portas
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001

# 3. Testar localmente
curl http://localhost:3000
curl http://localhost:3001/api/health

# 4. Verificar logs
pm2 logs --lines 10

# 5. Testar via Nginx
curl http://seudominio.com
curl http://seudominio.com/api/health
```

## 🚨 **SE NADA FUNCIONAR**

1. **Verificar logs completos:**
```bash
pm2 logs --lines 100
sudo tail -f /var/log/nginx/error.log
```

2. **Reiniciar tudo:**
```bash
sudo reboot
```

3. **Deploy limpo:**
```bash
cd /var/www
sudo rm -rf controledeinsumos
sudo git clone https://github.com/fernandoctrlc/controledeinsumos.git
cd controledeinsumos
sudo ./deploy-vps.sh
```

**✅ Execute o script de diagnóstico primeiro para identificar o problema específico!** 