# 🚀 Guia de Deploy - ChegouAí Delivery

## Deploy na Vercel

### Pré-requisitos
- Conta no GitHub (já configurada)
- Conta na Vercel (https://vercel.com)

### Passos para Deploy

#### 1. **Conectar GitHub à Vercel**
- Acesse https://vercel.com/new
- Clique em "Import Git Repository"
- Selecione `carlosoliveira-neves1/delivery-prod`

#### 2. **Configurar Projeto**
- **Project Name**: `delivery-prod` (ou seu nome preferido)
- **Framework Preset**: Vite
- **Root Directory**: `./` (raiz do projeto)
- **Build Command**: `npm run build` (já configurado)
- **Output Directory**: `dist` (já configurado)

#### 3. **Variáveis de Ambiente (Opcional)**
Se precisar de variáveis de ambiente, adicione em:
- Settings → Environment Variables

Exemplos (se necessário):
```
VITE_API_URL=https://sua-api.com
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

#### 4. **Deploy**
- Clique em "Deploy"
- Aguarde o build completar (geralmente 2-3 minutos)
- Seu site estará disponível em: `https://delivery-prod.vercel.app`

### Configurações Já Aplicadas

✅ **vercel.json** - Configurado com:
- Build command otimizado
- Output directory correto (dist)
- Rewrite rules para SPA (Single Page Application)
- Cache headers para assets estáticos

✅ **package.json** - Atualizado com:
- Nome do projeto: `chegouai-delivery`
- Scripts de build otimizados
- Todas as dependências necessárias

✅ **vite.config.js** - Configurado para:
- Build otimizado
- Alias de paths (@)
- Suporte a React

### Após o Deploy

1. **Verificar domínio personalizado** (opcional):
   - Settings → Domains
   - Adicione seu domínio customizado

2. **Configurar CI/CD automático**:
   - Cada push para `main` fará deploy automático
   - Cada PR terá preview automático

3. **Monitorar performance**:
   - Analytics → Performance
   - Verifique Core Web Vitals

### Troubleshooting

**Erro: "Build failed"**
- Verifique se todas as dependências estão em `package.json`
- Rode `npm install` localmente e teste `npm run build`

**Erro: "404 - Page not found"**
- Verifique se `vercel.json` está configurado corretamente
- Rewrite rules devem redirecionar para `/index.html`

**Erro: "Assets not loading"**
- Verifique o `vite.config.js`
- Certifique-se que o `base` está configurado corretamente

### Rollback

Se precisar voltar a uma versão anterior:
- Vá para Deployments
- Clique em "Redeploy" na versão desejada

---

**Projeto**: ChegouAí Delivery  
**Repository**: https://github.com/carlosoliveira-neves1/delivery-prod  
**Status**: Pronto para Deploy ✅
