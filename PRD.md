# PRD — Holistic Finance Site

## Overview
**URL:** myholisticfinance.com
**Repo:** github.com/jjsupreme7/holistic-finance-site
**Client:** Friend of Jacob — CPA candidate specializing in family financial planning & wellness
**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Supabase, Stripe, Resend, Vercel

## What It Is
A professional website for a CPA candidate offering holistic financial services — family planning, tax prep, financial wellness. Includes a public-facing marketing site, a blog/content platform, and a full admin panel for the client to manage everything herself.

## What's Built

### Public Site
- **Homepage** — Hero, intro, services preview, newsletter signup, testimonials
- **Services page** — Service offerings with details
- **Blog** — Full blog with slug-based routing, SEO metadata, share buttons, loading states
- **Shop** — Stripe-integrated checkout (digital products / courses)
- **Contact form** — Submission endpoint with email delivery via Resend
- **Newsletter** — Subscribe/unsubscribe flow
- **Conversion tracking** — `/api/track/conversion` endpoint

### Admin Panel (`/admin`)
- **Auth** — Login with bcrypt + JWT (jose)
- **Blog CMS** — Create/edit/delete posts with TipTap rich text editor (bold, italic, links, highlights, colors, markdown support)
- **Email campaigns** — Create campaigns, preview, send to subscriber list
- **Analytics dashboard** — Bar charts, visitor tracking
- **Schedule management** — CRUD for appointments/availability
- **Submissions viewer** — Contact form submissions inbox
- **Subscriber management** — View/manage newsletter subscribers
- **Training modules** — Create/manage educational content series

### Backend / Integrations
- **Supabase** — Database for blog posts, schedules, training modules, subscribers
- **Stripe** — Payment processing for shop checkout
- **Resend** — Transactional and campaign emails
- **Vercel Analytics** — Built-in

## Tech Details
- Framer Motion for animations
- DOMPurify for HTML sanitization
- Lucide icons
- No ORM — direct Supabase client calls

## Quality Bar
- Mobile-responsive (Tailwind)
- SEO-optimized (metadata per page, blog slugs)
- Admin is functional but not polished — it's an internal tool

## What's Next (Priorities)
1. Blog content — site has the CMS but needs actual posts
2. Shop products — Stripe is wired but needs real product listings
3. Training modules — framework exists, needs content
4. SEO — structured data, sitemap, Open Graph images
5. Performance — image optimization, lazy loading

## Don't Touch
- Pricing / service descriptions — client decides these
- Stripe keys / Supabase credentials — env vars only
- Admin auth flow — works, don't refactor without reason
