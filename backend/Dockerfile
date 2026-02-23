FROM node:20-alpine AS builder
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
LABEL org.opencontainers.image.source=https://github.com/Atifalin/knovo
RUN apk add --no-cache openssl openssl-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
EXPOSE 5001
CMD ["node", "dist/index.js"]
