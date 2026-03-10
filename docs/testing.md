# Testes após o deploy

## Acesso a rota de empresas
1. Abra https://carlosoliveira-neves1-delivery-prod.vercel.app/ e aguarde carregar a tela de login. Se necessário, abra o DevTools e confirme que o manifest/favicons estão sendo carregados (HTTP 200). O link de login principal é `/Login`.
2. Navegue para `/AdminCompanies` para cadastrar novos códigos. Cada cadastro agora cria automaticamente um usuário admin padrão (e-mail `admin+<code>@teste.com`, senha `Carlos190702@@@`). Exemplo: `admin+padaria001@teste.com` para `code=PADARIA001`.

## Fluxo multitenant
1. No formulário de login informe:
   - `E-mail`: `admin+padaria001@teste.com`
   - `Senha`: `Carlos190702@@@`
   - `Código da empresa`: `PADARIA001`
2. Após submit você deve ser redirecionado para `/AdminDashboard`. Verifique no LocalStorage (Application > Local Storage) as chaves `tanamao_current_company` e `tanamao_current_user`.

## Banco de dados local (modo offline)
- Rode `npm run db:init` para aplicar `docs/db-schema.sql` e criar schemas extras definidos em `DB_EXTRA_SCHEMAS` via `.env`. Em seguida, use `/AdminCompanies` para criar novas empresas e confirme no console que o helper `localDatabase` grava os dados.

## Seeds recomendados
1. Crie a empresa `Padaria Piloto` com código `PADARIA001` e schema `padaria_padaria001`.
2. Crie a empresa `Bistro Central` com código `BISTRO002` e schema `bistro_bistro002`.
3. Cada empresa gera o admin `admin+<code>@teste.com` com a senha fornecida acima.
