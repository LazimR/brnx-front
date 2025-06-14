# Imagem base oficial do Node.js
FROM node:20-alpine AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Build da aplicação React
RUN npm run build

# --------------------------
# Fase de produção (Nginx)
FROM nginx:alpine

# Copia o build do React para o Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia configuração customizada do Nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]