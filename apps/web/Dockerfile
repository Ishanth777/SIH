# Multi-stage build for Next.js Web Client (Node 20 pinned per Rule E1)
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

# Copy root configurations and workspace dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types ./packages/shared-types
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared-types first then web
RUN pnpm --filter shared-types build

# Pass build-time environment variables for Next.js client bundling
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ARG NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

# Build web application
RUN pnpm --filter web build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3001

USER node

CMD ["pnpm", "--filter", "web", "start"]
