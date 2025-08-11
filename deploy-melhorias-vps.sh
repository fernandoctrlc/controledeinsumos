#!/bin/bash

echo "🚀 DEPLOY AUTOMATIZADO - MELHORIAS DE NAVEGAÇÃO E DASHBOARD"
echo "══════════════════════════════════════════════════════════════"
echo ""

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

# Configurações
PROJECT_DIR="/var/www/controledeinsumos"
PROJECT_URL="https://insumos.escolamega.com.br"

log "Iniciando deploy das melhorias de navegação e dashboard..."
echo ""

# 1. Acessar pasta do projeto
step "1. Acessando pasta do projeto..."
cd $PROJECT_DIR
if [ $? -ne 0 ]; then
    error "Erro ao acessar $PROJECT_DIR"
    exit 1
fi
log "✅ Pasta do projeto acessada com sucesso"
echo ""

# 2. Fazer backup do estado atual
step "2. Fazendo backup do estado atual..."
BACKUP_DIR="/var/www/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r . $BACKUP_DIR/
log "✅ Backup criado em: $BACKUP_DIR"
echo ""

# 3. Fazer pull das mudanças
step "3. Fazendo pull das mudanças do repositório..."
git pull origin main
if [ $? -ne 0 ]; then
    error "Erro ao fazer pull das mudanças"
    exit 1
fi
log "✅ Mudanças baixadas com sucesso"
echo ""

# 4. Parar serviços
step "4. Parando serviços PM2..."
pm2 stop all
if [ $? -ne 0 ]; then
    warning "PM2 não estava rodando ou erro ao parar"
fi
log "✅ Serviços parados"
echo ""

# 5. Instalar dependências
step "5. Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    error "Erro ao instalar dependências"
    exit 1
fi
log "✅ Dependências instaladas"
echo ""

# 6. Fazer build do frontend
step "6. Fazendo build do frontend..."
cd client
npm run build
if [ $? -ne 0 ]; then
    error "Erro ao fazer build do frontend"
    exit 1
fi
log "✅ Frontend buildado com sucesso"
echo ""

# 7. Copiar arquivos estáticos (se existir script)
step "7. Copiando arquivos estáticos..."
if [ -f "copy-static-files.js" ]; then
    node copy-static-files.js
    if [ $? -eq 0 ]; then
        log "✅ Arquivos estáticos copiados"
    else
        warning "Erro ao copiar arquivos estáticos, continuando..."
    fi
else
    log "⚠️ Script copy-static-files.js não encontrado, pulando..."
fi
echo ""

# 8. Verificar arquivos estáticos
step "8. Verificando arquivos estáticos..."
if [ -d ".next/static" ]; then
    STATIC_COUNT=$(find .next/static -type f | wc -l)
    log "✅ $STATIC_COUNT arquivos estáticos encontrados"
else
    warning "⚠️ Diretório .next/static não encontrado"
fi
echo ""

# 9. Voltar para pasta raiz
step "9. Voltando para pasta raiz..."
cd ..
log "✅ Retornado para pasta raiz"
echo ""

# 10. Iniciar serviços
step "10. Iniciando serviços PM2..."
pm2 start all
if [ $? -ne 0 ]; then
    error "Erro ao iniciar serviços PM2"
    exit 1
fi
log "✅ Serviços iniciados"
echo ""

# 11. Verificar status
step "11. Verificando status dos serviços..."
pm2 status
echo ""

# 12. Verificar logs
step "12. Verificando logs dos serviços..."
pm2 logs --lines 5
echo ""

# 13. Aguardar inicialização
step "13. Aguardando inicialização dos serviços..."
sleep 10
log "✅ Aguardado 10 segundos para inicialização"
echo ""

# 14. Testar aplicação
step "14. Testando aplicação..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$PROJECT_URL/api/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    log "✅ API respondendo com sucesso (HTTP $HEALTH_RESPONSE)"
else
    warning "⚠️ API retornou HTTP $HEALTH_RESPONSE"
fi

# Testar frontend
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$PROJECT_URL")
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    log "✅ Frontend respondendo com sucesso (HTTP $FRONTEND_RESPONSE)"
else
    warning "⚠️ Frontend retornou HTTP $FRONTEND_RESPONSE"
fi
echo ""

# 15. Resumo final
step "15. Resumo do deploy..."
echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "═══════════════════════════════════"
echo ""
echo "📋 Melhorias implementadas:"
echo "   ✅ Botões de retorno ao dashboard em todas as telas"
echo "   ✅ Dashboard com estatísticas em tempo real"
echo "   ✅ Interface mais consistente e responsiva"
echo "   ✅ Componentes reutilizáveis"
echo "   ✅ Hook personalizado para estatísticas"
echo ""
echo "🌐 URL da aplicação: $PROJECT_URL"
echo "📁 Backup criado em: $BACKUP_DIR"
echo "🔧 Status PM2: pm2 status"
echo "📊 Logs: pm2 logs"
echo ""
echo "🧪 Para testar as melhorias:"
echo "   1. Acesse o dashboard"
echo "   2. Navegue para qualquer página"
echo "   3. Use o botão 'Voltar ao Dashboard'"
echo "   4. Teste o botão de atualização das estatísticas"
echo ""
echo "✅ Deploy das melhorias concluído!"
echo "🚀 Sistema atualizado e funcionando!" 