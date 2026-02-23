#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  KNOVO — One-Click Dev Server Launcher (macOS)
#  Usage:  ./start.sh
#  Starts PostgreSQL, backend (port 5001), and frontend (port 5173)
#  in separate Terminal tabs.
# ─────────────────────────────────────────────────────────────────────────────

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# ── Colours ──────────────────────────────────────────────────────────────────
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GOLD}  ██╗  ██╗███╗   ██╗ ██████╗ ██╗   ██╗ ██████╗ ${NC}"
echo -e "${GOLD}  ██║ ██╔╝████╗  ██║██╔═══██╗██║   ██║██╔═══██╗${NC}"
echo -e "${GOLD}  █████╔╝ ██╔██╗ ██║██║   ██║██║   ██║██║   ██║${NC}"
echo -e "${GOLD}  ██╔═██╗ ██║╚██╗██║██║   ██║╚██╗ ██╔╝██║   ██║${NC}"
echo -e "${GOLD}  ██║  ██╗██║ ╚████║╚██████╔╝ ╚████╔╝ ╚██████╔╝${NC}"
echo -e "${GOLD}  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝   ╚═══╝   ╚═════╝ ${NC}"
echo ""
echo -e "${GOLD}  Premium Men's Accessories — Dev Launcher${NC}"
echo "  ─────────────────────────────────────────"
echo ""

# ── 1. Check Node ─────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node $(node -v)${NC}"

# ── 2. Check PostgreSQL ───────────────────────────────────────────────────────
PG_BIN=""
for candidate in \
  /opt/homebrew/opt/postgresql@16/bin \
  /opt/homebrew/opt/postgresql@15/bin \
  /usr/local/opt/postgresql@16/bin \
  /usr/local/opt/postgresql@15/bin; do
  if [ -x "$candidate/pg_ctl" ]; then
    PG_BIN="$candidate"
    break
  fi
done

if [ -z "$PG_BIN" ]; then
  echo -e "${RED}✗ PostgreSQL not found. Run: brew install postgresql@16${NC}"
  exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found at $PG_BIN${NC}"

# ── 3. Start PostgreSQL if not running ────────────────────────────────────────
if ! "$PG_BIN/pg_isready" -q 2>/dev/null; then
  echo "  Starting PostgreSQL..."
  brew services start postgresql@16 2>/dev/null || \
  brew services start postgresql@15 2>/dev/null || true
  sleep 2
fi

if "$PG_BIN/pg_isready" -q 2>/dev/null; then
  echo -e "${GREEN}✓ PostgreSQL running${NC}"
else
  echo -e "${RED}✗ PostgreSQL failed to start. Check: brew services list${NC}"
  exit 1
fi

# ── 4. Create DB if missing ───────────────────────────────────────────────────
DB_NAME=$(grep DATABASE_URL "$BACKEND/.env" 2>/dev/null | sed 's/.*\/\([^"]*\).*/\1/' | tr -d '"')
DB_NAME="${DB_NAME:-knovo_db}"
DB_USER=$(whoami)

if ! "$PG_BIN/psql" -U "$DB_USER" -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "  Creating database '$DB_NAME'..."
  "$PG_BIN/psql" -U "$DB_USER" postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
  echo -e "${GREEN}✓ Database '$DB_NAME' created${NC}"
else
  echo -e "${GREEN}✓ Database '$DB_NAME' exists${NC}"
fi

# ── 5. Install dependencies ───────────────────────────────────────────────────
if [ ! -d "$BACKEND/node_modules" ]; then
  echo "  Installing backend dependencies..."
  npm install --prefix "$BACKEND" --legacy-peer-deps --silent
fi
echo -e "${GREEN}✓ Backend dependencies ready${NC}"

if [ ! -d "$FRONTEND/node_modules" ]; then
  echo "  Installing frontend dependencies..."
  npm install --prefix "$FRONTEND" --legacy-peer-deps --silent
fi
echo -e "${GREEN}✓ Frontend dependencies ready${NC}"

# ── 6. Copy .env if missing ───────────────────────────────────────────────────
if [ ! -f "$BACKEND/.env" ]; then
  cp "$BACKEND/.env.example" "$BACKEND/.env"
  # Auto-set DATABASE_URL for local macOS dev
  sed -i '' "s|postgresql://postgres:password@localhost:5432/knovo_db|postgresql://$(whoami)@localhost:5432/knovo_db|g" "$BACKEND/.env"
  echo -e "${GREEN}✓ Backend .env created from example${NC}"
fi

if [ ! -f "$FRONTEND/.env" ]; then
  cp "$FRONTEND/.env.example" "$FRONTEND/.env" 2>/dev/null || true
fi

# ── 7. Run Prisma migrate + seed ──────────────────────────────────────────────
echo "  Running database migrations..."
(cd "$BACKEND" && npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init 2>/dev/null) && \
  echo -e "${GREEN}✓ Migrations applied${NC}" || \
  echo "  (Migrations already up to date)"

echo "  Seeding database..."
(cd "$BACKEND" && npx ts-node prisma/seed.ts 2>/dev/null) && \
  echo -e "${GREEN}✓ Database seeded${NC}" || \
  echo "  (Seed already applied)"

# ── 8. Launch servers in new Terminal tabs ────────────────────────────────────
echo ""
echo "  Launching servers..."
echo ""

open -a Terminal "$ROOT"

osascript <<EOF
tell application "Terminal"
  -- Backend tab
  do script "echo ''; echo '  KNOVO Backend — http://localhost:5001'; echo ''; cd \"$BACKEND\" && npm run dev"
  delay 1
  -- Frontend tab
  tell application "System Events" to keystroke "t" using command down
  delay 0.5
  do script "echo ''; echo '  KNOVO Frontend — http://localhost:5173'; echo ''; cd \"$FRONTEND\" && npm run dev" in front window
  delay 2
  -- Open browser
  do script "sleep 3 && open http://localhost:5173" in front window
end tell
EOF

echo ""
echo -e "${GOLD}  ─────────────────────────────────────────${NC}"
echo -e "${GOLD}  KNOVO is starting up!${NC}"
echo ""
echo -e "  Frontend  →  ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend   →  ${GREEN}http://localhost:5001${NC}"
echo -e "  Admin     →  ${GREEN}http://localhost:5173/admin${NC}"
echo ""
echo -e "  Admin login: ${GOLD}admin@knovo.ca${NC} / ${GOLD}Admin@123${NC}"
echo ""
echo -e "${GOLD}  ─────────────────────────────────────────${NC}"
echo ""
