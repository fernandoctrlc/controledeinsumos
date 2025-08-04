# Dockerfile para Almoxarifado Escolar PWA

# Estágio 1: Build do cliente
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# Copiar package.json e instalar dependências
COPY client/package*.json ./
RUN npm ci --only=production

# Copiar código fonte do cliente
COPY client/ ./

# Build do cliente
RUN npm run build

# Estágio 2: Build do servidor
FROM node:18-alpine AS server-builder

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte do servidor
COPY server/ ./server/

# Estágio 3: Imagem de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instalar dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte do servidor
COPY server/ ./server/

# Copiar build do cliente
COPY --from=client-builder /app/client/.next ./client/.next
COPY --from=client-builder /app/client/public ./client/public

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Mudar propriedade dos arquivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta
EXPOSE 3001

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar a aplicação
CMD ["node", "server/index.js"] 