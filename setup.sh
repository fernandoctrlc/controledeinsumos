#!/bin/bash

echo "🚀 Configurando Almoxarifado Escolar PWA..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências do servidor
echo "📦 Instalando dependências do servidor..."
npm install

# Instalar dependências do cliente
echo "📦 Instalando dependências do cliente..."
cd client
npm install
cd ..

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "🔧 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Por favor, edite as configurações conforme necessário."
fi

# Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p client/public/icons
mkdir -p client/public/screenshots

# Criar ícones básicos (placeholders)
echo "🎨 Criando ícones básicos..."
for size in 16 32 72 96 128 144 152 192 384 512; do
    if [ ! -f "client/public/icons/icon-${size}x${size}.png" ]; then
        echo "Criando ícone ${size}x${size}..."
        # Aqui você pode adicionar lógica para gerar ícones reais
        # Por enquanto, apenas criamos arquivos vazios como placeholders
        touch "client/public/icons/icon-${size}x${size}.png"
    fi
done

# Criar favicon
if [ ! -f "client/public/favicon.ico" ]; then
    echo "Criando favicon..."
    touch "client/public/favicon.ico"
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o MongoDB e atualize a URI no arquivo .env"
echo "2. Execute 'npm run dev' para iniciar o desenvolvimento"
echo "3. Acesse http://localhost:3000 para ver a aplicação"
echo ""
echo "📱 Para instalar como PWA:"
echo "- Acesse a aplicação no navegador"
echo "- Clique no ícone de instalação na barra de endereços"
echo "- Ou use o menu do navegador para 'Adicionar à tela inicial'"
echo ""
echo "🔧 Comandos úteis:"
echo "- npm run dev: Inicia o desenvolvimento"
echo "- npm run build: Faz o build para produção"
echo "- npm start: Inicia o servidor de produção"
echo "" 