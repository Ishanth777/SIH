#!/bin/sh
set -e

echo "==> Pushing database schema..."
prisma db push --skip-generate --schema=apps/api/prisma/schema.prisma

echo "==> Applying Row-Level Security policies..."
if [ -f "infra/docker/init-scripts/02-rls-policies.sql" ]; then
  prisma db execute --file infra/docker/init-scripts/02-rls-policies.sql --schema=apps/api/prisma/schema.prisma || true
fi

echo "==> Starting application..."
exec "$@"
