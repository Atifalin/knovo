#!/bin/sh
set -e

echo "Running Prisma migrations..."
node_modules/.bin/prisma migrate deploy

echo "Seeding database..."
node dist/seed.js || echo "Seed skipped (already seeded)"

echo "Starting server..."
exec node dist/index.js
