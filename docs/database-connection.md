# Conexão automatizada com o banco de dados

Este script visa facilitar a validação da conectividade com o banco PostgreSQL remoto sem precisar abrir um cliente externo.

### 1. Variáveis de ambiente necessárias
Crie um arquivo `.env` na raiz (já ignorado pelo `.gitignore`) contendo ao menos:

```env
DB_HOST=delivery_infra.postgresql.dbaas.com.br
DB_USER=delivery_infra
DB_PASSWORD=Carlos190702@@
DB_NAME=delivery_infra          # opcional
DB_PORT=5432                    # opcional, padrão 5432
DB_SSL=true                     # opcional, true para usar SSL
DB_SSL_REJECT_UNAUTHORIZED=false # opcional, false quando o certificado é confiável
DB_HEALTH_CHECK=SELECT version() AS version
```

> **⚠️ Segurança:** não compartilhe este arquivo nem comite o `.env` com credenciais sensíveis. Se for necessário versionar dados de configuração, utilize um `.env.example` sem valores reais e explique como preenchê-lo.

### 2. Instalar dependências (se ainda não instaladas)

```bash
npm install
```

A automação depende de `pg` e `dotenv`, já adicionados como dependências de desenvolvimento.

### 3. Rodar o script de verificação

```bash
npm run db:connect
```

O script:

1. Carrega as variáveis de ambiente (via `dotenv`).
2. Valida que `DB_HOST`, `DB_USER` e `DB_PASSWORD` estejam configurados.
3. Tenta se conectar ao banco usando `pg`.
4. Executa `DB_HEALTH_CHECK` (padrão `SELECT now()`), mostrando o resultado.

Em caso de erro, o comando sai com código `1` e imprime a mensagem retornada pelo banco.

### 4. Alternativas e ajustes
- Para testes rápidos, exporte manualmente as variáveis no terminal em vez de usar `.env`:
  ```bash
  set DB_HOST=delivery_infra.postgresql.dbaas.com.br
  set DB_USER=delivery_infra
  set DB_PASSWORD=Carlos190702@@
  npm run db:connect
  ```
- Se o banco exigir autenticação com certificados, adicione os caminhos dos certificados em `scripts/connect-db.mjs` e passe via variáveis adicionais (como `DB_SSL_CERT`).

Se quiser automatizar rotinas adicionais (migração, backups, etc.), posso ajudar a expandir este helper.
