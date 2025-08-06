# 🔧 CORREÇÃO DO ENUM NO BANCO DE PRODUÇÃO

## 🐛 Problema Identificado

**Erro no PM2:**
```
sql: 'INSERT INTO `materials` (`id`,`nome`,`unidade_de_medida`,`quantidade`,`quantidade_minima`,`descricao`,`categoria`,`ativo`,`criado_por`,`created_at`,`updated_at`) VALUES (DEFAULT,?,?,?,?,?,?,?,?,?,?);',
parameters: [
  'tests',
  'litro',  ← ERRO: 'litro' não está no ENUM
  22,
  22,
  '22',
  'Papelaria',
  true,
  5,
  '2025-08-06 21:16:00',
  '2025-08-06 21:16:00'
]
```

**Causa:** O ENUM `unidade_de_medida` no banco de produção não inclui todos os valores necessários.

## 🔍 Análise

### ENUM Atual (Produção):
```sql
ENUM('unidade', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'caixa', 'pacote', 'rolo', 'folha')
```

### ENUM Necessário (Desenvolvimento):
```sql
ENUM('unidade', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'caixa', 'pacote', 'rolo', 'folha', 'litro', 'quilo', 'metro', 'resma', 'fardo')
```

### Valores Faltantes:
- `litro`
- `quilo` 
- `metro`
- `resma`
- `fardo`

## 🔧 Solução

### 1. **Atualizar Modelo Material**
**Arquivo:** `server/models/Material.js`

```javascript
unidadeDeMedida: {
  type: DataTypes.ENUM('unidade', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'caixa', 'pacote', 'rolo', 'folha', 'litro', 'quilo', 'metro', 'resma', 'fardo'),
  allowNull: false
},
```

### 2. **Script de Correção**
**Arquivo:** `fix-producao-enum.js`

O script executa:
1. Verifica ENUM atual
2. Altera ENUM para incluir novos valores
3. Testa inserção com 'litro'
4. Remove teste
5. Confirma correção

### 3. **Comando de Deploy**
```bash
cd /var/www/controledeinsumos && git pull origin main && pm2 stop all && node fix-producao-enum.js && npm install && cd client && npm run build && cd .. && pm2 start all
```

## 📋 Passos para Correção

### ✅ Desenvolvimento (Local)
1. ✅ Modelo atualizado
2. ✅ Script de correção criado
3. ✅ Commit e push realizados

### 🔄 Produção (VPS)
1. **Acessar VPS**
2. **Executar comando de deploy**
3. **Verificar logs do PM2**
4. **Testar cadastro de produtos**

## 🧪 Teste Pós-Correção

### URL de Teste:
```
https://insumos.escolamega.com.br/produtos/novo
```

### Dados de Teste:
- **Nome:** Produto Teste
- **Unidade:** litro
- **Quantidade:** 10
- **Quantidade Mínima:** 5
- **Categoria:** Papelaria

## 🎯 Resultado Esperado

**✅ Após a correção:**
- ENUM atualizado com novos valores
- Cadastro de produtos funcionando
- Sem erros no PM2
- Sistema operacional

**❌ Se não corrigir:**
- Erro de ENUM no PM2
- Cadastro de produtos falhando
- Sistema instável

## 🚀 Comando Final

Execute na VPS:
```bash
cd /var/www/controledeinsumos && git pull origin main && pm2 stop all && node fix-producao-enum.js && npm install && cd client && npm run build && cd .. && pm2 start all
```

**🎉 Após executar, o sistema estará funcionando corretamente!** 