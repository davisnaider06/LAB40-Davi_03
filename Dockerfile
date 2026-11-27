# Imagem-base oficial do Node.js 22 (Alpine: enxuta e com menor superfície de ataque)
FROM node:22-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia primeiro os manifestos para aproveitar o cache de camadas
COPY package*.json ./

# Instala somente dependências de produção, exatamente como no package-lock.json
RUN npm ci --omit=dev && npm cache clean --force

# Copia o código da aplicação
COPY src ./src
COPY public ./public

ENV NODE_ENV=production
ENV PORT=3000

# Executa sem privilégios de root
USER node

# Documenta a porta exposta
EXPOSE 3000

# Verificação de saúde do container
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]
