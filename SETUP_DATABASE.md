# 🗄️ Setup do Banco de Dados - ChegouAí Delivery

## 📋 Resumo

Este guia explica como configurar o banco de dados PostgreSQL na Locaweb com o novo schema `chegouai` e dados de teste.

## 🚀 Início Rápido

### Opção 1: Automático (Recomendado)

```bash
# No servidor ou localmente
npm run db:setup
```

Este comando irá:
1. ✅ Criar schema `chegouai`
2. ✅ Criar todas as 14 tabelas
3. ✅ Inserir dados de teste
4. ✅ Criar índices para performance

### Opção 2: Manual (Passo a Passo)

#### 1. Criar Schema Novo
```bash
npm run db:connect
# Depois execute:
# CREATE SCHEMA IF NOT EXISTS chegouai;
```

#### 2. Aplicar Schema de Tabelas
```bash
# Copie o conteúdo de docs/db-schema-new.sql
# Cole no SQL Editor do painel Locaweb
# Ou execute via SSH:
psql -h delivery_linux.postgresql.dbaas.com.br \
     -U delivery_linux \
     -d delivery_infra \
     -f docs/db-schema-new.sql
```

#### 3. Inserir Dados de Teste
```bash
# Copie o conteúdo de docs/db-seed-data.sql
# Cole no SQL Editor do painel Locaweb
# Ou execute via SSH:
psql -h delivery_linux.postgresql.dbaas.com.br \
     -U delivery_linux \
     -d delivery_infra \
     -f docs/db-seed-data.sql
```

## 🔐 Credenciais de Teste

Após executar o setup, use estas credenciais para testar:

### Admin
- **Email**: `admin@chegouai.com`
- **Senha**: `teste12345678`
- **Código Empresa**: `PAD001`
- **Role**: Admin

### Usuário Comum
- **Email**: `usuario@chegouai.com`
- **Senha**: `teste12345678`
- **Código Empresa**: `PAD001`
- **Role**: User

## 📊 Estrutura do Banco

### Tabelas Criadas (14 no total)

| Tabela | Descrição |
|--------|-----------|
| `companies` | Empresas (multi-tenant) |
| `users` | Usuários do sistema |
| `businesses` | Lojas/Restaurantes |
| `categories` | Categorias de produtos |
| `products` | Produtos/Cardápio |
| `customers` | Clientes |
| `orders` | Pedidos |
| `payments` | Pagamentos |
| `deliveries` | Entregas |
| `promotions` | Promoções/Cupons |
| `loyalty_programs` | Programas de fidelização |
| `customer_loyalty` | Pontos do cliente |
| `reviews` | Avaliações |
| `notifications` | Notificações |

### Dados de Teste Inclusos

- **1 Empresa**: PAD001 (ChegouAí Teste)
- **2 Usuários**: Admin e Usuário comum
- **2 Negócios**: Pizzaria do João e Burger King Local
- **4 Categorias**: Pizzas, Bebidas, Hambúrgueres, Acompanhamentos
- **7 Produtos**: Com preços e tempo de preparo
- **2 Clientes**: João Silva e Maria Santos
- **2 Promoções**: Desconto percentual e fixo

## 🔧 Variáveis de Ambiente

O arquivo `.env` foi criado com as seguintes configurações:

```env
# Banco de Dados
DB_HOST=delivery_linux.postgresql.dbaas.com.br
DB_PORT=5432
DB_USER=delivery_linux
DB_PASSWORD=Carlos190702@@
DB_NAME=delivery_infra
DB_SCHEMA=chegouai
DB_SSL=true

# Aplicação
NODE_ENV=production
PORT=4173
```

## 📝 Comandos Disponíveis

```bash
# Testar conexão com banco
npm run db:connect

# Aplicar schema antigo (não use, apenas para referência)
npm run db:init

# Setup completo (novo schema + dados)
npm run db:setup

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## ✅ Verificação Pós-Setup

Após executar `npm run db:setup`, você verá:

```
✅ Conectado ao banco de dados
📦 Criando schema chegouai...
✅ Schema chegouai criado
📋 Aplicando schema de tabelas...
✅ Schema de tabelas aplicado
🌱 Inserindo dados de teste...
✅ Dados de teste inseridos
🔍 Verificando dados inseridos...
   - Empresas: 1
   - Usuários: 2
   - Produtos: 7
✅ Setup do banco concluído com sucesso!
```

## 🚀 Próximos Passos

1. **Executar setup**: `npm run db:setup`
2. **Testar login**: Usar credenciais de teste
3. **Verificar dados**: Acessar painel admin
4. **Deploy**: Fazer push e deploy no servidor

## 🆘 Troubleshooting

### Erro: "column does not exist"
- Significa que o schema antigo ainda existe
- Solução: Use `db-schema-migration.sql` em vez de `db-schema-new.sql`

### Erro: "connection refused"
- Verifique se as variáveis de ambiente estão corretas
- Teste com: `npm run db:connect`

### Erro: "permission denied"
- Verifique se o usuário `delivery_linux` tem permissões
- Contate suporte Locaweb se necessário

## 📞 Suporte

Para dúvidas sobre o setup:
1. Verifique o arquivo `.env`
2. Teste a conexão: `npm run db:connect`
3. Consulte os logs de erro
4. Contate o suporte Locaweb se necessário

---

**Última atualização**: 28/03/2026
