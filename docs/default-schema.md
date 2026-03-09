# Schema padrão multiempresa

Para garantir que cada empresa receba um namespace isolado, adotamos este padrão:

1. **Schema público (`public`)** - mantém as tabelas mães (`companies`, `users`, `businesses`, `products`, `orders`). Essas tabelas registram cada empresa e seus dados globais.
2. **Schemas por empresa** - cada empresa recebe um schema com o mesmo nome do campo `schema_name` (ex.: `padaria_pad001`). Esse schema conterá tabelas específicas de catálogo/relatórios caso seja necessário (até lá, o comportamento padrão usa o schema público). 
3. **Lookup de schema** - o campo `schema_name` em `companies` define qual search_path aplicar quando o usuário daquela empresa fizer login. O helper `userService.getActiveSchema()` retorna esse valor, permitindo aplicar `SET search_path TO :schema` antes de qualquer query real.

## Passos para provisionar um schema padrão

```sql
-- 1. Crie o schema da empresa
CREATE SCHEMA IF NOT EXISTS padaria_pad001;

-- 2. Crie tabelas específicas, se necessário (ex.: pedidos históricos)
CREATE TABLE IF NOT EXISTS padaria_pad001.order_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Use o helper no backend para aplicar o schema ativo
--    SET search_path TO padaria_pad001,public;
```

## Uso prático
- No painel **Admin > Empresas**, informe `schema_name` (como `padaria_pad001`).
- O login busca essa informação e o backend poderá executar `SET search_path TO <schema>,public` antes de cada sessão.
- O arquivo `docs/db-schema.sql` cria as tabelas obrigatórias dentro do schema `public`; cada schema adicional pode referenciá-las via `search_path` ou replicar as tabelas conforme o comportamento desejado.
