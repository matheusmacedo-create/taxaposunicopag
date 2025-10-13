# UnicoPag PoS - Sistema de Propostas de Taxas

Sistema desenvolvido para geração de propostas de taxas de cartão personalizadas para clientes UnicoPag.

## Funcionalidades

- **Sistema de Autenticação**: Login seguro para acesso ao sistema
- Consulta de dados de CNPJ
- Geração de propostas de taxas personalizadas
- Upload e análise de planilhas de taxas
- Envio de propostas por e-mail e WhatsApp
- Dashboard com métricas e histórico

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Query

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build para produção
pnpm build
```

## Docker

### Desenvolvimento (com Hot Reload)

```bash
# Executar em modo desenvolvimento (hot reload ativo)
npm run docker:dev

# Ou diretamente com docker-compose
docker-compose up frontend

# Ver logs em tempo real
npm run docker:logs

# Parar os containers
npm run docker:down
```

### Produção

```bash
# Build e execução completa (todos os serviços)
docker-compose -f docker-compose.yml up -d

# Build apenas do frontend
npm run docker:build
```

### Configuração

- **Desenvolvimento**: Usa `Dockerfile.dev` com hot reload
- **Porta**: 5173 (Vite dev server)
- **Volumes**: Código fonte montado para hot reload
- **Ambiente**: NODE_ENV=development

## Acesso ao Sistema

### Credenciais de Demonstração

- **Email**: admin@unicopag.com
- **Senha**: admin123

> **Nota**: As credenciais de demonstração são exibidas automaticamente na tela de login apenas em ambiente de desenvolvimento (NODE_ENV !== 'production').

### Como Acessar

1. Acesse a aplicação em `http://localhost:5173`
2. Você será redirecionado para a tela de login
3. Use as credenciais acima para fazer login
4. Após o login bem-sucedido, você será redirecionado automaticamente para o Dashboard
5. A partir do Dashboard, você pode acessar todas as funcionalidades do sistema
