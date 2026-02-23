#!/bin/sh
set -e

echo "Running Prisma migrations..."
node_modules/.bin/prisma migrate deploy

echo "Checking if seed is needed..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.count().then(n => {
  if (n === 0) {
    console.log('DB empty — running seed...');
    require('./dist/seed.js');
  } else {
    console.log('DB already seeded (' + n + ' products) — skipping.');
    p.\$disconnect();
  }
}).catch(e => { console.error(e.message); p.\$disconnect(); });
"

echo "Starting server..."
exec node dist/index.js
