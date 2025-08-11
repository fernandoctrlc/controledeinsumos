# 🏢 Sistema de Departamentos - Controle de Insumos

## 📋 **Visão Geral**

O sistema de departamentos foi implementado para permitir que coordenadores gerenciem os departamentos da escola, que serão utilizados no lançamento de requisições de materiais.

## 🎯 **Funcionalidades Implementadas**

### **1. Gerenciamento de Departamentos**
- ✅ **Criar departamento** - Apenas coordenadores
- ✅ **Editar departamento** - Apenas coordenadores  
- ✅ **Desativar departamento** - Soft delete (apenas coordenadores)
- ✅ **Listar departamentos** - Todos os usuários autenticados
- ✅ **Buscar departamentos** - Por nome, sigla ou responsável
- ✅ **Filtrar por status** - Ativos/Inativos

### **2. Campos do Departamento**
- **Nome** - Nome completo do departamento (obrigatório, único)
- **Sigla** - Abreviação do departamento (obrigatório, único)
- **Descrição** - Descrição das responsabilidades
- **Responsável** - Nome do responsável pelo departamento
- **Email** - Email de contato do departamento
- **Telefone** - Telefone de contato
- **Status** - Ativo/Inativo
- **Criado por** - Usuário que criou o departamento
- **Timestamps** - Data de criação e atualização

### **3. Permissões de Acesso**
| Perfil | Criar | Editar | Desativar | Visualizar |
|---------|--------|--------|-----------|------------|
| **Professor** | ❌ | ❌ | ❌ | ✅ |
| **Coordenador** | ✅ | ✅ | ✅ | ✅ |
| **Almoxarife** | ❌ | ❌ | ❌ | ✅ |
| **Administrador** | ✅ | ✅ | ✅ | ✅ |

## 🏗️ **Arquitetura Técnica**

### **Backend (Server)**
- **Modelo**: `server/models/Departamento.js`
- **Rotas**: `server/routes/departamentos.js`
- **Middleware**: Autenticação e autorização por perfil
- **Banco**: MySQL com Sequelize ORM

### **Frontend (Client)**
- **Página Principal**: `client/app/departamentos/page.js`
- **Página de Criação**: `client/app/departamentos/novo/page.js`
- **API**: `client/lib/api.js` (departamentosAPI)
- **Componentes**: Reutilização de componentes existentes

### **Banco de Dados**
- **Tabela**: `departamentos`
- **Índices**: Nome, sigla, status, criadoPor
- **Constraints**: Nome e sigla únicos, FK para Users
- **Engine**: InnoDB com charset UTF8MB4

## 🚀 **Como Usar**

### **1. Acesso ao Sistema**
1. **Login como Coordenador**
2. **Dashboard** → Menu "Departamentos"
3. **Ação Rápida** → "Gerenciar Departamentos"

### **2. Criar Departamento**
1. Acessar `/departamentos`
2. Clicar em "Novo Departamento"
3. Preencher formulário:
   - Nome (obrigatório)
   - Sigla (obrigatório)
   - Responsável (opcional)
   - Email (opcional)
   - Telefone (opcional)
   - Descrição (opcional)
4. Clicar em "Criar Departamento"

### **3. Editar Departamento**
1. Acessar `/departamentos`
2. Clicar no ícone de edição (lápis)
3. Modificar campos desejados
4. Salvar alterações

### **4. Desativar Departamento**
1. Acessar `/departamentos`
2. Clicar no ícone de lixeira
3. Confirmar desativação

## 📊 **Estrutura da Tabela**

```sql
CREATE TABLE departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  sigla VARCHAR(10) NOT NULL UNIQUE,
  descricao TEXT,
  responsavel VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criadoPor INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_nome (nome),
  INDEX idx_sigla (sigla),
  INDEX idx_ativo (ativo),
  INDEX idx_criadoPor (criadoPor),
  
  FOREIGN KEY (criadoPor) REFERENCES Users(id) ON DELETE RESTRICT
);
```

## 🔧 **APIs Disponíveis**

### **GET /api/departamentos**
- **Descrição**: Listar departamentos com paginação e filtros
- **Parâmetros**: `page`, `limit`, `search`, `ativo`
- **Permissão**: Usuários autenticados

### **GET /api/departamentos/ativos**
- **Descrição**: Listar apenas departamentos ativos
- **Permissão**: Usuários autenticados

### **GET /api/departamentos/:id**
- **Descrição**: Buscar departamento específico
- **Permissão**: Usuários autenticados

### **POST /api/departamentos**
- **Descrição**: Criar novo departamento
- **Permissão**: Apenas coordenadores

### **PUT /api/departamentos/:id**
- **Descrição**: Atualizar departamento existente
- **Permissão**: Apenas coordenadores

### **DELETE /api/departamentos/:id**
- **Descrição**: Desativar departamento (soft delete)
- **Permissão**: Apenas coordenadores

## 📱 **Interface do Usuário**

### **Dashboard**
- **Menu**: "Departamentos" adicionado para coordenadores
- **Ação Rápida**: "Gerenciar Departamentos" com ícone Building2

### **Listagem de Departamentos**
- **Cards**: Exibição em grid responsivo
- **Filtros**: Busca por texto e status
- **Ações**: Visualizar, editar, desativar (por perfil)

### **Formulário de Criação/Edição**
- **Validação**: Campos obrigatórios e formatos
- **UX**: Ícones intuitivos e feedback visual
- **Responsivo**: Adaptado para mobile e desktop

## 🧪 **Testes e Validação**

### **Script de Migração**
- **Arquivo**: `create-departamentos-table.js`
- **Função**: Criar tabela e inserir dados de exemplo
- **Execução**: `node create-departamentos-table.js`

### **Dados de Exemplo**
- DMAT: Departamento de Matemática
- DPORT: Departamento de Português
- DCIEN: Departamento de Ciências
- DHIST: Departamento de História
- DEFIS: Departamento de Educação Física

## 🔮 **Próximos Passos**

### **1. Integração com Requisições**
- Adicionar campo `departamento` ao modelo de Requisição
- Atualizar formulários de requisição para incluir seleção de departamento
- Implementar relatórios por departamento

### **2. Funcionalidades Adicionais**
- Histórico de alterações de departamentos
- Notificações para responsáveis de departamento
- Relatórios de uso de materiais por departamento

### **3. Melhorias de UX**
- Drag & drop para reordenação de departamentos
- Filtros avançados e busca inteligente
- Exportação de dados para Excel/PDF

## 🚨 **Considerações Importantes**

### **Segurança**
- Validação de entrada em todas as APIs
- Verificação de permissões por perfil de usuário
- Sanitização de dados antes de salvar no banco

### **Performance**
- Índices otimizados para consultas frequentes
- Paginação para listagens grandes
- Cache de departamentos ativos

### **Manutenibilidade**
- Código modular e reutilizável
- Documentação completa das APIs
- Tratamento de erros consistente

---

## 📞 **Suporte**

Para dúvidas ou problemas com o sistema de departamentos:
1. Verificar logs do servidor
2. Validar permissões do usuário
3. Confirmar estrutura da tabela no banco
4. Testar APIs individualmente

**Sistema implementado e testado com sucesso!** 🎉 