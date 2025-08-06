# Configuração da API - Detecção Automática de Ambiente

## 🔧 Mudanças Implementadas

### 1. **Detecção Automática de Ambiente** (`client/lib/api.js`)

O sistema agora detecta automaticamente se está em produção ou desenvolvimento:

```javascript
const getApiBaseUrl = () => {
  // Se a variável de ambiente estiver definida, usar ela
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Se estiver em produção (não localhost), usar o domínio
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `https://${window.location.hostname}/api`;
  }
  
  // Em desenvolvimento, usar localhost
  return 'http://localhost:3001/api';
};
```

### 2. **Configuração do Next.js** (`client/next.config.js`)

O proxy reverso também detecta automaticamente o ambiente:

```javascript
const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = isProduction 
  ? 'https://insumos.escolamega.com.br/api/:path*'
  : 'http://localhost:3001/api/:path*';
```

## 🚀 Como Funciona

### **Desenvolvimento (localhost)**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`
- Proxy: `http://localhost:3001/api/:path*`

### **Produção (VPS)**
- Frontend: `https://insumos.escolamega.com.br`
- Backend: `https://insumos.escolamega.com.br/api`
- Proxy: `https://insumos.escolamega.com.br/api/:path*`

## 📋 Scripts Disponíveis

### **Build de Produção**
```bash
./build-production.sh
```

Este script:
1. Define `NODE_ENV=production`
2. Define `NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api`
3. Instala dependências
4. Faz o build do frontend

## 🔍 Teste das Configurações

### **Teste Local**
```bash
# Desenvolvimento
npm run dev
# API será: http://localhost:3001/api
```

### **Teste Produção**
```bash
# Build de produção
./build-production.sh
# API será: https://insumos.escolamega.com.br/api
```

## ✅ Benefícios

1. **Detecção Automática**: Não precisa configurar manualmente
2. **Flexibilidade**: Funciona em qualquer ambiente
3. **Segurança**: HTTPS em produção
4. **Simplicidade**: Um comando para build de produção

## 🎯 Resultado

Agora o frontend irá automaticamente:
- Em desenvolvimento: buscar `localhost:3001/api`
- Em produção: buscar `insumos.escolamega.com.br/api`

**Problema resolvido! 🎉** 