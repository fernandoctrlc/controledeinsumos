# Almoxarifado Escolar PWA

Um Progressive Web App (PWA) responsivo para controle de insumos escolares, desenvolvido com Node.js, Express, MongoDB e React.

## 🚀 Funcionalidades

- **PWA Instalável**: Pode ser instalado na tela inicial de qualquer dispositivo
- **Funcionamento Offline**: Service Worker para cache e funcionamento sem internet
- **Interface Responsiva**: Adaptada para desktop e dispositivos móveis
- **Sistema de Autenticação**: JWT com três perfis de usuário
- **Gestão de Estoque**: Controle completo de materiais (apenas almoxarife)
- **Sistema de Requisições**: Fluxo completo de solicitação e aprovação

## 👥 Perfis de Usuário

- **Professor**: Pode criar requisições e visualizar histórico
- **Coordenador**: Pode aprovar/rejeitar requisições
- **Almoxarife**: Gerencia estoque e aprova requisições

## 🛠️ Tecnologias

- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React, Next.js, PWA
- **Banco de Dados**: MongoDB

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB instalado e rodando
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd almoxarifado-escolar-pwa
```

2. **Instale as dependências**
```bash
npm run install:all
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações:
```
MONGODB_URI=mongodb://localhost:27017/almoxarifado
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
```

4. **Inicie o desenvolvimento**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001` e o cliente em `http://localhost:3000`.

## 📱 Como Instalar como PWA

1. Acesse a aplicação no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou use o menu do navegador para "Adicionar à tela inicial"

## 🏗️ Estrutura do Projeto

```
almoxarifado-escolar-pwa/
├── server/                 # Backend Node.js/Express
│   ├── models/            # Modelos MongoDB
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares (auth, etc.)
│   └── index.js          # Servidor principal
├── client/                # Frontend React/Next.js
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas da aplicação
│   ├── public/           # Arquivos estáticos (manifest, sw)
│   └── styles/           # Estilos CSS
├── package.json          # Dependências do servidor
└── README.md            # Este arquivo
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. Os tokens são armazenados no localStorage e enviados automaticamente nas requisições da API.

## 📊 Banco de Dados

O MongoDB é usado com as seguintes coleções:
- `users`: Usuários do sistema
- `materials`: Materiais em estoque
- `requisitions`: Requisições de materiais

## 🚀 Deploy

Para fazer deploy em produção:

1. **Build do cliente**
```bash
npm run build
```

2. **Configure as variáveis de ambiente de produção**
3. **Inicie o servidor**
```bash
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. 