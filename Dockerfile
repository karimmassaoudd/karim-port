# syntax=docker/dockerfile:1

FROM node:20-slim AS deps
WORKDIR /app
RUN npm install -g pnpm@10.20.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-slim AS builder
WORKDIR /app
RUN npm install -g pnpm@10.20.0
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@10.20.0
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]
