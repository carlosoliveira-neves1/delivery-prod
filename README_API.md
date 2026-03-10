# API Vercel Functions – PostgreSQL

Este projeto agora inclui endpoints serverless (Vercel Functions) que se conectam diretamente ao PostgreSQL quando as variáveis de ambiente `DB_*` estão configuradas no deploy.

## Endpoints

- `GET /api/companies` – lista todas as empresas
- `POST /api/companies` – cria empresa (com admins padrão)
- `POST /api/auth/login` – login (email, password, companyCode)
- `POST /api/users/register` – registro de usuário

## Variáveis de ambiente (Vercel)

Configure as seguintes variáveis em **Settings → Environment Variables**:

- `DB_HOST` – endereço do PostgreSQL
- `DB_PORT` – porta (default 5432)
- `DB_USER` – usuário
- `DB_PASSWORD` – senha
- `DB_NAME` – nome do banco (default `delivery_infra`)
- `DB_SSL` – `true` se precisar de SSL
- `DB_SSL_REJECT_UNAUTHORIZED` – `false` para aceitar cert autoassinado

## Como ativar o modo API no frontend

Adicione uma variável de build no Vercel (ou no seu `.env` local) para que o frontend saiba que deve usar a API:

- `VITE_DB_HOST` – pode ser o mesmo valor de `DB_HOST` (só precisa existir para ativar o modo API)

Quando `VITE_DB_HOST` está presente, o `UserService` irá:
- Chamar `/api/companies`, `/api/auth/login`, etc.
- Não mais usar localStorage para escritas/leituras
- Manter sessão apenas no localStorage (não dados)

Fallback: se `VITE_DB_HOST` não estiver definido, o app continua operando 100% em localStorage.

## Deploy

1. Configure as variáveis `DB_*` na Vercel.
2. (Opcional) Configure `VITE_DB_HOST` para ativar o modo API.
3. Faça um novo deploy. Os endpoints estarão disponíveis em `https://<seu-site>.vercel.app/api/*`.

## Observações

- As funções usam um pool de conexões compartilhado por requisição (warm start).
- Senhas são hasheadas com `btoa(senha + 'tanamao_salt')` (compatível com o localStorage).
- Ao criar empresa, dois admins são gerados automaticamente:
  - `admin+<code>@teste.com`
  - `<code>@teste.com`
  (senha: `Carlos190702@@@`)
