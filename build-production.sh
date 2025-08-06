#!/bin/bash

echo "🚀 Iniciando build de produção..."

# Definir variáveis de ambiente para produção
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://insumos.escolamega.com.br/api

echo "📦 Instalando dependências..."
cd client && npm install

echo "🔨 Fazendo build do frontend..."
npm run build

echo "✅ Build de produção concluído!"
echo "📁 Pasta build criada em: client/.next"
echo "🌐 URL da API configurada para: https://insumos.escolamega.com.br/api" 