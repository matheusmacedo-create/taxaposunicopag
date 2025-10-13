# Use Node.js 18 Alpine como base
FROM node:18-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Expor porta 8080
EXPOSE 8080

# Comando para iniciar o servidor de preview
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "8080"]
