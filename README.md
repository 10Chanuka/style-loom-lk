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
   - Automated URL-encoded WhatsApp message generation opening `https://wa.me/94741880953`.
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
