# Documentação da API - Almoxarifado Escolar

## Base URL
```
http://localhost:3001/api
```

## Autenticação
A API usa JWT (JSON Web Tokens) para autenticação. O token deve ser enviado no header `Authorization` como `Bearer <token>`.

## Endpoints

### Autenticação

#### POST /auth/registro
Criar nova conta de usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@escola.com",
  "senha": "123456",
  "perfil": "professor"
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "token": "jwt_token_aqui",
  "usuario": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao@escola.com",
    "perfil": "professor"
  }
}
```

#### POST /auth/login
Fazer login na aplicação.

**Body:**
```json
{
  "email": "joao@escola.com",
  "senha": "123456"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "jwt_token_aqui",
  "usuario": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao@escola.com",
    "perfil": "professor"
  }
}
```

#### GET /auth/perfil
Obter dados do usuário logado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "usuario": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao@escola.com",
    "perfil": "professor",
    "ativo": true,
    "ultimoAcesso": "2024-01-01T10:00:00.000Z"
  }
}
```

#### POST /auth/logout
Fazer logout (opcional).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

#### POST /auth/alterar-senha
Alterar senha do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "senhaAtual": "123456",
  "novaSenha": "nova123456"
}
```

**Response:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

### Materiais

#### GET /materials
Listar materiais (todos os perfis podem ver).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)
- `search` (opcional): Busca por nome
- `categoria` (opcional): Filtrar por categoria
- `estoqueBaixo` (opcional): Filtrar apenas estoque baixo (true/false)

**Response:**
```json
{
  "materiais": [
    {
      "id": "material_id",
      "nome": "Papel A4",
      "unidadeDeMedida": "pacote",
      "quantidade": 50,
      "quantidadeMinima": 10,
      "descricao": "Papel A4 75g",
      "categoria": "Papelaria",
      "ativo": true,
      "criadoPor": {
        "id": "user_id",
        "nome": "Pedro Oliveira"
      },
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 1,
    "paginas": 1
  }
}
```

#### GET /materials/:id
Buscar material específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "material": {
    "id": "material_id",
    "nome": "Papel A4",
    "unidadeDeMedida": "pacote",
    "quantidade": 50,
    "quantidadeMinima": 10,
    "descricao": "Papel A4 75g",
    "categoria": "Papelaria",
    "ativo": true,
    "criadoPor": {
      "id": "user_id",
      "nome": "Pedro Oliveira"
    },
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### POST /materials
Criar novo material (apenas almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Novo Material",
  "unidadeDeMedida": "unidade",
  "quantidade": 100,
  "quantidadeMinima": 20,
  "descricao": "Descrição do material",
  "categoria": "Papelaria"
}
```

**Response:**
```json
{
  "message": "Material criado com sucesso",
  "material": {
    "id": "material_id",
    "nome": "Novo Material",
    "unidadeDeMedida": "unidade",
    "quantidade": 100,
    "quantidadeMinima": 20,
    "descricao": "Descrição do material",
    "categoria": "Papelaria",
    "ativo": true,
    "criadoPor": "user_id",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### PUT /materials/:id
Atualizar material (apenas almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Material Atualizado",
  "quantidade": 150,
  "quantidadeMinima": 25
}
```

**Response:**
```json
{
  "message": "Material atualizado com sucesso",
  "material": {
    "id": "material_id",
    "nome": "Material Atualizado",
    "unidadeDeMedida": "unidade",
    "quantidade": 150,
    "quantidadeMinima": 25,
    "descricao": "Descrição do material",
    "categoria": "Papelaria",
    "ativo": true,
    "criadoPor": "user_id",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### DELETE /materials/:id
Desativar material (apenas almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Material desativado com sucesso"
}
```

#### POST /materials/:id/adicionar-estoque
Adicionar quantidade ao estoque (apenas almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "quantidade": 50
}
```

**Response:**
```json
{
  "message": "Estoque atualizado com sucesso",
  "material": {
    "id": "material_id",
    "nome": "Papel A4",
    "quantidade": 100
  }
}
```

#### GET /materials/estoque/baixo
Listar materiais com estoque baixo.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "materiais": [
    {
      "id": "material_id",
      "nome": "Papel A4",
      "quantidade": 5,
      "quantidadeMinima": 10
    }
  ]
}
```

#### GET /materials/categorias
Listar categorias disponíveis.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "categorias": ["Papelaria", "Material Escolar", "Informática"]
}
```

### Requisições

#### GET /requisitions
Listar requisições (filtrado por perfil).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)
- `status` (opcional): Filtrar por status (pendente/aprovada/rejeitada)
- `prioridade` (opcional): Filtrar por prioridade (baixa/media/alta/urgente)
- `dataInicio` (opcional): Data de início (YYYY-MM-DD)
- `dataFim` (opcional): Data de fim (YYYY-MM-DD)

**Response:**
```json
{
  "requisicoes": [
    {
      "id": "requisicao_id",
      "solicitante": {
        "id": "user_id",
        "nome": "João Silva",
        "email": "joao@escola.com"
      },
      "material": {
        "id": "material_id",
        "nome": "Papel A4",
        "unidadeDeMedida": "pacote"
      },
      "quantidade": 5,
      "status": "pendente",
      "justificativa": "Necessário para atividades escolares",
      "observacoes": "Urgente para próxima semana",
      "prioridade": "alta",
      "dataNecessidade": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 1,
    "paginas": 1
  }
}
```

#### GET /requisitions/:id
Buscar requisição específica.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "requisicao": {
    "id": "requisicao_id",
    "solicitante": {
      "id": "user_id",
      "nome": "João Silva",
      "email": "joao@escola.com"
    },
    "material": {
      "id": "material_id",
      "nome": "Papel A4",
      "unidadeDeMedida": "pacote",
      "quantidade": 50
    },
    "quantidade": 5,
    "status": "pendente",
    "justificativa": "Necessário para atividades escolares",
    "observacoes": "Urgente para próxima semana",
    "prioridade": "alta",
    "dataNecessidade": "2024-01-15T00:00:00.000Z",
    "aprovadoPor": null,
    "dataAprovacao": null,
    "motivoRejeicao": null,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### POST /requisitions
Criar nova requisição (apenas professor).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "material": "material_id",
  "quantidade": 5,
  "justificativa": "Necessário para atividades escolares",
  "observacoes": "Urgente para próxima semana",
  "prioridade": "alta",
  "dataNecessidade": "2024-01-15"
}
```

**Response:**
```json
{
  "message": "Requisição criada com sucesso",
  "requisicao": {
    "id": "requisicao_id",
    "solicitante": "user_id",
    "material": "material_id",
    "quantidade": 5,
    "status": "pendente",
    "justificativa": "Necessário para atividades escolares",
    "observacoes": "Urgente para próxima semana",
    "prioridade": "alta",
    "dataNecessidade": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### PUT /requisitions/:id/aprovar
Aprovar requisição (coordenador e almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Requisição aprovada com sucesso",
  "requisicao": {
    "id": "requisicao_id",
    "status": "aprovada",
    "aprovadoPor": "user_id",
    "dataAprovacao": "2024-01-01T10:00:00.000Z"
  }
}
```

#### PUT /requisitions/:id/rejeitar
Rejeitar requisição (coordenador e almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "motivoRejeicao": "Estoque insuficiente"
}
```

**Response:**
```json
{
  "message": "Requisição rejeitada com sucesso",
  "requisicao": {
    "id": "requisicao_id",
    "status": "rejeitada",
    "aprovadoPor": "user_id",
    "dataAprovacao": "2024-01-01T10:00:00.000Z",
    "motivoRejeicao": "Estoque insuficiente"
  }
}
```

#### GET /requisitions/estatisticas
Obter estatísticas das requisições.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "estatisticas": {
    "pendentes": 5,
    "aprovadas": 20,
    "rejeitadas": 3,
    "total": 28
  },
  "porPrioridade": [
    {
      "_id": "baixa",
      "count": 10
    },
    {
      "_id": "media",
      "count": 15
    },
    {
      "_id": "alta",
      "count": 3
    }
  ]
}
```

#### GET /requisitions/pendentes
Listar requisições pendentes (coordenador e almoxarife).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)

