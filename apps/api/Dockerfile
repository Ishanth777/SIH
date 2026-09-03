# Multi-stage build for NestJS API (Node 20 pinned per Rule E1)
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared-types then generate Prisma client and build API
RUN pnpm --filter shared-types build
RUN pnpm --filter api prisma:generate
RUN pnpm --filter api build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-types/dist ./packages/shared-types/dist
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma

RUN pnpm install --prod --frozen-lockfile
RUN pnpm --filter api prisma:generate

COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose default API port
EXPOSE 3000

USER node

CMD ["node", "apps/api/dist/main"]
