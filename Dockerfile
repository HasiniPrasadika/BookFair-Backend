# ---- Build stage ----
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

# ---- Production stage ----
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 4000

CMD ["npm", "run", "start"]
