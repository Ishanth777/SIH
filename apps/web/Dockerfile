FROM node:20-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy workspace config and web app source (node_modules is excluded by .dockerignore)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web ./apps/web/

# Install dependencies cleanly inside Linux container
RUN pnpm install --filter web...

# Build Next.js application
ENV NEXT_PUBLIC_API_URL=http://localhost:3000/api
RUN pnpm --filter web build

EXPOSE 3001

CMD ["pnpm", "--filter", "web", "start", "--", "-p", "3001"]
