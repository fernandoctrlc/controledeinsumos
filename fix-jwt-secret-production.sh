#!/bin/bash

echo "🔧 CORREÇÃO: JWT_SECRET não definido na produção"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

echo "📋 Verificando arquivo .env..."

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado"
    echo "📝 Criando arquivo .env..."
    
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

    echo "✅ Arquivo .env criado com sucesso"
else
    echo "✅ Arquivo .env encontrado"
    
    # Verificar se JWT_SECRET está definido
    if grep -q "JWT_SECRET=" .env; then
        echo "✅ JWT_SECRET já está definido no .env"
    else
        echo "❌ JWT_SECRET não está definido no .env"
        echo "📝 Adicionando JWT_SECRET ao .env..."
        
        # Adicionar JWT_SECRET ao final do arquivo
        echo "" >> .env
        echo "# Configurações do JWT" >> .env
        echo "JWT_SECRET=chave_secreta_almoxarifado_escolar_2024_muito_segura" >> .env
        
        echo "✅ JWT_SECRET adicionado ao .env"
    fi
fi

echo ""
echo "📋 Conteúdo atual do .env:"
echo "=========================="
cat .env

echo ""
echo "🔄 Reiniciando PM2..."

# Parar o processo atual
pm2 stop srvinsumos 2>/dev/null || echo "⚠️ Processo não estava rodando"

# Iniciar novamente
pm2 start server/index.js --name srvinsumos

echo ""
echo "📊 Status do PM2:"
pm2 status

echo ""
echo "📋 Logs do PM2 (últimas 10 linhas):"
pm2 logs srvinsumos --lines 10

echo ""
echo "✅ CORREÇÃO CONCLUÍDA!"
echo "🎯 O erro de JWT_SECRET deve estar resolvido"
echo "📱 Teste o login novamente no sistema" 