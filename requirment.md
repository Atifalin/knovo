Build a production-ready full-stack eCommerce website for a premium men’s accessories brand called KNOVO selling:

Ties

Pocket Squares

Cufflinks

Target market: Canada
Currency: CAD

Brand positioning:
Luxury, clean, modern, masculine, refined, premium imported goods.

Use the uploaded KNOVO logo as brand identity reference (navy + gold color palette).

🏗 TECH STACK REQUIREMENTS

Frontend:

Vite + React

TypeScript

TailwindCSS (custom brand theme)

React Router

React Hook Form

Zod validation

Axios

Zustand or Context for cart state

Headless UI (optional)

Framer Motion (subtle animations only)

Backend:

Node.js

Express

TypeScript

PostgreSQL (via Prisma ORM)

REST API

JWT auth

Role-based access (Admin / Customer)

Stripe integration (latest API version)

Environment variable configuration

Proper production folder structure

Deployment-ready:

Dockerized

.env example file

Production build scripts

CORS properly configured

Secure headers (Helmet)

Rate limiting

Input sanitization

🎨 DESIGN REQUIREMENTS

Design must be:

Minimalist luxury aesthetic

Navy (#0B1F3B range) + Gold (#C6A75E range)

White background

Generous spacing

Serif font for headings

Clean sans-serif for body

Premium brand feel similar to:

Tom Ford

Hugo Boss

Paul Smith

Animations:

Subtle fade-ins

Smooth hover effects

Product zoom on hover

Elegant cart slide panel

Must be fully:

Responsive

Mobile-first

Fast loading

Optimized images

🛍 CORE STORE FEATURES
Public Pages

Home

Shop (filterable)

Category pages:

Ties

Pocket Squares

Cufflinks

Product Details Page

About Us

Contact

FAQ

Privacy Policy (Canadian compliant)

Terms & Conditions

Shipping & Returns

404 Page

🛒 ECOMMERCE FEATURES

Cart:

Add to cart

Remove

Update quantity

Persist in local storage

Cart drawer UI

Checkout:

Stripe Payment Intents

Secure backend verification

Collect:

Name

Email

Address

Province

Postal Code

Shipping calculation (flat rate configurable)

Tax calculation (GST/HST/PST based on province)

Order confirmation:

Success page

Order stored in database

Email confirmation (Nodemailer or Sendgrid placeholder)

Admin receives order notification

📦 PRODUCT MODEL

Product must support:

Name

Description

Price (CAD)

SKU

Category

Stock quantity

Multiple images

Featured flag

Imported brand tag

Material (silk, cotton etc)

Color

Pattern

Active/Inactive toggle

Inventory:

Reduce stock on successful payment

Prevent purchase if out of stock

Admin stock adjustment

Low stock warning flag

🔐 AUTH SYSTEM

Customer:

Register

Login

Forgot password

Order history

Admin:

Secure admin login

Role-based middleware

Dashboard

Security:

Hashed passwords (bcrypt)

JWT authentication

Secure cookies (httpOnly)

CSRF protection

Rate limiting

Input validation on all endpoints

🛠 ADMIN PANEL FEATURES

Admin dashboard must allow:

Add product

Edit product

Delete product

Upload images

Toggle featured

Adjust stock

View orders

Update order status:

Pending

Paid

Shipped

Completed

Cancelled

Basic sales analytics:

Total revenue

Orders count

Top products

Admin routes must be protected.

💳 STRIPE INTEGRATION

Implement:

Stripe Payment Intents

Webhook endpoint

Verify payment before marking order as paid

Secure secret key handling

Test mode support

Proper error handling

📈 SEO & PERFORMANCE

Proper meta tags

OpenGraph support

Sitemap generation

Robots.txt

Lazy loading images

Clean semantic HTML

Lighthouse optimized

📜 LEGAL PAGES

Generate basic but structured:

Privacy Policy (Canada compliant)

Terms & Conditions

Shipping Policy

Refund Policy

Content should be editable later.

🔧 EXTRA PROFESSIONAL TOUCHES (IMPORTANT)

Also include:

Wishlist feature

Newsletter signup (store emails in DB)

Product filtering:

Price

Color

Material

Category

Sorting:

Price low-high

Price high-low

Newest

Search functionality

Pagination

Loading states

Error boundaries

Toast notifications

Graceful failure handling

Skeleton loaders

Clean folder structure

Clear README with setup instructions

🧠 DATABASE SCHEMA

Include models for:

User

Product

Category

Order

OrderItem

NewsletterSubscriber

Use proper relational mapping.

🧪 SEED DATA

Include sample:

6 ties

4 pocket squares

4 cufflinks

With images placeholders.

🚀 FINAL DELIVERABLE

Fully structured project

Frontend and backend separated

Clear setup instructions

Ready to deploy

No mock-only functionality

Real working Stripe test flow

Generate clean, maintainable, scalable code following modern best practices and enterprise-level structure.