
# CLAUDE.md - Snapgo

## Project Overview

Snapgo is a cab pooling platform for India. Users share commercial cab rides with verified co-riders heading the same way, splitting fares and reducing emissions. Built with Next.js 15 App Router and Firebase/Firestore.

## Commands

```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Vitest (watch mode)
npm run test:run       # Vitest (single run)
npm run test:coverage  # Vitest with coverage
npm run seed:firestore # Seed Firestore with default data
```

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3, Radix UI primitives, Framer Motion
- **3D:** Three.js via @react-three/fiber + @react-three/drei (homepage hero)
- **Backend:** Firebase Auth, Firestore, Firebase Admin SDK
- **Monitoring:** Sentry (@sentry/nextjs), Google Analytics 4
- **Testing:** Vitest, Testing Library, MSW
- **State:** Zustand, React Query (@tanstack/react-query)
- **Forms:** React Hook Form + Zod validation

## Architecture

Server components fetch from Firebase via `lib/content.ts` (with static fallbacks in `lib/constants.ts`), then pass data as props to client components. The admin panel at `/admin/*` is a full CMS for managing all site content.

### Directory Structure

```
app/                    # Routes + API handlers
  admin/                # Admin CMS panel (blogs, content, SEO, media, settings)
  api/                  # API routes (content/*, admin/*, auth, blogs, media, etc.)
  blog/[slug]/          # Dynamic blog pages
  (public pages)        # about, contact, faq, features, how-it-works, safety, team, etc.
components/
  layout/               # GlassNavbar, Footer, SiteLayout
  home/                 # Homepage sections (Hero3D, FeaturesGrid, StatsCounter, etc.)
  providers/            # ThemeProvider, SettingsProvider, AuthProvider, QueryProvider
  shared/               # Reusable: ScrollReveal, PageHero, FAQAccordion, animations
  ui/                   # Radix-based primitives (Button, Card, Dialog, Toast, etc.)
  about/, features/, safety/, pages/  # Page-specific components
lib/
  firebase.ts           # Client-side Firebase init
  firebase-admin.ts     # Server-side Firebase Admin init
  content.ts            # Firestore content getters (getHeroContent, getFeatures, etc.)
  constants.ts          # Static fallback data (SITE_CONFIG, HERO_CONTENT, STATS, etc.)
  api-auth.ts           # API route authentication helpers
  rate-limit.ts         # Rate limiting for API routes
  hooks/                # useDataFetch, useFirestore
  types/                # blog.ts, images.ts, seo.ts
  auth/                 # user-auth.ts, user-profile.ts
```

### Provider Hierarchy

```
ThemeProvider > SettingsProvider > AuthProvider > {children}
```

- `ThemeProvider` - next-themes for dark/light mode
- `SettingsProvider` - fetches `/api/admin/settings`, exposes `useSettings()` hook
- `AuthProvider` - Firebase auth state

### Data Path

```
Firestore: artifacts/{NEXT_PUBLIC_APP_ID}/public/data/{collection}
  -> lib/content.ts getters (server-side)
  -> Server component props
  -> Client component rendering
```

Fallback chain: Firestore data -> `lib/constants.ts` static defaults.

## Admin Panel

Full CMS at `/admin/*` with:
- Blog editor (create/edit with markdown)
- Content management (hero, features, stats, testimonials, how-it-works, about, social, contact, images, legal, safety, apps)
- Media library with file uploads (Vercel Blob / Cloudinary / S3)
- SEO tools and page metadata management
- Navigation editor
- Team and achievements management
- Site settings (name, tagline, description, contact info)

## Environment Variables

**Required (Firebase):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_APP_ID` - Firestore document path prefix (default: "default")

**File uploads (one of):**
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
- `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`
- `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_REGION` + `AWS_S3_BUCKET`

**Optional:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `GA_PROPERTY_ID` / `GOOGLE_APPLICATION_CREDENTIALS` - Google Analytics
- `SENTRY_DSN` / `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT` - Error tracking
- `NEXT_PUBLIC_INSTAGRAM_BUSINESS_ID` / `NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN` - Instagram feed
- `GOOGLE_SCRIPT_URL` - Contact form Google Sheets integration
- `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` - Admin login credentials
- `NEXT_PUBLIC_SITE_URL` - Canonical URL (default: "https://snapgo.co.in")

## Key Patterns

- **Dynamic imports** for heavy homepage sections (Hero3D, Three.js components) to reduce initial bundle
- **Animation variants** via Framer Motion in `components/shared/variants.ts`
- **`useSettings()` hook** from `SettingsProvider` for site config - avoid duplicate `/api/admin/settings` fetches
- **Server components** fetch Firestore data, client components receive via props
- **Static fallbacks** in `lib/constants.ts` used when Firestore data is unavailable
- **Firestore path:** `artifacts/{NEXT_PUBLIC_APP_ID}/public/data/{collection}` for all content collections
