# Fluxo de empresas e login multitenant

## 1. Cadastro global de empresas
1. Acesse a nova tela **Admin > Empresas** (rota `/AdminCompanies`).
2. Informe nome, código (ex.: `PAD001`), schema (ex.: `padaria_pad001`) e descrição.
3. Ao enviar, o sistema normaliza o código (`uppercase`) e salva junto ao schema no storage/local.
4. A tabela lista todas as empresas, os códigos usados no login e o schema que será ativado por padrão.

## 2. Login com código da empresa
1. Na tela de login, além de e-mail e senha, informe o código da empresa (campo `Código da empresa`).
2. O `AuthContext` chama `userService.loginUser(email, password, companyCode)` para:
   - Normalizar o código (maiúsculas, trim) e buscá-lo em `companies`.
   - Validar que a empresa existe e que o usuário pertence ao mesmo código (se definido).
   - Guardar os dados da empresa ativa em `localStorage` (`tanamao_current_company`).
3. Esse código também pode servir como base para mudar o `schema`/`search_path` no futuro quando o backend PostgreSQL estiver configurado.

## 3. Meios de verificação e recuperação
- A tela de empresas mostra o schema associado para que a equipe infra saiba qual schema aplicar no banco.
- Ao fazer logout, o contexto limpa `tanamao_current_company` e `tanamao_current_user`.
- O serviço `userService.registerCompany` garante unicidade do código e aceita schema/default `public`.

## 4. Próximos passos
1. Substituir o fallback de `localStorage` por queries reais para schemas isolados (ex: `SET search_path TO <schema>` ao conectar).
2. Criar validação adicional no frontend para prevenir códigos duplicados antes de enviar o formulário.
3. Integrar o código da empresa com rotas de API para segregar dados por schema.
