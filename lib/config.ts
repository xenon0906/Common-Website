// ============================================================================
// ADMIN DASHBOARD & DATABASE CONFIGURATION
// ============================================================================
//
// CURRENT MODE: Static (frontend-only deployment)
// The admin dashboard is currently in static mode - changes won't persist.
// A warning banner is displayed in the admin panel when in static mode.
//
// ============================================================================
// TO ENABLE DATABASE & ADMIN PERSISTENCE:
// ============================================================================
//
// STEP 1: Set up your database
// ----------------------------------
// Choose one of these providers and get a connection URL:
// - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
// - PlanetScale: https://planetscale.com
// - Supabase: https://supabase.com
// - Railway: https://railway.app
// - Local MySQL: mysql://user:pass@localhost:3306/snapgo_db
//
// STEP 2: Add environment variable in Vercel
// ----------------------------------
// Go to Vercel Dashboard > Project Settings > Environment Variables
// Add: DATABASE_URL = "your-connection-string"
//
// STEP 3: Update this file
// ----------------------------------
// Change the line below from:
//   export const USE_DATABASE = false
// To:
//   export const USE_DATABASE = process.env.DATABASE_URL ? true : false
//
// STEP 4: Run database migrations
// ----------------------------------
// npx prisma generate
// npx prisma db push
// npx prisma db seed  (optional: seeds initial content)
//
// STEP 5: Redeploy to Vercel
// ----------------------------------
// Push changes or trigger a redeploy in Vercel dashboard
//
// ============================================================================
// WHAT HAPPENS WHEN ENABLED:
// ============================================================================
// - Admin dashboard changes persist to database
// - Warning banner disappears from admin panel
// - Content can be managed via /admin routes
// - All CRUD operations work for blogs, team, FAQ, stats, etc.
// - Instagram reels can be managed dynamically
//
// ============================================================================

export const USE_DATABASE = false

// When ready to enable Prisma/SQL, change to:
// export const USE_DATABASE = process.env.DATABASE_URL ? true : false

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================
//
// Firebase mode enables real-time database persistence using Firestore.
// When USE_FIREBASE is true:
// - Admin authentication uses Firebase Auth (anonymous or custom token)
// - Data is stored in Firestore collections
// - Real-time updates are available throughout the admin dashboard
//
// TO ENABLE FIREBASE:
// 1. Set USE_FIREBASE = true below
// 2. Add Firebase config to environment variables:
//    - NEXT_PUBLIC_FIREBASE_API_KEY
//    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
//    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//    - NEXT_PUBLIC_FIREBASE_APP_ID
// 3. OR configure window.__firebase_config and window.__app_id globals
//
// ============================================================================

export const USE_FIREBASE = !!(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
)
