# KNOVO — Premium Men's Accessories

> A production-ready full-stack eCommerce platform for KNOVO, a Canadian luxury men's accessories brand selling imported ties, pocket squares, and cufflinks.

![KNOVO](https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Quick Start (macOS — One Click)](#quick-start-macos--one-click)
4. [Manual Setup](#manual-setup)
5. [Environment Variables](#environment-variables)
6. [Stripe Integration](#stripe-integration)
7. [Admin Panel](#admin-panel)
8. [Docker Deployment](#docker-deployment)
9. [Cloud Deployment Guide](#cloud-deployment-guide)
10. [API Reference](#api-reference)
11. [Canadian Tax Rates](#canadian-tax-rates)
12. [Pages & Routes](#pages--routes)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vite 7 + React 18 + TypeScript |
| **Styling** | TailwindCSS v4 (no config file needed) |
| **State** | Zustand (cart, auth, wishlist — persisted) |
| **Forms** | React Hook Form + Zod validation |
| **Animations** | Framer Motion |
| **Routing** | React Router v6 |
| **Payments** | Stripe Elements + Payment Intents |
| **SEO** | React Helmet Async |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL via Prisma ORM |
| **Auth** | JWT (httpOnly cookies) + bcrypt |
| **Email** | Nodemailer (SMTP) |
| **Security** | Helmet, CORS, express-rate-limit |
| **Deployment** | Docker + docker-compose + Nginx |

---

## Project Structure

```
/Website
├── frontend/                 # Vite React app
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── cart/         # CartDrawer
│   │   │   ├── layout/       # Navbar, Footer, Layout, AdminLayout
│   │   │   └── ui/           # ProductCard, SkeletonCard, Pagination
│   │   ├── lib/              # api.ts, products.ts, orders.ts
│   │   ├── pages/
│   │   │   ├── admin/        # AdminDashboard, AdminProducts, AdminOrders
│   │   │   └── legal/        # PrivacyPage, TermsPage, ShippingPage, RefundPage
│   │   ├── store/            # cartStore, authStore, wishlistStore
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Router setup
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
│
├── backend/                  # Express API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/      # auth, product, order, admin, newsletter, wishlist
│   │   ├── middleware/       # auth.ts, errorHandler.ts
│   │   ├── routes/           # all route files
│   │   ├── utils/            # tax.ts, email.ts, prisma.ts
│   │   └── index.ts
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml
├── start.sh                  # One-click macOS launcher
└── README.md
```

---

## Quick Start (macOS — One Click)

### Prerequisites
- macOS 12+
- [Node.js 20+](https://nodejs.org)
- [Homebrew](https://brew.sh)

### Run

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/knovo.git
cd knovo

# 2. Double-click start.sh in Finder, or run:
./start.sh
```

The script will automatically:
- ✅ Check Node.js is installed
- ✅ Install/start PostgreSQL@16 via Homebrew
- ✅ Create the `knovo_db` database
- ✅ Install all npm dependencies
- ✅ Copy `.env.example` → `.env`
- ✅ Run Prisma migrations
- ✅ Seed 14 products (6 ties, 4 pocket squares, 4 cufflinks)
- ✅ Open backend + frontend in separate Terminal tabs
- ✅ Open http://localhost:5173 in your browser

**That's it.** The entire stack starts with one command.

---

## Manual Setup

### 1. Install PostgreSQL

```bash
brew install postgresql@16
brew services start postgresql@16
```

### 2. Create Database

```bash
psql postgres -c "CREATE DATABASE knovo_db;"
```

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, STRIPE keys
npm install
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run dev
# → Running on http://localhost:5001
```

### 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_STRIPE_PUBLISHABLE_KEY
npm install
npm run dev
# → Running on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Server
NODE_ENV=development
PORT=5001

# Database
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/knovo_db"

# JWT — use a long random string in production
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (for CORS + email links)
FRONTEND_URL=http://localhost:5173

# Shipping
FLAT_RATE_SHIPPING_CAD=12.99
FREE_SHIPPING_THRESHOLD_CAD=150

# Email (optional for dev — order emails won't send without this)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@knovo.ca
```

### Frontend (`frontend/.env`)

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Security:** Never commit `.env` files. They are in `.gitignore`.

---

## Stripe Integration

### Test Mode Setup

1. Create a free account at [stripe.com](https://stripe.com)
2. Go to **Developers → API Keys**
3. Copy your **test** publishable and secret keys
4. Add them to `backend/.env` and `frontend/.env`

### Test Card Numbers

| Card | Number | Use |
|---|---|---|
| Visa (success) | `4242 4242 4242 4242` | Standard success |
| Requires auth | `4000 0025 0000 3155` | 3D Secure |
| Declined | `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date and any 3-digit CVC.

### Webhook (local testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local backend
stripe listen --forward-to localhost:5001/api/orders/webhook

# Copy the webhook signing secret shown and add to backend/.env:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Admin Panel

Access at: **http://localhost:5173/admin**

| Credential | Value |
|---|---|
| Email | `admin@knovo.ca` |
| Password | `Admin@123` |

> **Change this password before deploying to production.**

### Admin Features
- **Dashboard** — Revenue, order count, active products, recent orders, top-selling products
- **Products** — Create, edit, toggle featured/active, manage stock, upload image URLs
- **Orders** — View all orders, update status (PENDING → PAID → SHIPPED → COMPLETED)

---

## Docker Deployment

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Step 1 — Configure Environment

```bash
# Create backend .env from example
cp backend/.env.example backend/.env
```

Edit `backend/.env` with production values:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@postgres:5432/knovo_db
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_IN_PRODUCTION
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
```

### Step 2 — Build & Start

```bash
# Build all images and start containers
docker-compose up --build -d

# Check all containers are running
docker-compose ps
```

Expected output:
```
NAME                STATUS
knovo_postgres      running
knovo_backend       running
knovo_frontend      running
```

### Step 3 — Run Migrations & Seed

```bash
# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed initial data
docker-compose exec backend npx ts-node prisma/seed.ts
```

### Step 4 — Access

| Service | URL |
|---|---|
| Store | http://localhost |
| Admin | http://localhost/admin |
| API | http://localhost/api |

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Stop everything
docker-compose down

# Stop and remove volumes (DELETES DATABASE)
docker-compose down -v

# Rebuild after code changes
docker-compose up --build -d
```

---

## Cloud Deployment Guide

### Option A — DigitalOcean Droplet (Recommended, ~$12/month)

#### 1. Create a Droplet
- Ubuntu 22.04 LTS, 2GB RAM / 1 vCPU minimum
- Add your SSH key

#### 2. Install Docker on the Droplet

```bash
ssh root@YOUR_DROPLET_IP

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
apt-get install -y docker-compose-plugin
```

#### 3. Upload Your Code

```bash
# From your local machine
git push origin main

# On the droplet
git clone https://github.com/yourusername/knovo.git
cd knovo
```

#### 4. Configure & Deploy

```bash
cp backend/.env.example backend/.env
nano backend/.env  # Fill in production values

docker-compose up --build -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx ts-node prisma/seed.ts
```

#### 5. Point Your Domain

In your DNS provider, add an A record:
```
@ → YOUR_DROPLET_IP
www → YOUR_DROPLET_IP
```

#### 6. Add SSL with Certbot

```bash
apt-get install -y certbot python3-certbot-nginx

# Stop frontend container temporarily
docker-compose stop frontend

# Get certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx.conf to use SSL, then restart
docker-compose up -d
```

---

### Option B — Railway (Easiest, free tier available)

#### Backend on Railway

1. Go to [railway.app](https://railway.app) → New Project
2. **Add PostgreSQL** — Railway provisions it automatically
3. **Deploy from GitHub** → select your repo → set root to `/backend`
4. Add environment variables in Railway dashboard
5. Set `DATABASE_URL` to the Railway PostgreSQL connection string

#### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo → set root to `/frontend`
3. Add environment variable: `VITE_STRIPE_PUBLISHABLE_KEY`
4. Update `FRONTEND_URL` in Railway backend env to your Vercel URL
5. Update `vite.config.ts` proxy target to your Railway backend URL

---

### Option C — AWS EC2 + RDS

#### 1. Create RDS PostgreSQL Instance
- Engine: PostgreSQL 16
- Instance: db.t3.micro (free tier eligible)
- Note the endpoint, username, password, database name

#### 2. Create EC2 Instance
- Amazon Linux 2023 or Ubuntu 22.04
- t3.micro (free tier eligible)
- Security group: open ports 22, 80, 443

#### 3. Deploy

```bash
ssh ec2-user@YOUR_EC2_IP

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Clone and configure
git clone https://github.com/yourusername/knovo.git
cd knovo
cp backend/.env.example backend/.env
# Set DATABASE_URL to your RDS endpoint

# Start (without postgres service — using RDS)
docker-compose up --build -d frontend backend
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new customer |
| POST | `/api/auth/login` | — | Login, returns JWT cookie |
| POST | `/api/auth/logout` | ✓ | Clear auth cookie |
| GET | `/api/auth/me` | ✓ | Get current user profile |
| POST | `/api/auth/forgot-password` | — | Send password reset email |
| POST | `/api/auth/reset-password` | — | Reset password with token |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | — | List products (filter, sort, paginate) |
| GET | `/api/products/:slug` | — | Get single product |
| GET | `/api/products/categories` | — | List all categories |
| GET | `/api/products/filter-options` | — | Get available colors & materials |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Deactivate product |
| PATCH | `/api/products/:id/stock` | Admin | Adjust stock quantity |

**Query Parameters for GET /api/products:**
```
page=1&limit=12&sort=newest|price_asc|price_desc
category=ties|pocket-squares|cufflinks
color=Navy&material=Silk
minPrice=50&maxPrice=200
search=silk+tie
featured=true
```

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders/payment-intent` | ✓ | Create Stripe Payment Intent |
| POST | `/api/orders` | ✓ | Create order after payment |
| GET | `/api/orders/my-orders` | ✓ | Customer's order history |
| GET | `/api/orders/admin` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |
| POST | `/api/orders/webhook` | — | Stripe webhook handler |

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/newsletter/subscribe` | — | Newsletter signup |
| GET | `/api/newsletter/subscribers` | Admin | List subscribers |
| GET | `/api/wishlist` | ✓ | Get user's wishlist |
| POST | `/api/wishlist` | ✓ | Add product to wishlist |
| DELETE | `/api/wishlist/:productId` | ✓ | Remove from wishlist |
| GET | `/api/admin/analytics` | Admin | Dashboard analytics |

---

## Canadian Tax Rates

Taxes are calculated server-side based on the shipping province:

| Province | Code | Rate | Type |
|---|---|---|---|
| Ontario | ON | 13% | HST |
| British Columbia | BC | 12% | GST + PST |
| Quebec | QC | 14.975% | GST + QST |
| Alberta | AB | 5% | GST only |
| Manitoba | MB | 12% | GST + PST |
| Saskatchewan | SK | 11% | GST + PST |
| Nova Scotia | NS | 15% | HST |
| New Brunswick | NB | 15% | HST |
| Newfoundland | NL | 15% | HST |
| PEI | PE | 15% | HST |
| Yukon / NWT / Nunavut | YT/NT/NU | 5% | GST only |

---

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — hero, categories, featured, testimonials | — |
| `/shop` | Shop — filter, sort, search, paginate | — |
| `/products/:slug` | Product Detail — images, attributes, add to cart | — |
| `/checkout` | Checkout — Stripe payment, tax calc | ✓ |
| `/order-success/:id` | Order Confirmation | ✓ |
| `/login` | Login | — |
| `/register` | Register | — |
| `/forgot-password` | Password Reset Request | — |
| `/account` | Order History | ✓ |
| `/account/wishlist` | Wishlist | ✓ |
| `/about` | About KNOVO | — |
| `/contact` | Contact Form | — |
| `/faq` | FAQ | — |
| `/privacy` | Privacy Policy (PIPEDA) | — |
| `/terms` | Terms & Conditions | — |
| `/shipping` | Shipping & Returns | — |
| `/refund` | Refund Policy | — |
| `/admin` | Admin Dashboard | Admin |
| `/admin/products` | Product Manager | Admin |
| `/admin/orders` | Order Manager | Admin |

---

## Going Live Checklist

- [ ] Replace Stripe test keys with live keys
- [ ] Change admin password from `Admin@123`
- [ ] Set a strong `JWT_SECRET` (32+ random chars)
- [ ] Configure SMTP for order confirmation emails
- [ ] Set `FRONTEND_URL` to your production domain
- [ ] Enable HTTPS / SSL certificate
- [ ] Set `NODE_ENV=production`
- [ ] Review and update `CORS` origin in `backend/src/index.ts`
- [ ] Set up Stripe webhook endpoint in Stripe Dashboard → Developers → Webhooks
- [ ] Configure database backups (DigitalOcean Managed DB or RDS automated backups)

---

## License

MIT © KNOVO 2025
