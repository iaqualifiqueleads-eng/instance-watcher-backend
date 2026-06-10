# ---- Stage 1: Build ----
  FROM node:22-alpine AS builder

  WORKDIR /app
  
  COPY package*.json ./
  RUN npm ci
  
  COPY . .
  # COPY .env .env
  RUN npm run build
  
  # ---- Stage 2: Production ----
  FROM node:22-alpine AS runner
  
  WORKDIR /app
  
  COPY package*.json ./
  RUN npm ci --omit=dev
  
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/prisma ./prisma
  COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
  # COPY --from=builder /app/.env .env
  
  EXPOSE 3000
  
  CMD ["node", "dist/src/main"]