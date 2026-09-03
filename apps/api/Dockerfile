FROM node:20-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy workspace config and api source (node_modules excluded by .dockerignore)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api ./apps/api/

# Install dependencies cleanly inside Linux container
RUN pnpm install --filter api...

# Generate Prisma Client & build API
RUN pnpm --filter api prisma:generate && pnpm --filter api build

EXPOSE 3000

CMD ["sh", "-c", "pnpm --filter api exec prisma db push && pnpm --filter api start:prod"]
