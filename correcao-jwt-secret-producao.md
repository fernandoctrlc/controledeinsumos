# 🔧 CORREÇÃO: JWT_SECRET não definido na produção

## 🎯 **PROBLEMA IDENTIFICADO:**

**Erro:** `secretOrPrivateKey must have a value`

**Causa:** A variável de ambiente `JWT_SECRET` não está definida na VPS de produção.

## 🐛 **ERRO COMPLETO:**
```
0|srvinsumos  | Erro no login: Error: secretOrPrivateKey must have a value
0|srvinsumos  |     at module.exports [as sign] (/var/www/controledeinsumos/node_modules/jsonwebtoken/sign.js:111:20)
0|srvinsumos  |     at gerarToken (/var/www/controledeinsumos/server/routes/auth.js:11:14)
0|srvinsumos  |     at /var/www/controledeinsumos/server/routes/auth.js:123:19
```

## ✅ **SOLUÇÃO RÁPIDA:**

### 🔧 **Opção 1: Script Automático (RECOMENDADO)**

1. **Acesse a VPS via SSH:**
```bash
ssh root@insumos.escolamega.com.br
```

2. **Navegue até o projeto:**
```bash
cd /var/www/controledeinsumos
```

3. **Execute o script de correção:**
```bash
chmod +x fix-jwt-secret-production.sh
./fix-jwt-secret-production.sh
```

### 🔧 **Opção 2: Correção Manual**

1. **Acesse a VPS via SSH:**
```bash
ssh root@insumos.escolamega.com.br
```

2. **Navegue até o projeto:**
```bash
cd /var/www/controledeinsumos
```

3. **Verifique se existe o arquivo .env:**
```bash
ls -la .env
```

4. **Se não existir, crie o arquivo .env:**
```bash
cat > .env << EOF
# Configurações do Banco de Dados
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=almoxarifado
MYSQL_DATABASE=almoxarifado

# Configurações do JWT
JWT_SECRET=chave_secreta_almoxarifado_escolar_2024_muito_segura

# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Configurações do Frontend
NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api
EOF
```

5. **Se o arquivo .env já existe, adicione JWT_SECRET:**
```bash
echo "" >> .env
echo "# Configurações do JWT" >> .env
echo "JWT_SECRET=chave_secreta_almoxarifado_escolar_2024_muito_segura" >> .env
```

6. **Reinicie o PM2:**
```bash
pm2 restart srvinsumos
```

7. **Verifique os logs:**
```bash
pm2 logs srvinsumos
```

## 🔍 **VERIFICAÇÃO:**

### 📋 **Verificar se a correção funcionou:**

1. **Teste o login no sistema:**
   - Acesse: https://insumos.escolamega.com.br
   - Tente fazer login com um usuário existente

2. **Verifique os logs do PM2:**
```bash
pm2 logs srvinsumos --lines 20
```

3. **Verifique o status do PM2:**
```bash
pm2 status
```

### ✅ **Sinais de sucesso:**
- ✅ Login funciona sem erros
- ✅ Logs não mostram erro de JWT_SECRET
- ✅ PM2 mostra status "online"

## 🚨 **PROBLEMAS COMUNS:**

### ❌ **Se ainda houver erro:**

1. **Verifique se o arquivo .env foi criado:**
```bash
cat .env
```

2. **Verifique se JWT_SECRET está definido:**
```bash
grep JWT_SECRET .env
```

3. **Reinicie completamente o PM2:**
```bash
pm2 delete srvinsumos
pm2 start server/index.js --name srvinsumos
```

4. **Verifique as variáveis de ambiente:**
```bash
node check-env-production.js
```

## 🔐 **SEGURANÇA:**

### ⚠️ **IMPORTANTE:**
- A chave JWT_SECRET deve ser **única e segura**
- **Nunca** compartilhe a chave JWT_SECRET
- **Altere** a chave em produção para uma mais segura

### 🔑 **Gerar chave segura:**
```bash
# Gerar chave aleatória
openssl rand -base64 32
```

### 📝 **Exemplo de chave segura:**
```
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## 📊 **ESTRUTURA DO ARQUIVO .env:**

```env
# Configurações do Banco de Dados
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=almoxarifado
MYSQL_DATABASE=almoxarifado

# Configurações do JWT
JWT_SECRET=chave_secreta_almoxarifado_escolar_2024_muito_segura

# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Configurações do Frontend
NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api
```

## ✅ **RESULTADO ESPERADO:**

**Antes:**
```
❌ Erro no login: secretOrPrivateKey must have a value
```

**Depois:**
```
✅ Login realizado com sucesso
✅ Token JWT gerado corretamente
✅ Sistema funcionando normalmente
```

## 🎯 **PRÓXIMOS PASSOS:**

1. ✅ **Execute a correção** (script ou manual)
2. ✅ **Teste o login** no sistema
3. ✅ **Verifique os logs** do PM2
4. ✅ **Confirme** que o sistema está funcionando

**🎉 O erro de JWT_SECRET será resolvido e o sistema voltará a funcionar normalmente!** 