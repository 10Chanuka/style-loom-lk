# Elegance Fashion Sri Lanka — Production Clothing E-Commerce

A modern, responsive, production-ready clothing e-commerce website specializing in **Printed T-Shirts (Unisex)**, **Kurtas (Women)**, and **Blouses (Women)** built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase (Auth, Postgres, Storage, RLS).

---

## Features Overview

1. **Product Discovery & Catalogue**:
   - Categories: Printed T-Shirts (Unisex), Kurtas (Women), Blouses (Women).
   - Real-time search, filters (size, colour, category, price, in-stock, featured), and sorting (newest, price low/high).
   - Detailed product view with zoom image gallery, variant selection (size/colour), stock availability badge, and LKR currency formatting.
2. **WhatsApp Order Checkout**:
   - Server-side price revalidation and order creation in Supabase (`orders` and `order_items`).
   - Unique order number generation (`ORD-YYYYMMDD-XXXX`).
   - Automated URL-encoded WhatsApp message generation opening `https://wa.me/94714903231`.
3. **Step-by-Step Customization Request**:
   - 5-step wizard for custom T-shirt prints, Kurta neck/sleeve embroidery, and blouse tailoring.
   - Reference image upload (JPG/PNG/WebP with 5MB validation) to Supabase Storage.
   - WhatsApp request link dispatch.
4. **Auth & Security**:
   - Supabase Email + 6-digit OTP verification flow.
   - Strict Row-Level Security (RLS) on all 12 database tables.
   - Admin function `is_admin()` protecting `/admin` routes.
   - No public administrator signup.
5. **Admin Dashboard (`/admin`)**:
   - Overview metrics: active products, low-stock warnings, pending WhatsApp orders, customization requests, review moderation, and feedback inbox.
   - Product & Variant CRUD with multiple image uploads and primary image selection.
   - Stock quantity editing with low-stock alerts.
   - Order & Customization status updates with direct WhatsApp customer chat buttons.
   - Site settings editor (business name, logo, phone, address, policies, primary accent color).

---

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend & Database**: Supabase PostgreSQL, Supabase Auth (Email OTP), Supabase Storage, Row-Level Security (RLS)
- **Forms & Validation**: React Hook Form, Zod
- **Testing**: Playwright End-to-End Test Suite

---

## Step-by-Step Supabase Setup Guide

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in or create an account.
2. Click **New Project**, select your organization, enter a name (e.g., `elegance-fashion-lk`), choose a database password, and set your region.
3. Click **Create new project** and wait for provision.

### Step 2: Run Database Migrations
1. In your Supabase project dashboard, navigate to **SQL Editor** from the left navigation.
2. Click **New query**.
3. Open [`supabase/migrations/20260824000000_initial_schema.sql`](./supabase/migrations/20260824000000_initial_schema.sql) in this codebase, copy its entire contents, paste it into the SQL editor, and click **Run**.
   *This creates all 12 database tables, indexes, updated_at triggers, the `is_admin()` security function, and strict Row-Level Security (RLS) policies.*

### Step 3: Setup Storage Buckets & Policies
1. In the Supabase **SQL Editor**, open a new query.
2. Copy the contents of [`supabase/storage_policies.sql`](./supabase/storage_policies.sql), paste into SQL Editor, and click **Run**.
   *This creates storage buckets: `product-images`, `customization-references`, and `site-assets` with public/admin access policies.*

### Step 4: Seed Initial Data
1. In the Supabase **SQL Editor**, open a new query.
2. Copy the contents of [`supabase/seed.sql`](./supabase/seed.sql), paste into SQL Editor, and click **Run**.
   *This seeds initial categories (T-Shirts, Kurtas, Blouses), 12 detailed products, size/color variants, product images, and site settings.*

---

## Supabase Email OTP Configuration

To configure Supabase Auth to send 6-digit OTP codes:

1. In Supabase Dashboard, go to **Authentication** -> **Email Templates**.
2. Click **Confirm signup**.
3. Replace the template message body so that it displays the token as a 6-digit OTP code:

```html
<h2>Verify Your Account - Elegance Fashion</h2>
<p>Your 6-digit verification code is:</p>
<h1 style="font-size: 32px; letter-spacing: 5px; color: #e11d48;">{{ .Token }}</h1>
<p>This code will expire in 60 minutes.</p>
```

4. Go to **Authentication** -> **URL Configuration** and ensure `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`) is set.

---

## Resend Email Integration Setup

For customer feedback email notifications:

1. Create a free account at [https://resend.com](https://resend.com).
2. Generate an API Key (starts with `re_...`).
3. Add `RESEND_API_KEY` and `FEEDBACK_EMAIL` in your `.env.local` file:

```env
FEEDBACK_EMAIL=info@elegancefashion.lk
RESEND_API_KEY=re_123456789
```

---

## First Administrator Setup Guide

To create your first store administrator safely:

1. Register an intended admin account through the normal website signup at `/signup` (e.g. `admin@elegancefashion.lk`).
2. Verify the 6-digit OTP code to create the user profile.
3. Open Supabase Dashboard -> **SQL Editor** and run the following command:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@elegancefashion.lk';
```

4. To remove admin access in the future, run:

```sql
UPDATE public.profiles
SET role = 'customer'
WHERE email = 'admin@elegancefashion.lk';
```

---

## Local Development Instructions

1. Clone or navigate to the project directory:
   ```bash
   cd "c:\Users\ASUS\OneDrive\Desktop\cloth buisness"
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_BUSINESS_WHATSAPP=94714903231
   FEEDBACK_EMAIL=info@elegancefashion.lk
   RESEND_API_KEY=re_123456789
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Automated End-to-End Tests

Playwright end-to-end tests are located in `tests/e2e.spec.ts`.

To run tests:
```bash
npm run test:e2e
```

---

## Deployment Instructions (Vercel)

1. Push code repository to GitHub.
2. Import project into Vercel Dashboard.
3. Add Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BUSINESS_WHATSAPP`, `FEEDBACK_EMAIL`, `RESEND_API_KEY`).
4. Click **Deploy**.