**Response:**
```json
{
  "requisicoes": [
    {
      "id": "requisicao_id",
      "solicitante": {
        "id": "user_id",
        "nome": "João Silva",
        "email": "joao@escola.com"
      },
      "material": {
        "id": "material_id",
        "nome": "Papel A4",
        "unidadeDeMedida": "pacote",
        "quantidade": 50
      },
      "quantidade": 5,
      "status": "pendente",
      "justificativa": "Necessário para atividades escolares",
      "prioridade": "alta",
      "dataNecessidade": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 1,
    "paginas": 1
  }
}
```

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Perfis de Usuário

### Professor
- Pode criar requisições
- Pode visualizar suas próprias requisições
- Pode ver materiais disponíveis

### Coordenador
- Pode aprovar/rejeitar requisições
- Pode visualizar todas as requisições
- Pode ver materiais disponíveis

### Almoxarife
- Pode gerenciar materiais (CRUD completo)
- Pode aprovar/rejeitar requisições
- Pode visualizar todas as requisições
- Pode adicionar estoque

## Unidades de Medida

- `unidade` - Unidade individual
- `kg` - Quilograma
- `g` - Grama
- `l` - Litro
- `ml` - Mililitro
- `m` - Metro
- `cm` - Centímetro
- `caixa` - Caixa
- `pacote` - Pacote
- `rolo` - Rolo
- `folha` - Folha

## Status de Requisições

- `pendente` - Aguardando aprovação
- `aprovada` - Requisição aprovada
- `rejeitada` - Requisição rejeitada

## Prioridades

- `baixa` - Prioridade baixa
- `media` - Prioridade média
- `alta` - Prioridade alta
- `urgente` - Prioridade urgente 